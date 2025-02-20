// src/pages/test/embedded/NFCDetector.jsx
import React, { useState, useEffect } from 'react';
import websocketService from '@/features/websocket/websocketService';

const NFCDetector = () => {
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
      
      // 웹소켓 연결
      await websocketService.connectWebSocket();
      setIsConnected(true);
      setStatus('연결됨');
      
      // 메시지 수신 콜백 설정
      websocketService.setOnMessageCallback((data) => {
        console.log('NFC 메시지 수신:', data);
        
        if (data === 'ok') {
          setIsSuccess(true);
          setStatus('인식 성공');
          handleStop(); // 자동 종료
        }
      });
      
      // 연결 종료 콜백 설정
      websocketService.setOnCloseCallback(() => {
        setIsConnected(false);
        setStatus('연결 종료됨');
      });
      
      // 에러 콜백 설정
      websocketService.setOnErrorCallback((error) => {
        setErrorMessage(`연결 오류: ${error.message}`);
        setStatus('오류 발생');
      });
      
      // NFC 인식 시작 요청
      await websocketService.startNFCDetection();
      
    } catch (error) {
      setErrorMessage(`오류 발생: ${error.message}`);
      setStatus('오류 발생');
      setIsConnected(false);
    }
  };

  const handleStop = () => {
    websocketService.closeConnection();
    setIsConnected(false);
    setStatus('대기 중');
  };

  const getStatusClass = () => {
    if (status === '인식 성공') return 'success';
    if (status === '오류 발생') return 'error';
    if (status === '연결됨') return 'connected';
    return 'idle';
  };

  return (
    <div className="detector-container">
      <h2>NFC 인식</h2>
      
      <div className="status-display">
        <p className="status-label">
          상태: 
          <span className={`status-value ${getStatusClass()}`}>
            {status}
          </span>
        </p>
        
        {isSuccess && (
          <div className="success-message">
            <p>NFC 인식에 성공했습니다!</p>
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
          인식 시작
        </button>
        
        <button
          onClick={handleStop}
          disabled={!isConnected}
          className="button danger"
        >
          인식 중지
        </button>
      </div>
    </div>
  );
};

export default NFCDetector;