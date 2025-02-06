from m09_motor import *
from threading import Thread
from sshkeyboard import listen_keyboard, stop_listening

class ssh_control:
    def __init__(self, motor_control):
        self.motor_controller = motor_control
        self._thread = None
        self._is_steering = False
        self._steer_thread = None

    def _on_press(self, key):
        try:
            if key == "w":
                print("[OrinCar] Motor forward")     
                self.motor_controller.forward()  # 전진 50% 속도
            elif key == "s":
                print("[OrinCar] Motor backward")
                self.motor_controller.backward()  # 후진 50% 속도 
            elif key == "a":
                print("[OrinCar] Servo left")
                self.motor_controller.left()
            elif key == "d":
                print("[OrinCar] Servo right")
                self.motor_controller.right()
            elif key == "x":
                self.motor_controller.brake()
                print("[OrinCar] Activate Brake!")
            elif key == "p":
                stop_listening()
                print("[OrinCar] Closing SSH Control...")
        except:
            pass
        
    def _on_release(self, key):    
        if key in ["a", "d"]:
            print("[OrinCar] Servo middle")
            self.motor_controller.middle()

    def start(self):
        self._thread = Thread(target=listen_keyboard, args=(self._on_press, self._on_release))
        self._thread.start()
    
    def stop(self):
        self._on_press("p")
        if self._thread and self._thread.is_alive():
            self._is_steering = False
            if self._steer_thread and self._steer_thread.is_alive():
                self._steer_thread.join()
            self._thread.join()