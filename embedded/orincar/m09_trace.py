from m09_motor import *
import cv2
import torch
from numpy import arange
from scipy.interpolate import RectBivariateSpline
from ultralytics import YOLO
from threading import Thread
import os

# 추적 구조체
class trace:
    def __init__(self, motor_control, camera, _headless, min_distance_range=75, max_distance_range=500):
        self.motor_controller = motor_control
        self._headless = _headless
        # 모델 설정
        self.device = "cuda" if torch.cuda.is_available() else "cpu"
        yolo_model = os.environ["M09_TRACK_MODEL"] 
        self.yolo = YOLO(yolo_model)
        self.yolo.to(self.device)
        
        self.midas = torch.hub.load("intel-isl/MiDaS", "MiDaS_small", pretrained=True)
        self.midas.to(self.device)
        self.midas.eval()

        target_label = os.environ["M09_TARGET"]
        self.target_label = 0
        for key, val in self.yolo.names.items():
            if val == target_label:
                self.target_label = int(key)
            
        self._initiated = False
        # 카메라
        self.camera = camera
        
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
        # 주행 루프
        # GPU에서 CUDA 사용 가능 여부
        use_cuda = cv2.cuda.getCudaEnabledDeviceCount() > 0

        if self._headless:
            from m09_socketio import stream_cv_frame

        if use_cuda:
            print("[OrinCar] CUDA activated.")
        else:
            print("[OrinCar] Unable to activate CUDA, Using CPU...")

        prev_depth = 0.0
        depth_scale = 1.0
        direction_trace_range = self.camera.cam_width // 32
        tick_count = 0

        transforms = torch.hub.load('intel-isl/MiDaS','transforms')
        transform = transforms.small_transform

        threshold = int(os.environ["M09_DANGER_THRESHOLD"])

        prev_speed = 0

        # 구 프레임 버리기
        for _ in range(2):
            self.camera.cap.grab()
            
        self._initiated = True
        while self._initiated:
            ret, frame = self.camera.read()
            if not ret:
                print("[OrinCar] Error: Could not read frame.")
                break

            # GPU를 사용한 이미지 처리
            if use_cuda:
                gpu_frame = cv2.cuda_GpuMat()
                gpu_frame.upload(frame)
                gpu_frame = cv2.cuda.resize(gpu_frame, (self.camera.cam_width, self.camera.cam_height))
                # GPU에서 컬러 변환 (BGR to HSV) -> 다시 BGR로 변환하여 출력
                gpu_hsv = cv2.cuda.cvtColor(gpu_frame, cv2.COLOR_BGR2HSV)
                gpu_processed = cv2.cuda.cvtColor(gpu_hsv, cv2.COLOR_HSV2BGR)
                frame = gpu_processed.download()  # 다시 CPU 메모리로 가져오기
            else:
                # 프레임 변환
                frame = cv2.resize(frame, (self.camera.cam_width, self.camera.cam_height))
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
            frame_center_x = self.camera.cam_width // 2
            frame_center_y = self.camera.cam_height // 2

            # 중앙 범위의 실제 거리 계산
            frame_center_depth = spline(frame_center_y, frame_center_x)[0][0]
            frame_center_distance = self._depth_to_distance(frame_center_depth, depth_scale=depth_scale)
            print(F"[OrinCar] Distance Center: {frame_center_distance}")

            # YOLO 모델을 사용하여 객체 감지
            yolo_results = self.yolo(frame)
            speed = 0
            is_danger = False
            ref_dist = 998244353
            found_target = False
            steer_value = 0

            for result in yolo_results:
                detect_boxes = []
                for box in result.boxes:
                    detect_boxes.append(box)
                detect_boxes.sort(key=lambda box : 0 if box.cls[0].item() == self.target_label else 1)
                detect_boxes = detect_boxes[:min(4, len(detect_boxes))]

                for box in detect_boxes:
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

                    if int(class_id) == self.target_label:
                        print("[OrinCar] Hey! There's a leader vest!")

                        found_target = True
                        ref_dist = object_distance

                        speed = 0.6

                        if object_distance < self.min_distance_range:
                            speed = 0

                        if is_danger:
                            continue
                        
                        if object_distance > self.max_distance_range * 0.75:
                            speed = 0.85

                        if object_distance > self.max_distance_range:
                            speed = 1.0

                        steer_value = (object_center_x - frame_center_x) / 150 * (0.99 ** (object_distance / 100))
                        print(f"[OrinCar] trace_steer: {steer_value}")
                        self.motor_controller.set_steering(steer_value)

                        cv2.rectangle(frame, (int(x1), int(y1)), (int(x2), int(y2)), (0, 255, 0), 2)
                        cv2.putText(frame, label + f" dist: {object_distance}", (int(x1), int((y1 + y2) //2)), cv2.FONT_HERSHEY_SIMPLEX, 0.5, (0, 255, 0), 2)
                    elif (x1 >= frame_center_x - threshold and x2 <= frame_center_x + threshold) or (x1 < frame_center_x - threshold and x2 >= frame_center_x - threshold) or (x2 > frame_center_x + threshold and x1 <= frame_center_x + threshold):
                        cv2.rectangle(frame, (int(x1), int(y1)), (int(x2), int(y2)), (0, 0, 255), 2)
                        cv2.putText(frame, label + f" dist: {object_distance}", (int(x1), int((y1 + y2) //2)), cv2.FONT_HERSHEY_SIMPLEX, 0.5, (0, 0, 255), 2)

                        # tmp
                        continue

                        if ref_dist < object_distance + 100:
                            continue

                        is_danger = True
                        ref_dist = object_distance
                        dir = -1 if frame_center_x - object_center_x < 0 else 1
                        steer_value = (dir * threshold / (abs(frame_center_x - object_center_x) + 1)) * (0.99 ** (object_distance / 100))
                        print(f"[OrinCar] evade_steer: {steer_value}")
                        self.motor_controller.set_steering(steer_value)
                    else:
                        cv2.rectangle(frame, (int(x1), int(y1)), (int(x2), int(y2)), (255, 255, 0), 2)
                        cv2.putText(frame, label + f" dist: {object_distance}", (int(x1), int((y1 + y2) //2)), cv2.FONT_HERSHEY_SIMPLEX, 0.5, (255, 255, 0), 2)

            # new logic
            frame_focus_y = self.camera.cam_height * 2 // 3
            frame_sub_focus_y = self.camera.cam_height * 5 // 6
            dander_ref_x = frame_center_x
            danger_ref_dist = 998244353

            for i in range(frame_center_x - threshold, frame_center_x + threshold):
                cur_depth = spline(frame_focus_y, i)[0][0]
                cur_distance = self._depth_to_distance(cur_depth, depth_scale=depth_scale)

                sub_depth = spline(frame_sub_focus_y, i)[0][0]
                sub_distance = self._depth_to_distance(sub_depth, depth_scale=depth_scale)

                if sub_distance > self.max_distance_range * 0.3125 and cur_distance > self.max_distance_range * 0.75 and ref_dist < cur_distance + 100:
                    continue

                danger_ref_dist = min(cur_distance, danger_ref_dist)
                is_danger = True

            if is_danger:
                left_avg = sum([self._depth_to_distance(spline(frame_focus_y, i)[0][0], depth_scale=depth_scale) *  0.9 ** abs(i - frame_center_x) for i in range(frame_center_x - threshold)])
                right_avg = sum([self._depth_to_distance(spline(frame_focus_y, i)[0][0], depth_scale=depth_scale) *  0.9 ** abs(i - frame_center_x) for i in range(frame_center_x + threshold, self.camera.cam_width)])
                dir = 1 if left_avg < right_avg else -1
                print("[OrinCar] Danger!")
                danger_steer_value = dir * (0.75 ** (danger_ref_dist / 100))
                self.motor_controller.set_steering((danger_steer_value * 4 + steer_value * 6) / 10)
                speed *= 0.875


            self.motor_controller.set_throttle((speed + prev_speed) / 2)
            prev_speed = speed

            tick_count += 1
            if not self._headless:
                if tick_count & 1:
                    cv2.imshow("OrinCar MO9", frame)

                if cv2.waitKey(1) & 0xFF == ord("q"):
                    cv2.destroyAllWindows()
                    break
            else:
                stream_cv_frame(frame)
                
    def start(self):
        if self._thread and self._thread.is_alive():
            self.stop()
        if self._headless:
            from m09_socketio import stream_cv_frame
        self._thread = Thread(target=self._run)
        self._thread.start()

    def stop(self):
        self._initiated = False
        self.motor_controller.brake()
        if self._thread and self._thread.is_alive():
            self._thread.join()