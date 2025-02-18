import { useState, useEffect } from "react";
import { useParams, useNavigate } from 'react-router-dom';
import { Streaming } from '@/features/streaming/Streaming';
import { ManualControlButton } from './ManualControlButton';
import './styles.scss';

export const MovementPage = () => {
  const { type } = useParams(); // 'go-workplace' or 'return'
  const navigate = useNavigate();
  
  // 주행 모드 상태 관리
  const [currentMode, setCurrentMode] = useState('manual');
  
  // 스트리밍 활성화 상태 관리
  const [isStreamingActive, setIsStreamingActive] = useState(false);

  // 컴포넌트 마운트 시 초기 모드 로깅
  useEffect(() => {
    console.log(`Initial driving mode: ${currentMode}`);
  }, []);

  // 주행 방향 제어 핸들러
  const handleControl = (direction) => {
    // TODO: 각 방향에 대한 API 호출
    console.log(`Moving ${direction} in ${currentMode} mode`);
  };

  // 주행 시작 핸들러
  const handleStart = () => {
    // TODO: 주행 시작 API 호출
    console.log(`Starting movement in ${currentMode} mode`);
    
    if (currentMode === 'manual') {
      // 수동 모드에서 카메라 활성화
      setIsStreamingActive(true);
      console.log('Manual mode: Camera activated');
    } else {
      // 추종 주행 모드 시작
      setIsStreamingActive(true);
      console.log('Follow mode: Tracking initiated');
    }
  };

  // 주행 종료 핸들러
  const handleEndMovement = () => {
    // TODO: 현재 모드에 따른 중지 API 호출
    console.log(`Ending movement in ${currentMode} mode`);
    setIsStreamingActive(false);
    
    if (type === 'go-workplace') {
      console.log('Navigating to work site');
      navigate('/while-work');
    } else if (type === 'return') {
      console.log('Returning from work site');
      navigate('/complete-work');
    }
  };

  // 모드 변경 핸들러
  const handleModeChange = (mode) => {
    console.log(`Mode changing from: ${currentMode} to: ${mode}`);
    
    // 현재 모드 중지 로직 (TODO: API 호출)
    setCurrentMode(mode);
    
    // 모드 변경 시 스트리밍 비활성화
    setIsStreamingActive(false);
    console.log('Streaming deactivated due to mode change');
  };

  return (
    <div className="movement-page">
      {/* 모드 선택 영역 */}
      <div className="movement-page__mode-selector">
        <button 
          className={`movement-page__mode-selector-button ${currentMode === 'manual' ? 'movement-page__mode-selector-button--active' : 'movement-page__mode-selector-button--inactive'}`}
          onClick={() => handleModeChange('manual')}
        >
          수동 조작 모드
        </button>
        <button 
          className={`movement-page__mode-selector-button ${currentMode === 'follow' ? 'movement-page__mode-selector-button--active' : 'movement-page__mode-selector-button--inactive'}`}
          onClick={() => handleModeChange('follow')}
        >
          추종 주행 모드
        </button>
      </div>

      {/* 스트리밍 영역 */}
      <div className="movement-page__streaming">
        <Streaming isActive={isStreamingActive} />
      </div>

      {/* 제어 버튼 영역 */}
      <div className="movement-page__control">
        {currentMode === 'manual' && (
          <ManualControlButton onControl={handleControl} />
        )}
      </div>

      {/* 작업 시작 버튼 */}
      <div className="movement-page__start-button">
        <button onClick={handleStart}>작업 시작</button>
      </div>
    </div>
  );
};