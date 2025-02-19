import cv2
import socketio
import os
import __main__
from threading import Thread
from time import sleep

__address = os.environ["M09_SERVER_ADDRESS"] 
sio_cli = socketio.Client()
sio_cli.connect(__address)

# cv 이미지 프레임을 지정된 웹소켓에 스트리밍
def stream_cv_frame(frame):
    bytecode = __bytecode_cv_frame(frame)
    sio_cli.emit("stream", bytecode)

# 바이트 코드로 변환
def __bytecode_cv_frame(frame):
    return cv2.imencode('.jpg', frame)[1].tobytes()

# 공구 감지 보내기
def transmit_detect_check(tool_check, prefix):
    sio_cli.emit(prefix, tool_check)


# 서버 응답 처리

# 카메라 시작
@sio_cli.event
def camera_start():
    __main__.cap.start()
    while not __main__.cap._initiated:
        sleep(0.1)
    sio_cli.emit("cam_ok")
# 카메라 종료
@sio_cli.event
def camera_stop():
    __main__.cap.stop()

# 주행
@sio_cli.event
def drive(operation):
    if operation == "start":
        __main__.object_tracer.start()
        while not __main__.object_tracer._initiated:
            sleep(0.1)
        sio_cli.emit("cam_ok")
    elif operation == "stop":
        __main__.object_tracer.stop()

# 수동 조작
@sio_cli.event
def manual_drive(operation):
    if operation == "forward":
        __main__.motor_controller.forward()
    elif operation == "backward":
        __main__.motor_controller.backward()
    elif operation == "stop":
        __main__.motor_controller.brake()
    elif operation == "left":
        __main__.motor_controller.btn_left()
    elif operation == "right":
        __main__.motor_controller.btn_right()

# 헬멧멧 인식
@sio_cli.event
def helmet_detect_start(helmet_list):
    __main__.helmet_detect.start(detect_list=helmet_list)
    while not __main__.helmet_detect._initiated:
        sleep(0.1)
    sio_cli.emit("cam_ok")

@sio_cli.event
def helmet_detect_stop():
    __main__.helmet_detect.stop()

# 공구 인식
@sio_cli.event
def tool_detect_start(tool_list):
    __main__.object_detect.start(detect_list=tool_list)
    while not __main__.object_detect._initiated:
        sleep(0.1)
    sio_cli.emit("cam_ok")

@sio_cli.event
def tool_detect_stop():
    __main__.object_detect.stop()

@sio_cli.event
def connect():
    print("Connected to the server")

# Event handler for when the server sends a message
@sio_cli.event
def message(data):
    print(f"Received message from server: {data['data']}")

# Event handler for when the client disconnects from the server
@sio_cli.event
def disconnect():
    print("Disconnected from the server")