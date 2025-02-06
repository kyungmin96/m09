import asyncio
from flask import Flask
from flask import request
from flask import Response
from flask import stream_with_context
from flask_socketio import SocketIO

app = Flask( __name__ )
socket_io = SocketIO(app)
__byte_frame = None

@app.route("/stream")
def stream():
    try :
        return Response(stream_with_context(stream_gen()), mimetype="multipart/x-mixed-replace; boundary=frame" )
    except Exception as e :
        print("stream error : ",str(e))

def stream_gen():   
    global __byte_frame
    try : 
        while True :
            if not __byte_frame:
                continue
            yield (b"--frame\r\n"
                   b"Content-Type: image/jpeg\r\n\r\n" + __byte_frame + b"\r\n")
                    
    except GeneratorExit :
        pass

@socket_io.on("stream")
def echo(message):
    global __byte_frame
    __byte_frame = message

if __name__ == "__main__":
    socket_io.run(app, debug=False, host="0.0.0.0", port=8765)