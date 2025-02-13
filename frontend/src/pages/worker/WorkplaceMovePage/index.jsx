import React, { useState } from "react";
import "./styles.scss";

export const WorkplaceMovePage = () => {
  const [activeMode, setActiveMode] = useState("follow"); // '작업자 따라가기' 또는 '수동 조작'
  const [isStopped, setIsStopped] = useState(false); // '멈춤' 상태 관리

  const handleModeChange = (mode) => {
    setActiveMode(mode);
  };

  const handleToggleStop = () => {
    setIsStopped((prevState) => !prevState); // 상태를 토글
  };

  return (
    <div className="workplace-move">
      {/* 상단 모드 선택 */}
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

      {/* 중앙 콘텐츠 영역 */}
      <div className="content-area">
        <video
          className="streaming-video"
          src="http://example.com/live/stream.m3u8" // 실시간 스트리밍 URL
          autoPlay
          muted
          playsInline
        />

        {/* 수동 조작 모드일 때 키패드 표시 */}
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

      {/* 하단 컨트롤 패널 */}
      <div className="control-panel">
        {/* 작업자 따라가기 모드일 때 토글 버튼 표시 */}
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
        {/* 작업 시작 버튼 */}
        <button className="start-button">작업 시작</button>
      </div>
    </div>
  );
};
