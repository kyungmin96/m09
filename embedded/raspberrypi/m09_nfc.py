from time import sleep
import board
import busio
from adafruit_pn532.spi import PN532_SPI
from digitalio import DigitalInOut
from RPLCD.i2c import CharLCD
import requests
import json
import RPi.GPIO as GPIO
import os
from threading import Thread
import socketio

# nfc 구조체
class nfc:
    def __init__(self):
        self.base_url = os.environ["M09_BACKEND_ADDRESS"]
        self.lcd = CharLCD('PCF8574', 0x27)
        self._initiated = False
        # PN532 SPI 설정
        spi = busio.SPI(board.SCK, board.MOSI, board.MISO)
        cs_pin = DigitalInOut(board.D6)

        # NFC 모듈 연결 확인
        not_connected = True
        self.pn532 = None
        while not_connected:
            try:
                self.pn532 = PN532_SPI(spi, cs_pin, debug=False)
                not_connected = False
            except:
                pass

        self.pn532.SAM_configuration()
        
        self._thread = None

    def _run(self):
        self._initiated = True
        
        # 요청을 보낼 URL
        url = self.base_url + "/api/v1/queue/rfid"
        # 요청 헤더 설정 (JSON 형식 명시)
        headers = {
            "Content-Type": "application/json"
        }
        
        while self._initiated:
            try:
                self.lcd.clear()
                self.lcd.write_string("Tag your ID Card")
                uid = self.pn532.read_passive_target(timeout=0.5)
                if uid:
                    print("NFC 태그 감지!")
                    # UID를 16진수 리스트로 변환
                    arr = "".join([hex(i) for i in uid])
                    print(arr)
                    # JSON 형식으로 변환
                    uid_json = json.dumps({"UID": arr}, indent=4)            
                    # POST 요청 보내기 (json 매개변수 사용)
                    response = requests.post(url, data=uid_json, headers=headers)
                    print(response)
                    self.lcd.clear()
                    self.lcd.write_string('LOGIN SUCCESS!!!')
                    sleep(1.5)
                    self.lcd.clear()
            except Exception as e:
                print("NFC 읽기 오류:", e)

    def start(self):
        if self._thread and self._thread.is_alive():
            self.stop()
        self.lcd.clear()
        self._thread = Thread(target=self._run)
        self._thread.start()

    def stop(self):
        self._initiated = False
        self.lcd.clear()
        if self._thread and self._thread.is_alive():
            self._thread.join()

nfc_reader = nfc()
# nfc_reader.start()
__address = os.environ["M09_SERVER_ADDRESS"] 
sio_cli = socketio.Client()
sio_cli.connect(__address)
print("Server Connected!")

@sio_cli.event
def nfc_start():
    print("NFC Start!")
    nfc_reader.start()

@sio_cli.event
def nfc_stop():
    print("NFC Stop!")
    nfc_reader.stop()

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

try:
    while True:
        sleep(1)
except KeyboardInterrupt:
    nfc_reader.stop()
    print("Program end...")
    GPIO.cleanup()
    pass