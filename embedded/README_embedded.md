# M09 Embedded

---

**SSAFY 12기 A202 Prefix의 AIoT 프로젝트**

## QuickStart

1. 환경 변수 설정

- 오린카
    - `M09_TRACK_MODEL`: 추적 주행에 사용할 YOLO 모델입니다. `./yolo_models/tracing_model.pt` 사용을 권장합니다.
    - `M09_HELMET_MODEL`: 헬멧 인식에 사용할 YOLO 모델입니다. `./yolo_models/helmet_model.pt` 사용을 권장합니다.
    - `M09_TOOL_MODEL`: 공구 인식에 사용할 YOLO 모델입니다. `./yolo_models/tools_model.pt` 사용을 권장합니다.
    - `M09_TARGET`: 추적 주행에 사용할 대상 레이블입니다. `leader_vest` 사용을 권장합니다.
    - `M09_DANGER_THRESHOLD`: 위험 회피 한계값입니다. `150`로 설정하는 것을 권장합니다.
    - `M09_SERVER_ADDRESS`: 임베디드와 연결된 웹소켓 주소 Base Url입니다.
- 라즈베리 파이
    - `M09_BACKEND_ADDRESS`: 백엔드 요청 주소 BaeUrl입니다.
    - `M09_SERVER_ADDRESS`: 임베디드와 연결된 웹소켓 주소 Base Url입니다.

2. 모듈 설명

- `./app.py`: 임베디드 - 백엔드를 잇는 FastAPI 애플리케이션입니다.
- `./requirements.txt`: `./app.py`를 위한 pip 패키지 정보들입니다.


- `./orincar/m09_camera.py`: 카메라 모듈입니다.
- `./orincar/m09_detect.py`: 물체 감지 모듈입니다.
- `./orincar/m09_motor.py`: 모터 모듈입니다.
- `./orincar/m09_socketio.py`: 소켓 통신 모듈입니다.
- `./orincar/m09_ssh_control.py`: ssh 연결 조작 모듈입니다.
- `./orincar/m09_trace.py`: 추종 주행 모듈입니다.
- `./orincar/m09_main.py`: 메인 모듈입니다.
- `./orincar/requirements.txt`: 오린카를 위한 pip 패키지 정보들입니다.


- `./raspberrypi/m09_nfc.py`: nfc 인식 모듈입니다.
- `./raspberrypi/requirements.txt`: 라즈베리 파이를 위한 pip 정보들입니다.

3. 실행

**반드시 결선을 확인한 상태에서 진행해 주세요**

**오린카의 경우, `OpenCV` 환경에서 `CUDA`를 사용할 수 있음를 전제로 합니다. 가상 환경 구성시 주의하세요.**

- 오린카: `~/m09_orin_car/main.py`를 실행합니다. 다음과 같은 옵션이 사용 가능하며, 사전에 환경 변수를 설정해야 합니다.
    - `--manual` 또는 `-m`: SSH 수동 키보드 조작을 활성화합니다.
    - `--vnc` 또는 `-v`: VNC 연결 또는 모니터 등이 연결되어 있을 때 해당 방향으로 출력합니다.

- 라즈베리 파이: `~/m09_nfc/main.py`를 실행합니다. 옵션은 따로 없으며, 사전에 환경 변수를 설정해야 합니다.

---

## 구현 사양

- 추종 자율 주행
    - YOLO v8 기반 추적과 구현
    - MiDaS 기반 회피 구현
    - 소형 모델 사용 및 점진적 전이학습으로 최적화
- 통신
    - WebSocket을 통한 FastAPI 간이 서버와 임베디드 장치 간 통신