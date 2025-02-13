import React, { useState } from "react";
import Helmet from "@/shared/assets/images/helmet.png";
import "./styles.scss";

const CheckSafetyPage = () => {
  const [currentWorkerIndex, setCurrentWorkerIndex] = useState(0); // 현재 검사 중인 작업자의 인덱스
  const [workerStatus, setWorkerStatus] = useState({
    김동우: false,
    정도영: false,
    염정우: false,
    김병지: false,
  }); // 각 작업자의 검사 상태
  const workerList = ["김동우", "정도영", "염정우", "김병지"]; // 작업자 리스트

  // 더미 데이터: 헬멧 착용 여부
  const detectionData = {
    김동우: false,
    정도영: false,
    염정우: false,
    김병지: false,
  };

  // 현재 작업자 이름
  const currentWorker = workerList[currentWorkerIndex];

  // 모든 작업자가 검사에 통과했는지 확인
  const isAllWorkersChecked = Object.values(workerStatus).every(
    (status) => status === true
  );

  // 현재 작업자 검사 완료 처리
  const handleCompleteCheck = () => {
    setWorkerStatus((prevStatus) => ({
      ...prevStatus,
      [currentWorker]: detectionData[currentWorker], // 현재 작업자의 상태를 업데이트
    }));

    // 마지막 작업자가 아니라면 다음 작업자로 이동
    if (currentWorkerIndex < workerList.length - 1) {
      setCurrentWorkerIndex((prevIndex) => prevIndex + 1);
    }
  };

  return (
    <div className="check-safety-page">
      <h1>복장 체크</h1>

      {/* 실시간 영상 */}
      <div className="video-container">
        <div className="video-stream">
          <p>실시간 영상 스트리밍</p>
        </div>
        <div className="status-indicator">
          {detectionData[currentWorker] ? (
            <div className="status success">확인됨</div>
          ) : (
            <div className="status waiting">확인 중</div>
          )}
        </div>
      </div>

      {/* 작업자 리스트 */}
      <div className="worker-list">
        {workerList.map((worker, index) => (
          <button
            key={worker}
            className={`worker-button ${
              worker === currentWorker ? "active" : ""
            } ${workerStatus[worker] ? "checked" : ""}`}
            disabled={index !== currentWorkerIndex} // 현재 작업자가 아니면 비활성화
          >
            {worker}
          </button>
        ))}
      </div>
      
      <div className="equipment-item">
        <img src={Helmet} alt="안전모" />
        <span>안전모</span>
      </div>

      {/* 검사 완료 및 준비 완료 버튼 */}
      {!isAllWorkersChecked && currentWorkerIndex !== workerList.length - 1 && (
        <button
          className="next-worker-button"
          onClick={handleCompleteCheck}
          disabled={!detectionData[currentWorker]} // 헬멧 착용이 확인되지 않으면 비활성화
        >
          다음 사람
        </button>
      )}

      {/* 준비 완료 버튼 */}
      {isAllWorkersChecked || currentWorkerIndex === workerList.length - 1 ? (
        <button
          className="next-worker-button"
          onClick={() => console.log("준비 완료 클릭됨")}
        >
          준비 완료
        </button>
      ) : null}
    </div>
  );
};

export default CheckSafetyPage;
