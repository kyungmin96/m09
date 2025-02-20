// src/pages/test/embedded/HelmetDetector.jsx
import React, { useState, useEffect } from 'react';
import websocketService from '@/features/websocket/websocketService';

const HelmetDetector = () => {
  const [status, setStatus] = useState('대기 중');
  const [isConnected, setIsConnected] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    // 컴포넌트 언마운트 시 웹소켓 연결 종료
    return () => {
      if (isConnected) {
        handleStop();
      }
    };
  }, [isConnected]);

  const handleStart = async () => {
    try {
      setStatus('연결 중...');
      setErrorMessage('');
      setIsSuccess(false);
      
      // 웹소켓 연결
      await websocketService.connectWebSocket();
      setIsConnected(true);
      setStatus('탐지 중...');
      
      // 메시지 수신 콜백 설정
      websocketService.setOnMessageCallback((data) => {
        console.log('헬멧 탐지 메시지 수신:', data);
        
        if (data === 'ok') {
          setIsSuccess(true);
          setStatus('인식 성공');
          handleStop(); // 자동 종료
        }
      });
      
      // 연결 종료 콜백 설정
      websocketService.setOnCloseCallback(() => {
        setIsConnected(false);
        setStatus(isSuccess ? '인식 성공' : '연결 종료됨');
      });
      
      // 에러 콜백 설정
      websocketService.setOnErrorCallback((error) => {
        setErrorMessage(`연결 오류: ${error.message}`);
        setStatus('오류 발생');
      });
      
      // 헬멧 탐지 시작 요청
      await websocketService.startHelmetDetection();
      
    } catch (error) {
      setErrorMessage(`오류 발생: ${error.message}`);
      setStatus('오류 발생');
      setIsConnected(false);
    }
  };

  const handleStop = async () => {
    try {
      if (isConnected) {
        await websocketService.stopHelmetDetection();
        websocketService.closeConnection();
      }
      setIsConnected(false);
      if (!isSuccess) {
        setStatus('대기 중');
      }
    } catch (error) {
      setErrorMessage(`중지 중 오류 발생: ${error.message}`);
    }
  };

  const getStatusClass = () => {
    if (status === '인식 성공') return 'success';
    if (status === '오류 발생') return 'error';
    if (status === '탐지 중...') return 'connected';
    return 'idle';
  };

  return (
    <div className="detector-container">
      <h2>안전 복장(헬멧) 탐지</h2>
      
      <div className="status-display">
        <p className="status-label">
          상태: 
          <span className={`status-value ${getStatusClass()}`}>
            {status}
          </span>
        </p>
        
        {isSuccess && (
          <div className="success-message">
            <p>안전 복장 인식에 성공했습니다!</p>
            <p className="subtitle">작업을 안전하게 시작할 수 있습니다.</p>
          </div>
        )}
        
        {errorMessage && (
          <p className="error-message">{errorMessage}</p>
        )}
      </div>
      
      <div className="button-group">
        <button
          onClick={handleStart}
          disabled={isConnected}
          className="button primary"
        >
          복장 탐지 시작
        </button>
        
        <button
          onClick={handleStop}
          disabled={!isConnected}
          className="button danger"
        >
          탐지 중지
        </button>
      </div>
    </div>
  );
};

export default HelmetDetector;