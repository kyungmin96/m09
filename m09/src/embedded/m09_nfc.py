from time import sleep
import board
import busio
from adafruit_pn532.spi import PN532_SPI
from digitalio import DigitalInOut
import signal
from RPLCD.i2c import CharLCD
import requests
import json
import RPi.GPIO as GPIO

# 요청을 보낼 URL
url = "http://70.12.246.80:8080/api/rfid/login"

# 요청 헤더 설정 (JSON 형식 명시)
headers = {
    "Content-Type": "application/json"
}
lcd = CharLCD('PCF8574', 0x27)
lcd.write_string("Tag your ID Card")

# 종료 시그널 핸들러
do_scan = True
def signal_handler(signum, frame):
    global do_scan
    do_scan = False
    GPIO.cleanup()
    exit()

signal.signal(signal.SIGINT, signal_handler)

# PN532 SPI 설정
spi = busio.SPI(board.SCK, board.MOSI, board.MISO)
cs_pin = DigitalInOut(board.D6)

# NFC 모듈 연결 확인
not_connected = True
pn532 = None
while not_connected:
    try:
        pn532 = PN532_SPI(spi, cs_pin, debug=False)
        not_connected = False
    except:
        pass

pn532.SAM_configuration()

# NFC 태그 감지 루프
while do_scan:
    try:
        uid = pn532.read_passive_target(timeout=0.5)
        if uid:
            print("NFC 태그 감지!")
            # UID를 16진수 리스트로 변환
            arr = "".join([hex(i) for i in uid])
            print(arr)
            # JSON 형식으로 변환
            uid_json = json.dumps({"UID": arr}, indent=4)            
            # POST 요청 보내기 (json 매개변수 사용)
            response = requests.post(url, data=uid_json, headers=headers)
            lcd.clear()
            lcd.write_string('LOGIN SUCCESS!!!')
            sleep(1.5)                                                            
            
    except Exception as e:
        print("NFC 읽기 오류:", e)