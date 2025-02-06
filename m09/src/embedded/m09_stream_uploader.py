import cv2
import socketio
import os

try:
    stream_port = stream_port
except:
    stream_port = 8765

__address = "http://" + os.environ["STREAM_SERVER_ADDRESS"] + f":{stream_port}"
sio_cli = socketio.Client()
sio_cli.connect(__address)

# cv 이미지 프레임을 지정된 웹소켓에 스트리밍
def stream_cv_frame(frame):
    bytecode = __bytecode_cv_frame(frame)
    sio_cli.emit("stream", bytecode)

# 바이트 코드로 변환
def __bytecode_cv_frame(frame):
    width = 640
    height = 480
    return cv2.imencode('.jpg', frame)[1].tobytes()

@sio_cli.on("response")
def response(data):
    print(data)  # {'from': 'server'}