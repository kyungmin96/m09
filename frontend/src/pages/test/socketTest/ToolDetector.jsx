// src/pages/test/embedded/ToolDetector.jsx
import React, { useState, useEffect } from 'react';
import websocketService from '@/features/websocket/websocketService';

const ToolDetector = () => {
  const [status, setStatus] = useState('대기 중');
  const [isConnected, setIsConnected] = useState(false);
  const [toolList, setToolList] = useState([
    { name: '전동드릴', detected: false },
    { name: '해머', detected: false },
    { name: '렌치', detected: false }
  ]);
  const [errorMessage, setErrorMessage] = useState('');
  const [isAllDetected, setIsAllDetected] = useState(false);

  useEffect(() => {
    // 모든 공구가 탐지되었는지 확인
    const allDetected = toolList.every(tool => tool.detected);
    setIsAllDetected(allDetected);
    
    // 컴포넌트 언마운트 시 웹소켓 연결 종료
    return () => {
      if (isConnected) {
        handleStop();
      }
    };
  }, [toolList, isConnected]);

  const handleStart = async () => {
    try {
      setStatus('연결 중...');
      setErrorMessage('');
      
      // 탐지할 공구 이름 배열 생성
      const toolNames = toolList.map(tool => tool.name);
      
      // 웹소켓 연결
      await websocketService.connectWebSocket();
      setIsConnected(true);
      setStatus('탐지 중...');
      
      // 초기화: 모든 공구 미탐지 상태로 설정
      setToolList(prev => prev.map(tool => ({ ...tool, detected: false })));
      
      // 메시지 수신 콜백 설정
      websocketService.setOnMessageCallback((data) => {
        try {
          const result = JSON.parse(data);
          console.log('공구 탐지 결과:', result);
          
          // 공구 탐지 상태 업데이트
          setToolList(prev => 
            prev.map(tool => ({
              ...tool,
              detected: result[tool.name] === true 
            }))
          );
        } catch (error) {
          console.error('JSON 파싱 오류:', error);
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
      
      // 공구 탐지 시작 요청
      await websocketService.startToolDetection(toolNames);
      
    } catch (error) {
      setErrorMessage(`오류 발생: ${error.message}`);
      setStatus('오류 발생');
      setIsConnected(false);
    }
  };

  const handleStop = async () => {
    try {
      if (isConnected) {
        await websocketService.stopToolDetection();
        websocketService.closeConnection();
      }
      setIsConnected(false);
      setStatus('대기 중');
    } catch (error) {
      setErrorMessage(`중지 중 오류 발생: ${error.message}`);
    }
  };

  const addTool = () => {
    setToolList(prev => [...prev, { name: `공구${prev.length + 1}`, detected: false }]);
  };

  const removeTool = (index) => {
    setToolList(prev => prev.filter((_, i) => i !== index));
  };

  const updateToolName = (index, newName) => {
    setToolList(prev => 
      prev.map((tool, i) => 
        i === index ? { ...tool, name: newName } : tool
      )
    );
  };

  const getStatusClass = () => {
    if (isAllDetected) return 'success';
    if (status === '오류 발생') return 'error';
    if (status === '탐지 중...') return 'connected';
    return 'idle';
  };

  return (
    <div className="detector-container">
      <h2>공구 탐지</h2>
      
      <div className="status-display">
        <p className="status-label">
          상태: 
          <span className={`status-value ${getStatusClass()}`}>
            {isAllDetected ? '모든 공구 탐지 완료' : status}
          </span>
        </p>
        
        {errorMessage && (
          <p className="error-message">{errorMessage}</p>
        )}
      </div>
      
      <div className="tool-list">
        <h3>공구 목록</h3>
        <ul>
          {toolList.map((tool, index) => (
            <li key={index}>
              <input
                type="text"
                value={tool.name}
                onChange={(e) => updateToolName(index, e.target.value)}
                disabled={isConnected}
                className="tool-input"
              />
              <span 
                className={`status-indicator ${tool.detected ? 'detected' : 'not-detected'}`}
              />
              <button
                onClick={() => removeTool(index)}
                disabled={isConnected}
                className="remove-button"
              >
                삭제
              </button>
            </li>
          ))}
        </ul>
        
        <button
          onClick={addTool}
          disabled={isConnected}
          className="add-button"
        >
          + 공구 추가
        </button>
      </div>
      
      <div className="button-group">
        <button
          onClick={handleStart}
          disabled={isConnected || toolList.length === 0}
          className="button primary"
        >
          탐지 시작
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

export default ToolDetector;