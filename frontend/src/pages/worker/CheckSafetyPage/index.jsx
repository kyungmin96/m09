import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from '@/contexts/AuthContext';
import { useWorks } from '@/contexts/WorksContext';
import Helmet from "@/shared/assets/images/helmet.png";
import "./styles.scss";

const DETECTION_TIMEOUT = 10000; // 10초
const EQUIPMENT_LIST = [
  { id: 'helmet', name: '안전모', icon: Helmet }
];

export const CheckSafetyPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { selectedWorks } = useWorks();
  const [currentWorker, setCurrentWorker] = useState(null);
  const [workerList, setWorkerList] = useState([]);
  const [workerStatuses, setWorkerStatuses] = useState({});
  const [isDetecting, setIsDetecting] = useState(false);
  const [videoStream, setVideoStream] = useState(null);
  const [showManualCheckDialog, setShowManualCheckDialog] = useState(false);
  const [pendingWorkerChange, setPendingWorkerChange] = useState(null);
  const videoRef = useRef(null);
  const detectionTimeoutRef = useRef(null);

  // 작업자 목록 초기화
  useEffect(() => {
    const allWorkers = new Set([user.name]);
    selectedWorks.forEach(work => {
      work.workers?.forEach(worker => {
        allWorkers.add(worker.name);
      });
    });

    const workerArray = Array.from(allWorkers);
    setWorkerList(workerArray);

    // 작업자별 장비 상태 초기화
    const initialStatuses = {};
    workerArray.forEach(worker => {
      initialStatuses[worker] = EQUIPMENT_LIST.reduce((acc, equipment) => ({
        ...acc,
        [equipment.id]: {
          checked: false,
          success: false,
          manualChecked: false
        }
      }), {});
    });
    setWorkerStatuses(initialStatuses);

    // 첫 번째 작업자에 대한 탐지 자동 시작
    if (workerArray.length > 0) {
      setCurrentWorker(workerArray[0]);
      setTimeout(() => startDetection(workerArray[0]), 1000);
    }
  }, [selectedWorks, user]);

  // 카메라 스트림 시작
  useEffect(() => {
    const startCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        setVideoStream(stream);
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (error) {
        console.error('카메라 접근 오류:', error);
      }
    };

    startCamera();

    return () => {
      if (videoStream) {
        videoStream.getTracks().forEach(track => track.stop());
      }
      if (isDetecting) {
        stopDetection();
      }
    };
  }, []);

  // 장비 탐지 시작
  const startDetection = async (worker) => {
    if (isDetecting) return;
    
    setIsDetecting(true);
    setCurrentWorker(worker);

    /* 실제 서버 통신 코드
    try {
      const response = await fetch('/api/v1/safety-detection/start', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token}`
        },
        body: JSON.stringify({ workerId: worker })
      });

      if (!response.ok) throw new Error('탐지 시작 실패');

      detectionTimeoutRef.current = setTimeout(() => {
        handleDetectionTimeout(worker);
      }, DETECTION_TIMEOUT);

      startPollingDetectionResult(worker);
    } catch (error) {
      console.error('탐지 오류:', error);
      handleDetectionFailure(worker);
    }
    */

    // 임시 Mock 코드
    detectionTimeoutRef.current = setTimeout(() => {
      const success = Math.random() > 0.5;
      if (success) {
        handleDetectionSuccess(worker);
      } else {
        handleDetectionFailure(worker);
      }
    }, 2000);
  };

  // 장비 탐지 중지
  const stopDetection = async () => {
    /* 실제 서버 통신 코드
    try {
      await fetch('/api/v1/safety-detection/stop', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${user.token}`
        }
      });
    } catch (error) {
      console.error('탐지 중지 실패:', error);
    }
    */

    clearTimeout(detectionTimeoutRef.current);
    setIsDetecting(false);
  };

  const handleDetectionSuccess = (worker) => {
    setWorkerStatuses(prev => ({
      ...prev,
      [worker]: {
        ...prev[worker],
        helmet: {
          checked: true,
          success: true,
          manualChecked: false
        }
      }
    }));
    stopDetection();
  };

  const handleDetectionFailure = (worker) => {
    setWorkerStatuses(prev => ({
      ...prev,
      [worker]: {
        ...prev[worker],
        helmet: {
          checked: true,
          success: false,
          manualChecked: false
        }
      }
    }));
    stopDetection();
  };

  const handleDetectionTimeout = (worker) => {
    handleDetectionFailure(worker);
  };

  const handleWorkerSelect = async (worker) => {
    if (worker === currentWorker) return;
    
    if (isDetecting) {
      setPendingWorkerChange(worker);
      setShowManualCheckDialog(true);
      await stopDetection();
    } else {
      setCurrentWorker(worker);
      const workerStatus = workerStatuses[worker]?.helmet;
      if (!workerStatus?.checked || !workerStatus?.success) {
        await startDetection(worker);
      }
    }
  };

  const handleManualCheckDialogResponse = async (confirmed) => {
    if (confirmed) {
      // 현재 작업자의 미탐지 장비를 수동 체크 처리
      setWorkerStatuses(prev => ({
        ...prev,
        [currentWorker]: {
          ...prev[currentWorker],
          helmet: {
            checked: true,
            success: true,
            manualChecked: true
          }
        }
      }));
    } else {
      // 현재 작업자의 미탐지 장비를 미완료 처리
      setWorkerStatuses(prev => ({
        ...prev,
        [currentWorker]: {
          ...prev[currentWorker],
          helmet: {
            checked: false,
            success: false,
            manualChecked: false
          }
        }
      }));
    }

    setShowManualCheckDialog(false);
    
    // 다음 작업자로 전환 및 탐지 시작
    if (pendingWorkerChange) {
      setCurrentWorker(pendingWorkerChange);
      await startDetection(pendingWorkerChange);
      setPendingWorkerChange(null);
    }
  };

  const handleManualCheck = (worker, equipmentId) => {
    setWorkerStatuses(prev => ({
      ...prev,
      [worker]: {
        ...prev[worker],
        [equipmentId]: {
          checked: true,
          success: true,
          manualChecked: true
        }
      }
    }));
  };

  const isWorkerFullyChecked = (worker) => {
    const workerStatus = workerStatuses[worker];
    return workerStatus && Object.values(workerStatus).every(
      equipment => equipment.checked && (equipment.success || equipment.manualChecked)
    );
  };

  const isAllChecked = () => {
    return Object.values(workerStatuses).every(status => 
      Object.values(status).every(equipment => 
        equipment.checked && (equipment.success || equipment.manualChecked)
      )
    );
  };

  const handleComplete = async () => {
    if (isDetecting) {
      await stopDetection();
    }
    navigate("/worker/workplace-move");
  };

  const getWorkerNameStyle = (worker) => {
    if (isDetecting && worker === currentWorker) return 'detecting';
    const status = workerStatuses[worker]?.helmet;
    if (!status?.checked) return '';
    return status.success || status.manualChecked ? 'success' : 'failure';
  };

  return (
    <div className="check-safety-page">
      <h1>복장 체크</h1>

      <div className="camera-container">
        <video
          ref={videoRef}
          autoPlay
          playsInline
          className="camera-stream"
        />
        {isDetecting && (
          <div className="detection-overlay">
            <span>장비 탐지 중...</span>
          </div>
        )}
      </div>

      <div className="worker-list">
        {workerList.map(worker => (
          <button
            key={worker}
            onClick={() => handleWorkerSelect(worker)}
            className={`worker-button ${getWorkerNameStyle(worker)}`}
          >
            {worker}
          </button>
        ))}
      </div>

      <div className="equipment-list">
        {EQUIPMENT_LIST.map(equipment => {
          const status = currentWorker ? workerStatuses[currentWorker]?.[equipment.id] : null;
          return (
            <div
              key={equipment.id}
              className={`equipment-item ${
                status?.checked ? (status.success || status.manualChecked ? 'success' : 'failure') : ''
              }`}
            >
              <div className="equipment-icon">
                <img src={equipment.icon} alt={equipment.name} />
              </div>
              <span className="equipment-name">{equipment.name}</span>
              <span className="equipment-status">
                {status?.checked ? (
                  status.success || status.manualChecked ? '인식 완료' : '인식 실패'
                ) : '미인식'}
              </span>
              {status?.checked && !status.success && !status.manualChecked && (
                <button
                  className="manual-check-button"
                  onClick={() => handleManualCheck(currentWorker, equipment.id)}
                >
                  수동 체크
                </button>
              )}
            </div>
          );
        })}
        {currentWorker && !isDetecting && !isWorkerFullyChecked(currentWorker) && (
          <button 
            className="retry-detection-button"
            onClick={() => startDetection(currentWorker)}
          >
            <div className="button-content">
              <span className="icon">🔄</span>
              <span>카메라 재탐지</span>
            </div>
          </button>
        )}
      </div>

      {showManualCheckDialog && (
        <div className="manual-check-dialog">
          <div className="dialog-content">
            <p>현재 작업자의 미탐지된 장비를 수동으로 체크하시겠습니까?</p>
            <div className="dialog-buttons">
              <button onClick={() => handleManualCheckDialogResponse(true)}>
                예
              </button>
              <button onClick={() => handleManualCheckDialogResponse(false)}>
                아니오
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="action-area">
        <button 
          className="complete-button" 
          onClick={handleComplete}
          disabled={!isAllChecked()}
        >
          {isAllChecked() ? "현장 이동" : "모든 작업자의 복장을 준수해주세요"}
        </button>
      </div>
    </div>
  );
};

export default CheckSafetyPage;