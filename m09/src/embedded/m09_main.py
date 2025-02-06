from m09_motor import *
from matplotlib import use as matploblib_use
from time import sleep
import sys

yolo_model = "custom.pt"
stream_port = 8765

if __name__ == "__main__":
    _headless = ("--headless" in sys.argv) or ("-hl" in sys.argv)
    _manual = ("--manual" in sys.argv) or ("-m" in sys.argv)

    if _headless:
        matploblib_use("Agg")
        print("[OrinCar] Headless Mode.")

    motor_controller = motor_control(0)

    if not _manual:
        from m09_trace import *
        object_tracer = trace(motor_controller, _headless=_headless, yolo_model=yolo_model)
        object_tracer.start()
        print("[OrinCar] Tracing Enabled!")
    else:
        from m09_ssh_control import *
        ssh_controller = ssh_control(motor_controller)
        ssh_controller.start()
        print("[OrinCar] SSH Control Enabled!")

    try:
        while True:
            sleep(0.1)
    except KeyboardInterrupt:
        pass
    
    if not _manual:
        object_tracer.stop()
    else:
        ssh_controller.stop()

    motor_controller.terminate()
    print("[OrinCar] Program stopped and motor stopped.")