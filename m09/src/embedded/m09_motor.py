from adafruit_motor import motor
from adafruit_pca9685 import PCA9685
from adafruit_servokit import ServoKit
import board
import busio

# 모터 구조체
class motor_control:
    def __init__(self, channel=0):
        self.channel = channel
        i2c = busio.I2C(board.SCL, board.SDA)
        self.pwm = PCA9685(i2c)
        self.pwm.frequency = 60  # PCA9685 주파수 설정
        self.kit = ServoKit(channels=16, i2c=i2c, address=0x60) # 서보 모터 설정
        self.pan_middle = 100
        self.pan = self.pan_middle  # 서보 모터 초기 위치 설정
        self.kit.servo[0].angle = self.pan

    # throttle 조정
    def set_throttle(self, throttle):
        pulse = int(0xFFFF * abs(throttle))  # 16비트 듀티 사이클 계산
       
        if throttle > 0:
            self.pwm.channels[self.channel + 5].duty_cycle = pulse
            self.pwm.channels[self.channel + 4].duty_cycle = 0
            self.pwm.channels[self.channel + 3].duty_cycle = 0xFFFF
        elif throttle < 0:
            self.pwm.channels[self.channel + 5].duty_cycle = pulse
            self.pwm.channels[self.channel + 4].duty_cycle = 0xFFFF
            self.pwm.channels[self.channel + 3].duty_cycle = 0
        else:
            self.pwm.channels[self.channel + 5].duty_cycle = 0
            self.pwm.channels[self.channel + 4].duty_cycle = 0
            self.pwm.channels[self.channel + 3].duty_cycle = 0
    
    # steering 조정
    def _set_steer_raw(self, raw_steering):
        raw_steering = min(self.pan_middle + 45, max(self.pan_middle - 45, raw_steering))
        self.pan = self.kit.servo[0].angle = raw_steering

    def set_steering(self, steering):
        steering = min(1, max(-1, steering))
        self._set_steer_raw(self.pan_middle + steering * 45)

    # 매크로
    def left(self):
        self.set_steering(-0.75)

    def right(self):
        self.set_steering(0.75)

    def middle(self):
        self.set_steering(0)
    
    def forward(self):
        self.set_throttle(0.5)

    def backward(self):
        self.set_throttle(-0.5)
    
    def brake(self):
        self.set_throttle(0)

    # 종료
    def terminate(self):
        self.set_throttle(0)  # 모터 정지
        self.set_steering(0) # 서보 모터 초기 위치로 리셋
        self.pwm.deinit()  # PCA9685 정리