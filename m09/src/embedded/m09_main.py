from m09_motor import *
from m09_trace import *
from matplotlib import use as matploblib_use
from time import sleep
import sys

yolo_model = "custom.pt"

if __name__ == "__main__":
    _headless = ("--headless" in sys.argv) or ("-hl" in sys.argv)
    _manual = ("--manual" in sys.argv) or ("-m" in sys.argv)

    if _headless:
        matploblib_use("Agg")
        print("[OrinCar] Headlessmode.")

    motor_controller = motor_control(0)

    if not _manual:
        object_tracer = trace(motor_controller, _headless=_headless, yolo_model=yolo_model)
        object_tracer.start()

    try:
        while True:
            sleep(0.1)
    except KeyboardInterrupt:
        pass

    motor_controller.terminate()
    print("[OrinCar] Program stopped and motor stopped.")