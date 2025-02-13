import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Helmet from "@/shared/assets/images/helmet.png";
import "./styles.scss";

export const CheckSafetyPage = () => {
  const navigate = useNavigate();
  const [currentWorkerIndex, setCurrentWorkerIndex] = useState(0);
  const [workerStatus, setWorkerStatus] = useState({});
  const [workerList, setWorkerList] = useState([]);
  const [detectionData, setDetectionData] = useState({});

  useEffect(() => {
    // 로컬 스토리지에서 선택된 작업 정보 가져오기
    const savedTasks = localStorage.getItem('selectedTasks');
    const currentUser = localStorage.getItem('currentUser'); // 현재 로그인한 사용자 정보

    if (savedTasks) {
      const parsedTasks = JSON.parse(savedTasks);
      // 모든 작업자 목록 추출 (중복 제거)
      const allWorkers = new Set();
      
      // 현재 로그인한 사용자를 첫 번째로 추가
      if (currentUser) {
        allWorkers.add(currentUser);
      }

      // 선택된 작업들의 모든 작업자 추가
      parsedTasks.forEach(task => {
        task.workers.forEach(worker => {
          allWorkers.add(worker.name);
        });
      });

      const uniqueWorkerList = Array.from(allWorkers);

      // 작업자 목록 설정
      setWorkerList(uniqueWorkerList);

      // 작업자 상태 초기화
      const initialWorkerStatus = {};
      uniqueWorkerList.forEach(worker => {
        initialWorkerStatus[worker] = false;
      });
      setWorkerStatus(initialWorkerStatus);

      // 감지 데이터 초기화
      const initialDetectionData = {};
      uniqueWorkerList.forEach(worker => {
        initialDetectionData[worker] = true;
      });
      setDetectionData(initialDetectionData);
    }
  }, []);

  const currentWorker = workerList[currentWorkerIndex];

  const isAllWorkersChecked = Object.values(workerStatus).every(
    (status) => status === true
  );

  const handleCompleteCheck = () => {
    setWorkerStatus((prevStatus) => ({
      ...prevStatus,
      [currentWorker]: detectionData[currentWorker],
    }));

    if (currentWorkerIndex < workerList.length - 1) {
      setCurrentWorkerIndex((prevIndex) => prevIndex + 1);
    }
  };

  const handleReadyComplete = () => {
    navigate("/worker/workplace-move");
  };

  return (
    <div className="check-safety-page">
      <h1>복장 체크</h1>

      <div className="video-container">
        <div className="video-stream">
          <p>실시간 영상 스트리밍</p>
        </div>
        <div className="status-indicator">
          {currentWorker && detectionData[currentWorker] ? (
            <div className="status success">확인됨</div>
          ) : (
            <div className="status waiting">확인 중</div>
          )}
        </div>
      </div>

      <div className="worker-list">
        {workerList.map((worker, index) => (
          <button
            key={worker}
            className={`worker-button ${
              worker === currentWorker ? "active" : ""
            } ${workerStatus[worker] ? "checked" : ""}`}
            disabled={index !== currentWorkerIndex}
          >
            {worker}
          </button>
        ))}
      </div>
      
      <div className="equipment-item">
        <img src={Helmet} alt="안전모" />
        <span>안전모</span>
      </div>

      {!isAllWorkersChecked && currentWorkerIndex !== workerList.length - 1 && (
        <button
          className="next-worker-button"
          onClick={handleCompleteCheck}
          disabled={!detectionData[currentWorker]}
        >
          다음 사람
        </button>
      )}

      {(isAllWorkersChecked || currentWorkerIndex === workerList.length - 1) && (
        <button
          className="next-worker-button"
          onClick={handleReadyComplete}
        >
          준비 완료
        </button>
      )}
    </div>
  );
};