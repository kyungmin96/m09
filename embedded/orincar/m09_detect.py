import cv2
import os
import torch
from ultralytics import YOLO
from threading import Thread
from m09_socketio import stream_cv_frame, transmit_detect_check

class detect:
    def __init__(self, camera, yolo_model, prefix="detect-09"):
        self.camera = camera
        self._thread = None
        self._initiated = False
        self.prefix = prefix

        self.device = "cuda" if torch.cuda.is_available() else "cpu"
        yolo_model = yolo_model
        self.yolo = YOLO(yolo_model)
        self.yolo.to(self.device)
    
    def _run(self, detect_list):
        # 메인 루프
        print(detect_list)
        detect_state = {}
        for item in detect_list:
            detect_state[item] = 0
        detect_check = {}
        for item in detect_list:
            detect_check[item] = False

        # cuda 사용
        use_cuda = cv2.cuda.getCudaEnabledDeviceCount() > 0

        if use_cuda:
            print("[OrinCar] CUDA activated for DETECT.")
        else:
            print("[OrinCar] Unable to activate CUDA, Using CPU for DETECT...")

        # 구 프레임 버리기
        for _ in range(2):
            self.camera.cap.grab()

        self._initiated = True
        while self._initiated:
            ret, frame = self.camera.read()
            if not ret:
                print("[OrinCar] Error: Could not read frame.")
                continue

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
            
            yolo_results = self.yolo(frame, verbose=False)

            for result in yolo_results:
                for box in result.boxes:
                    x1, y1, x2, y2 = box.xyxy[0].tolist()
                    confidence = box.conf[0].item()
                    
                    if confidence < 0.5:
                        continue

                    class_id = box.cls[0].item()
                    detect_name = self.yolo.names[int(class_id)]
                    label = f"{detect_name}: {confidence:.2f}"
                    
                    cv2.rectangle(frame, (int(x1), int(y1)), (int(x2), int(y2)), (0, 255, 0), 2)
                    cv2.putText(frame, label, (int(x1), int((y1 + y2) //2)), cv2.FONT_HERSHEY_SIMPLEX, 0.5, (0, 255, 0), 2)

                    print(f"[OrinCar] Detected: {label}")

                    if detect_name not in detect_list:
                        continue

                    detect_state[detect_name] += 1
                    if not detect_check[detect_name] and detect_state[detect_name] >= 60:
                        detect_check[detect_name] = True
                        print(f"[OrinCar] Transmit detect: {label}")
                        transmit_detect_check(detect_check, self.prefix)
                    
            stream_cv_frame(frame)

    def start(self, detect_list=[]):
        self.stop()
        if self._thread != None or self.camera.is_busy():
            print("[OrinCar] Failed to start DETECT")
            return
        self.camera.set_busy(True)
        self._thread = Thread(target=self._run, args=(detect_list,))
        self._thread.start()

    def stop(self):
        self._initiated = False
        if self._thread != None and self._thread.is_alive():
            self._thread.join()
        self.camera.set_busy(False)
        self._thread = None
        print("[OrinCar] Stopped DETECT")
