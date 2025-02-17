import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Header } from '@/shared/ui/Header/Header';
import "./styles.scss";
import {
  manualDriveForward,
  manualDriveBackward,
  manualDriveLeft,
  manualDriveRight,
  manualDriveStop,
  startDrive,
  stopDrive,
} from "@/features/auth/embedded/embedded_api";

export const WorkplaceMovePage = ({ mode = "to-workplace" }) => {
  const navigate = useNavigate();
  const [activeMode, setActiveMode] = useState("follow");
  const [isStopped, setIsStopped] = useState(false);
  const [error, setError] = useState(null);

  const handleModeChange = (mode) => {
    setActiveMode(mode);
    // 모드 변경 시 이전 상태 초기화
    setIsStopped(false);
    setError(null);
  };

  const handleToggleStop = async () => {
    try {
      if (!isStopped) {
        await stopDrive();
      } else {
        await startDrive();
      }
      setIsStopped(prev => !prev);
    } catch (err) {
      setError(err.message);
      console.error("주행 상태 변경 실패:", err);
    }
  };

  const handleManualDrive = async (direction) => {
    try {
      switch (direction) {
        case "forward":
          await manualDriveForward();
          break;
        case "backward":
          await manualDriveBackward();
          break;
        case "left":
          await manualDriveLeft();
          break;
        case "right":
          await manualDriveRight();
          break;
        case "stop":
          await manualDriveStop();
          break;
        default:
          throw new Error("잘못된 방향 요청");
      }
    } catch (err) {
      setError(err.message);
      console.error(`수동 주행 ${direction} 요청 실패:`, err);
    }
  };

  const handleButtonClick = () => {
    if (mode === "to-workplace") {
      navigate("/worker/while-work");
    } else if (mode === "to-warehouse") {
      navigate("/worker/tool-check/after");
    }
  };

  return (
    <div className="workplace-move">
      <Header mode={mode} />
      <div className="mode-selector">
        <button
          className={`mode-button ${activeMode === "follow" ? "active" : ""}`}
          onClick={() => handleModeChange("follow")}
        >
          작업자 따라가기
        </button>
        <button
          className={`mode-button ${activeMode === "manual" ? "active" : ""}`}
          onClick={() => handleModeChange("manual")}
        >
          수동 조작
        </button>
      </div>

      <div className="content-area">
        <video
          className="streaming-video"
          src="http://example.com/live/stream.m3u8"
          autoPlay
          muted
          playsInline
        />

        {activeMode === "manual" && (
          <div className="direction-controls">
            <div className="circle">
              <button 
                className="arrow up" 
                aria-label="Up"
                onMouseDown={() => handleManualDrive("forward")}
                onMouseUp={() => handleManualDrive("stop")}
              ></button>
              <div className="horizontal-buttons">
                <button 
                  className="arrow left" 
                  aria-label="Left"
                  onMouseDown={() => handleManualDrive("left")}
                  onMouseUp={() => handleManualDrive("stop")}
                ></button>
                <button 
                  className="pause" 
                  aria-label="Pause"
                  onClick={() => handleManualDrive("stop")}
                ></button>
                <button 
                  className="arrow right" 
                  aria-label="Right"
                  onMouseDown={() => handleManualDrive("right")}
                  onMouseUp={() => handleManualDrive("stop")}
                ></button>
              </div>
              <button 
                className="arrow down" 
                aria-label="Down"
                onMouseDown={() => handleManualDrive("backward")}
                onMouseUp={() => handleManualDrive("stop")}
              ></button>
            </div>
          </div>
        )}
      </div>

      <div className="control-panel">
        {activeMode === "follow" && (
          <div
            className={`toggle-button ${isStopped ? "stopped" : "started"}`}
            onClick={handleToggleStop}
          >
            <div className={`toggle-circle ${isStopped ? "stopped" : ""}`} />
            <span className={`toggle-label ${isStopped ? "stopped" : "started"}`}>
              {isStopped ? "멈춤" : "재시동"}
            </span>
          </div>
        )}
        <button 
          className={`start-button ${mode === "to-warehouse" ? "return" : ""}`} 
          onClick={handleButtonClick}
        >
          {mode === "to-workplace" ? "작업 시작" : "복귀 완료"}
        </button>
      </div>

      {error && <div className="error-message">{error}</div>}
    </div>
  );
};