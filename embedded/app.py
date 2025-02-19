from fastapi import FastAPI
from fastapi.encoders import jsonable_encoder
from fastapi.responses import StreamingResponse, JSONResponse, Response
from socketio import AsyncServer, ASGIApp
import requests
import json
import asyncio
from pydantic import BaseModel

app = FastAPI()
sio = AsyncServer(async_mode="asgi")
socket_app = ASGIApp(sio, app)
__byte_frame = None
internal_server_address = "http://backend:8080"

# A dictionary to keep track of connected clients and their SIDs
connected_clients = {}

class tool_list(BaseModel):
    name: list

# 이벤트 핸들러

# 클라이언트 연결
@sio.event
async def connect(sid, environ):
    print(f"Client connected: {sid}")
    # Track the client (SID)
    connected_clients[sid] = environ
    # Optionally, emit a welcome message to the client
    await sio.emit('message', {'data': 'Welcome to the server!'}, to=sid)

# 연결 해제
@sio.event
async def disconnect(sid):
    print(f"Client disconnected: {sid}")
    if sid in connected_clients:
        del connected_clients[sid]

# 카메라
@app.get("/barebone/camera/stream")
async def camera_stream():
    try :
        return StreamingResponse(_stream_gen(), media_type="multipart/x-mixed-replace; boundary=frame")
    except Exception as e :
        print("stream error : ",str(e))

@app.post("/barebone/camera/start")
async def camera_start():
    try:
        global sio
        await sio.emit("camera_start")
    except:
        return Response(status_code=502)
    
    return Response(status_code=200)

@app.post("/barebone/camera/stop")
async def camera_stop():
    try:
        global sio
        await sio.emit("camera_stop")
    except:
        return Response(status_code=502)
    return Response(status_code=200)

# 주행
@app.post("/barebone/drive/{drive}")
async def auto_drive(drive: str):
    if drive not in ["start", "stop"]:
        return Response(status_code=401)
    
    try:
        global sio
        await sio.emit("drive", drive)
    except:
        return Response(status_code=502)
    
    return Response(status_code=200)

# 수동 조작
@app.post("/barebone/manual-drive/{drive}")
async def manual_drive(drive: str):
    if drive not in ["forward", "backward", "stop", "left", "right"]:
        return Response(status_code=401)
    
    try:
        global sio
        await sio.emit("manual_drive", drive)
    except:
        return Response(status_code=502)
    
    return Response(status_code=200)

@app.post("/barebone/detect-helmet/start")
async def helmet_detect_start():
    try:
        global sio
        await sio.emit("helmet_detect_start", ["helmet"])
    except:
        return Response(status_code=502)
    
    return Response(status_code=200)

@app.post("/barebone/detect-helmet/stop")
async def helmet_detect_stop():
    try:
        global sio
        await sio.emit("helmet_detect_stop")
    except:
        return Response(status_code=502)
    return Response(status_code=200)

@app.post("/barebone/detect-09/start")
async def tool_detect_start(tool_list: tool_list):
    try:
        global sio
        await sio.emit("tool_detect_start", tool_list.name)
    except:
        return Response(status_code=502)
    
    return Response(status_code=200)

@app.post("/barebone/detect-09/stop")
async def tool_detect_stop():
    try:
        global sio
        await sio.emit("tool_detect_stop")
    except:
        return Response(status_code=502)
    return Response(status_code=200)

@app.post("/barebone/nfc/start")
async def nfc_start():
    try:
        global sio
        await sio.emit("nfc_start")
    except:
        return Response(status_code=502)
    
    return Response(status_code=200)

@app.post("/barebone/nfc/stop")
async def nfc_stop():
    try:
        global sio
        await sio.emit("nfc_stop")
    except:
        return Response(status_code=502)
    return Response(status_code=200)

# 프레임 생성
async def _stream_gen():   
    global __byte_frame
    fps = 30
    try : 
        while True:
            if not __byte_frame:
                continue
            yield (b"--frame\r\n"
                   b"Content-Type: image/jpg\r\n\r\n" + __byte_frame + b"\r\n")

            await asyncio.sleep(1 / fps)
                
    except GeneratorExit:
        pass

# 웹소켓 핸들러

# 클라이언트로부터 프레임 데이터를 수신하는 Socket.IO 이벤트 핸들러.
@sio.on("stream")
async def echo_frame(sid, message):

    global __byte_frame
    __byte_frame = message  # 수신한 메시지를 전역 변수에 저장

@sio.on("detect-helmet")
async def helmet_check_ack(sid, helmet_check):
    print(f"Helmet check: {str(helmet_check)}")
    url = internal_server_address + "/api/v1/queue/helmet"
    headers = {"Content-Type": "application/json"}
    response = requests.post(url, data = json.dumps(helmet_check), headers=headers)
    print(f"Transmitted internal helmet check: {response}")

# 공구 체크 데이터 전송
@sio.on("detect-09")
async def tool_check_ack(sid, tool_check):
    print(f"Tool check: {str(tool_check)}")
    url = internal_server_address + "/api/v1/queue/tool"
    headers = {"Content-Type": "application/json"}
    response = requests.post(url, data = json.dumps(tool_check), headers=headers)
    print(f"Transmitted internal tool check: {response}")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(socket_app, host="0.0.0.0", port=8765)