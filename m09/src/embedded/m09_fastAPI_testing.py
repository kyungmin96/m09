from fastapi import FastAPI
from fastapi.responses import  StreamingResponse
from socketio import AsyncServer, ASGIApp
import asyncio

app = FastAPI()
sio = AsyncServer(async_mode="asgi")
socket_app = ASGIApp(sio, app)
__byte_frame = None

fps = 24

@app.get("/stream")
async def stream():
    try :
        return StreamingResponse(stream_gen(), media_type="multipart/x-mixed-replace; boundary=frame")
    except Exception as e :
        print("stream error : ",str(e))

async def stream_gen():   
    global __byte_frame
    try : 
        while True:
            if not __byte_frame:
                continue
            yield (b"--frame\r\n"
                   b"Content-Type: image/jpeg\r\n\r\n" + __byte_frame + b"\r\n")

            await asyncio.sleep(1 / fps) 
                
    except GeneratorExit:
        pass

@sio.on("stream")
async def echo(sid, message):
    """
    클라이언트로부터 프레임 데이터를 수신하는 Socket.IO 이벤트 핸들러.
    """
    global __byte_frame
    __byte_frame = message  # 수신한 메시지를 전역 변수에 저장

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(socket_app, host="0.0.0.0", port=8765)