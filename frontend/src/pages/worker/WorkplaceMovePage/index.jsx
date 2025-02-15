import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./styles.scss";

export const WorkplaceMovePage = ({ mode = "to-workplace" }) => {
  const navigate = useNavigate();
  const [activeMode, setActiveMode] = useState("follow");
  const [isStopped, setIsStopped] = useState(false);

  const handleModeChange = (mode) => {
    setActiveMode(mode);
  };

  const handleToggleStop = () => {
    setIsStopped((prevState) => !prevState);
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
      <header className="header">
        <h1>{mode === "to-workplace" ? "작업장 이동" : "물류 창고 이동"}</h1>
      </header>

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
              <button className="arrow up" aria-label="Up"></button>
              <div className="horizontal-buttons">
                <button className="arrow left" aria-label="Left"></button>
                <button className="pause" aria-label="Pause"></button>
                <button className="arrow right" aria-label="Right"></button>
              </div>
              <button className="arrow down" aria-label="Down"></button>
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
    </div>
  );
};