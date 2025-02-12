import cv2

class camera:
    def __init__(self, cam_width, cam_height):
        self.cap = cv2.VideoCapture(0)
        self.cap.set(cv2.CAP_PROP_FRAME_WIDTH, cam_width)
        self.cap.set(cv2.CAP_PROP_FRAME_HEIGHT, cam_height)
        self.cam_width = cam_width
        self.cam_height = cam_height

    def read(self):
        return self.cap.read()