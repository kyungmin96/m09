import cv2
from m09_socketio import stream_cv_frame
import torch
from threading import Thread

class camera:
    def __init__(self, cam_width, cam_height):
        self._initiated = False
        self._thread = None

        self.cap = cv2.VideoCapture(0)
        self.cap.set(cv2.CAP_PROP_FRAME_WIDTH, cam_width)
        self.cap.set(cv2.CAP_PROP_FRAME_HEIGHT, cam_height)
        self.cam_width = cam_width
        self.cam_height = cam_height

    def read(self):
        return self.cap.read()
    
    def _run(self):
        # 메인 루프
        self._initiated = True

        # cuda 사용
        use_cuda = cv2.cuda.getCudaEnabledDeviceCount() > 0

        if use_cuda:
            print("[OrinCar] CUDA activated.")
        else:
            print("[OrinCar] Unable to activate CUDA, Using CPU...")

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

            stream_cv_frame(frame)

    def start(self):
        if self._thread and self._thread.is_alive():
            self.stop()
        self._thread = Thread(target=self._run)
        self._thread.start()

    def stop(self):
        self._initiated = False
        if self._thread and self._thread.is_alive():
            self._thread.join()
