from m09_motor import *
import cv2
import torch
from numpy import arange
from scipy.interpolate import RectBivariateSpline
from ultralytics import YOLO
from threading import Thread

# 추적 구조체
class trace:
    def __init__(self, motor_control, _headless, yolo_model, target_label="person", cam_width=640, cam_height=480, min_distance_range=100, max_distance_range=500):
        self.motor_controller = motor_control
        self._headless = _headless
        # 모델 설정
        self.device = "cuda" if torch.cuda.is_available() else "cpu"
        self.yolo = YOLO(yolo_model)
        self.yolo.to(self.device)
        self.midas = torch.hub.load("intel-isl/MiDaS", "MiDaS_small", pretrained=True)
        self.midas.to(self.device)
        self.midas.eval()
        self.target_label = target_label
        self._initiated = True
        # 카메라 0 = 웹캡
        self.cap = cv2.VideoCapture(0)
        self.cap.set(cv2.CAP_PROP_FRAME_WIDTH, cam_width)
        self.cap.set(cv2.CAP_PROP_FRAME_HEIGHT, cam_height)
        print(f"[OrinCar] CAM size: {self.cap.get(cv2.CAP_PROP_FRAME_WIDTH)} x {self.cap.get(cv2.CAP_PROP_FRAME_HEIGHT)}")

        self.cam_width = cam_width
        self.cam_height = cam_height
        
        self.min_distance_range = min_distance_range
        self.max_distance_range = max_distance_range
        self._thread = None

    def _apply_ema_filter(prev_depth, current_depth, alpha=0.2):
        filtered_depth = alpha * current_depth + (1 - alpha) * prev_depth
        prev_depth = filtered_depth  # Update the previous depth value
        return filtered_depth

    def _depth_to_distance(self, depth_value, depth_scale):
        return 100 / (depth_value * depth_scale)

    def _run(self):
        # GPU에서 CUDA 사용 가능 여부
        use_cuda = cv2.cuda.getCudaEnabledDeviceCount() > 0

        if self._headless:
            from m09_stream_uploader import stream_cv_frame

        if use_cuda:
            print("[OrinCar] CUDA activated.")
        else:
            print("[OrinCar] Unable to activate CUDA, Using CPU...")

        prev_depth = 0.0
        depth_scale = 1.0
        direction_trace_range = self.cam_width // 32

        transforms = torch.hub.load('intel-isl/MiDaS','transforms')
        transform = transforms.small_transform

        while self._initiated:
            ret, frame = self.cap.read()
            if not ret:
                print("[OrinCar] Error: Could not read frame.")
                break

            # 구 프레임 버리기
            for _ in range(2):
                self.cap.grab()

            # GPU를 사용한 이미지 처리
            if use_cuda:
                gpu_frame = cv2.cuda_GpuMat()
                gpu_frame.upload(frame)
                gpu_frame = cv2.cuda.resize(gpu_frame, (self.cam_width, self.cam_height))
                # GPU에서 컬러 변환 (BGR to HSV) -> 다시 BGR로 변환하여 출력
                gpu_hsv = cv2.cuda.cvtColor(gpu_frame, cv2.COLOR_BGR2HSV)
                gpu_processed = cv2.cuda.cvtColor(gpu_hsv, cv2.COLOR_HSV2BGR)
                frame = gpu_processed.download()  # 다시 CPU 메모리로 가져오기
            else:
                # 프레임 변환
                frame = cv2.resize(frame, (self.cam_width, self.cam_height))
                frame = frame

            midas_input = transform(frame)
            mi_device = midas_input.to(self.device)
            with torch.no_grad():
                prediction = self.midas(mi_device)
                prediction = torch.nn.functional.interpolate(
                    prediction.unsqueeze(1),
                    size=frame.shape[:2],
                    mode='bicubic',
                    align_corners=False
                )

            output = prediction.squeeze().cpu().numpy()
            output_norm = cv2.normalize(output, None, 0, 1, norm_type=cv2.NORM_MINMAX, dtype=cv2.CV_32F)

            h, w = output_norm.shape
            x_grid = arange(w)
            y_grid = arange(h)
            spline = RectBivariateSpline(y_grid, x_grid, output_norm)
            frame_center_x = self.cam_width // 2
            frame_center_y = self.cam_height // 2

            # 중앙 범위의 실제 거리 계산
            frame_center_depth = spline(frame_center_y, frame_center_x)[0][0]
            frame_center_distance = self._depth_to_distance(frame_center_depth, depth_scale=depth_scale)
            print(F"[OrinCar] Distance Center: {frame_center_distance}")
            # YOLO 모델을 사용하여 객체 감지
            yolo_results = self.yolo(frame)
            speed = 0
            for result in yolo_results:
                for box in result.boxes:
                    x1, y1, x2, y2 = box.xyxy[0].tolist()
                    confidence = box.conf[0].item()

                    if confidence < 0.5:
                        continue

                    class_id = box.cls[0].item()
                    label = f"{self.yolo.names[int(class_id)]}: {confidence:.2f}"
                    
                    object_center_x = (x1 + x2) // 2
                    object_center_y = (x1 + y2) // 2
                    object_depth = spline(object_center_y, object_center_x)[0][0]
                    object_distance = self._depth_to_distance(object_depth, depth_scale=depth_scale)

                    if self.yolo.names[int(class_id)] == self.target_label:
                        if confidence < 0.8:
                            continue
                        print("[OrinCar] Hey! There's a Person!")
                        
                        person_center_x = (x1 + x2) // 2
                        speed = 0.6

                        if object_distance < self.min_distance_range:
                            speed = 0
                        elif object_distance > self.max_distance_range:
                            speed = 0.85

                        if person_center_x < frame_center_x - direction_trace_range:   
                            print("[OrinCar] Turn left")
                            self.motor_controller.left()
                        elif person_center_x > frame_center_x + direction_trace_range: 
                            print("[OrinCar] Turn right")
                            self.motor_controller.right()
                        else:
                            self.motor_controller.middle()
                            
                    cv2.rectangle(frame, (int(x1), int(y1)), (int(x2), int(y2)), (0, 255, 0), 2)
                    cv2.putText(frame, label + f" dist: {object_distance}", (int(x1), int((y1 + y2) //2)), cv2.FONT_HERSHEY_SIMPLEX, 0.5, (0, 255, 0), 2)
            
            self.motor_controller.set_throttle(speed)
            if not self._headless:
                cv2.imshow("OrinCar MO9", frame)
                if cv2.waitKey(1) & 0xFF == ord("q"):
                    cv2.destroyAllWindows()
                    break
            else:
                stream_cv_frame(frame)
                
    def start(self):
        if self._thread and self._thread.is_active():
            self.stop()
        if self._headless:
            from m09_stream_uploader import stream_cv_frame
        self._thread = Thread(target=self._run)
        self._thread.start()

    def stop(self):
        self._initiated = False
        if self._thread and self._thread.is_alive():
            self._thread.join()