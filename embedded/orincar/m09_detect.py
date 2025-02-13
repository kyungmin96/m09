import cv2
import os
import torch
from ultralytics import YOLO
from threading import Thread
from m09_socketio import stream_cv_frame, transmit_tool_check

class detect:
    def __init__(self, camera):
        self.camera = camera
        self._thread = None
        self._initiated = False

        self.device = "cuda" if torch.cuda.is_available() else "cpu"
        yolo_model = os.environ["M09_TOOL_MODEL"]
        self.yolo = YOLO(yolo_model)
        self.yolo.to(self.device)
    
    def _run(self, tool_list):
        # 메인 루프
        self._initiated = True

        tool_state = {}
        for tool in tool_list:
            tool_state[tool] = 0
        tool_check = {}
        for tool in tool_list:
            tool_check[tool] = False

        # cuda 사용
        use_cuda = cv2.cuda.getCudaEnabledDeviceCount() > 0

        if use_cuda:
            print("[OrinCar] CUDA activated.")
        else:
            print("[OrinCar] Unable to activate CUDA, Using CPU...")

        while self._initiated:
            ret, frame = self.camera.read()
            if not ret:
                print("[OrinCar] Error: Could not read frame.")
                break

            # 구 프레임 버리기
            for _ in range(2):
                self.camera.cap.grab()

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
            
            yolo_results = self.yolo(frame)

            for result in yolo_results:
                for box in result.boxes:
                    x1, y1, x2, y2 = box.xyxy[0].tolist()
                    confidence = box.conf[0].item()
                    
                    if confidence < 0.5:
                        continue

                    class_id = box.cls[0].item()
                    tool_name = self.yolo.names[int(class_id)]
                    label = f"{tool_name}: {confidence:.2f}"
                    
                    cv2.rectangle(frame, (int(x1), int(y1)), (int(x2), int(y2)), (0, 255, 0), 2)
                    cv2.putText(frame, label, (int(x1), int((y1 + y2) //2)), cv2.FONT_HERSHEY_SIMPLEX, 0.5, (0, 255, 0), 2)

                    if tool_name not in tool_list:
                        continue

                    tool_state[tool_name] += 1
                    if not tool_check[tool_name] and tool_state[tool_name] >= 60:
                        tool_check[tool_name] = True
                        transmit_tool_check(tool_check)
                    
            stream_cv_frame(frame)

    def start(self, tool_list=[]):
        if self._thread and self._thread.is_alive():
            self.stop()
        self._thread = Thread(target=self._run, args=(tool_list,))
        self._thread.start()

    def stop(self):
        self._initiated = False
        if self._thread and self._thread.is_alive():
            self._thread.join()
