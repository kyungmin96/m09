import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from 'react-router-dom';
import { Streaming } from '@/features/streaming/Streaming';
import { Header } from '@/shared/ui/Header/Header';
import { ManualControlButton } from './ManualControlButton';
import { startCameraStreaming, stopCameraStreaming } from '@/features/streaming/stream.api.js';
import {
  manualDriveForward,
  manualDriveBackward,
  manualDriveLeft,
  manualDriveRight,
  manualDriveStop,
  startDrive,
  stopDrive
} from './movement.api.js';
import './styles.scss';

export const MovementPage = () => {
  const { type } = useParams(); // 'go-workplace' or 'return'
  const navigate = useNavigate();

  // 주행 모드 상태 관리
  const [currentMode, setCurrentMode] = useState('manual');

  // 스트리밍 활성화 상태 관리 - API 요청 상태를 반영
  const [isStreamingActive, setIsStreamingActive] = useState(false);
  
  // 스트리밍 API 요청이 완료되었는지 확인하는 상태
  const [streamingRequestComplete, setStreamingRequestComplete] = useState(false);

  // API 요청 진행 중 상태 관리
  const [isLoading, setIsLoading] = useState(false);

  // 오류 상태 관리
  // 모드 전환 오류만 표시
  const [modeChangeError, setModeChangeError] = useState(null);

  // 카메라 기능과 별개로 제어 기능 활성화 상태
  const [isCameraError, setIsCameraError] = useState(false);

  // 수동 조작 방향 제어 참조 변수
  const controlIntervalRef = useRef(null);

  // 오류 타이머 관리
  const errorTimerRef = useRef(null);

  // 컴포넌트 마운트 시 초기화
  useEffect(() => {
    console.log('[MovementPage] 컴포넌트 마운트됨, 모드:', currentMode);
    initializeManualMode();

    // 컴포넌트 언마운트 시 모든 리소스 정리
    return () => {
      console.log('[MovementPage] 컴포넌트 언마운트, 리소스 정리');
      if (errorTimerRef.current) {
        clearTimeout(errorTimerRef.current);
      }
      cleanupResources();
    };
  }, []);

  // 오류 처리 함수 - 모드 전환 오류만 UI에 표시
  const handleError = (errorMessage, operation = '', isCameraRelated = false, isModeChangeError = false) => {
    // 모드 전환 오류는 별도로 표시
    if (isModeChangeError) {
      const fullMessage = operation ? `${operation}: ${errorMessage}` : errorMessage;
      setModeChangeError(fullMessage);
      console.error('[MovementPage]', operation, errorMessage);
    }
    // 그 외 오류는 콘솔에만 기록
    else {
      console.error('[MovementPage]', operation, errorMessage);
    }

    setIsLoading(false);
  };

  // 초기 수동 조작 모드 설정 및 스트리밍 시작 (한 번만 시도)
  const initializeManualMode = async () => {
    console.log('[MovementPage] 수동 조작 모드 초기화 시작');
    setIsLoading(true);
    setStreamingRequestComplete(false); // 요청 시작

    try {
      console.log('[MovementPage] 카메라 스트리밍 요청 전송');
      await startCameraStreaming();
      console.log('[MovementPage] 카메라 스트리밍 요청 성공');
      setIsStreamingActive(true);
      setIsCameraError(false);
      setStreamingRequestComplete(true); // 요청 성공적으로 완료
    } catch (error) {
      console.error('[MovementPage] 수동 조작 모드 초기화 - 카메라 실패:', error);
      setIsCameraError(true);
      setIsStreamingActive(false); // 카메라 연결은 실패해도 UI 컴포넌트는 표시
      setStreamingRequestComplete(true); // 요청은 완료되었으나 실패함
    } finally {
      setIsLoading(false);
      console.log('[MovementPage] 수동 조작 모드 초기화 완료');
    }
  };

  // 카메라 연결 재시도 (별도 함수로 분리)
  const retryCameraConnection = async () => {
    console.log('[MovementPage] 카메라 연결 재시도');
    setIsLoading(true);
    setStreamingRequestComplete(false); // 재요청 시작

    try {
      await startCameraStreaming();
      console.log('[MovementPage] 카메라 스트리밍 재연결 성공');
      setIsStreamingActive(true);
      setIsCameraError(false);
      setStreamingRequestComplete(true); // 재요청 성공
    } catch (error) {
      console.error('[MovementPage] 카메라 재연결 실패:', error);
      setIsCameraError(true);
      setIsStreamingActive(false);
      setStreamingRequestComplete(true); // 재요청 실패
    } finally {
      setIsLoading(false);
    }
  };

  // 리소스 정리 함수
  const cleanupResources = async () => {
    console.log('[MovementPage] 리소스 정리 시작');
    try {
      // 진행 중인 제어 인터벌 정리
      if (controlIntervalRef.current) {
        console.log('[MovementPage] 진행 중인 제어 인터벌 정리');
        clearInterval(controlIntervalRef.current);
        controlIntervalRef.current = null;
      }

      // 현재 모드에 따른 정리
      if (currentMode === 'manual') {
        if (isStreamingActive && !isCameraError) {
          console.log('[MovementPage] 수동 모드 카메라 스트리밍 중지 요청');
          try {
            await stopCameraStreaming();
            setStreamingRequestComplete(false); // 스트리밍 중지
          } catch (cameraError) {
            console.warn('[MovementPage] 카메라 정리 실패, 무시하고 계속:', cameraError);
          }
        }
        // 정지 명령 전송 (안전을 위해)
        try {
          await manualDriveStop();
        } catch (stopError) {
          console.warn('[MovementPage] 정지 명령 실패, 무시하고 계속:', stopError);
        }
      } else if (currentMode === 'follow') {
        console.log('[MovementPage] 추종 주행 모드 중지 요청');
        try {
          await stopDrive();
        } catch (driveError) {
          console.warn('[MovementPage] 주행 중지 실패, 무시하고 계속:', driveError);
        }
      }
      console.log('[MovementPage] 리소스 정리 성공');
    } catch (error) {
      console.error('[MovementPage] 리소스 정리 중 오류 발생:', error);
    }
  };

  // 주행 방향 제어 핸들러 (변경 없음)
  const handleControl = async (direction) => {
    console.log(`[MovementPage] 주행 방향 제어 요청: ${direction}`);

    if (currentMode !== 'manual') {
      console.log('[MovementPage] 수동 모드가 아닌 상태에서 제어 요청 무시');
      return;
    }

    try {
      switch (direction) {
        case 'forward':
          await manualDriveForward();
          break;
        case 'backward':
          await manualDriveBackward();
          break;
        case 'left':
          await manualDriveLeft();
          break;
        case 'right':
          await manualDriveRight();
          break;
        case 'stop':
          await manualDriveStop();
          break;
        default:
          console.log('[MovementPage] 알 수 없는 방향:', direction);
          return;
      }
      console.log(`[MovementPage] ${direction} 방향 제어 성공`);
    } catch (error) {
      console.error(`[MovementPage] ${direction} 방향 제어 중 오류 발생:`, error);
      // 방향 제어 오류는 일반 오류로 처리 (UI에 표시하지 않음)
      handleError(error.message || '이동 명령을 처리할 수 없습니다', '제어 실패', false, false);

      // 오류 발생 시 안전을 위해 정지 명령 시도
      try {
        await manualDriveStop();
      } catch (stopError) {
        console.error('[MovementPage] 정지 명령 실패:', stopError);
      }
    }
  };

  // 주행 종료 핸들러
  const handleEndMovement = async () => {
    console.log('[MovementPage] 주행 종료 요청');
    setIsLoading(true);

    try {
      if (currentMode === 'manual') {
        // 정지 명령 전송 (안전을 위해)
        try {
          await manualDriveStop();
        } catch (stopError) {
          console.warn('[MovementPage] 정지 명령 실패, 무시하고 계속:', stopError);
        }

        if (isStreamingActive && !isCameraError) {
          console.log('[MovementPage] 수동 모드 카메라 스트리밍 중지 요청');
          try {
            await stopCameraStreaming();
          } catch (cameraError) {
            console.warn('[MovementPage] 카메라 중지 실패, 무시하고 계속:', cameraError);
          }
        }
      } else if (currentMode === 'follow') {
        console.log('[MovementPage] 추종 주행 모드 중지 요청');
        await stopDrive();
      }

      setIsStreamingActive(false);
      setStreamingRequestComplete(false);

      // 다음 페이지로 이동
      if (type === 'go-workplace') {
        console.log('[MovementPage] 작업장 이동 완료, 작업 중 페이지로 이동');
        navigate('/worker/while-work');
      } else if (type === 'return') {
        console.log('[MovementPage] 복귀 완료, 사후 도구 점검 페이지로 이동');
        navigate('/worker/tool-check/after');
      }
    } catch (error) {
      console.error('[MovementPage] 주행 종료 중 오류 발생:', error);
      // 주행 종료 오류는 일반 오류로 처리 (UI에 표시하지 않음)
      handleError(error.message || '주행 종료 처리 중 오류가 발생했습니다', '종료 실패', false, false);
    } finally {
      setIsLoading(false);
    }
  };

  // 모드 변경 핸들러
  const handleModeChange = async (newMode) => {
    console.log(`[MovementPage] 모드 변경 시도: ${currentMode} → ${newMode}`);
    if (currentMode === newMode || isLoading) {
      console.log('[MovementPage] 모드 변경 무시: 동일 모드 또는 로딩 중');
      return;
    }

    setIsLoading(true);
    setStreamingRequestComplete(false); // 모드 변경 시 스트리밍 상태 초기화

    try {
      if (currentMode === 'manual' && newMode === 'follow') {
        // 모드 전환 전 안전을 위해 정지 명령 전송
        try {
          await manualDriveStop();
        } catch (stopError) {
          console.warn('[MovementPage] 정지 명령 실패, 무시하고 계속:', stopError);
        }

        // 카메라가 활성화되어 있고 오류가 없는 경우에만 중지 시도
        if (isStreamingActive && !isCameraError) {
          console.log('[MovementPage] 수동 모드 카메라 중지 요청');
          try {
            await stopCameraStreaming();
            setIsStreamingActive(false);
          } catch (cameraError) {
            console.warn('[MovementPage] 카메라 중지 실패, 무시하고 계속:', cameraError);
          }
        }

        // 추종 주행 시작
        console.log('[MovementPage] 추종 주행 시작 요청');
        await startDrive();
        console.log('[MovementPage] 추종 주행 시작 성공');
        setCurrentMode(newMode);
        setIsStreamingActive(true);
        setStreamingRequestComplete(true); // 모드 변경 완료, 스트리밍 활성화

      } else if (currentMode === 'follow' && newMode === 'manual') {
        // 추종 주행 중지
        console.log('[MovementPage] 추종 주행 중지 요청');
        await stopDrive();
        setIsStreamingActive(false);

        // 카메라 시작 시도
        try {
          console.log('[MovementPage] 수동 모드 카메라 시작 요청');
          await startCameraStreaming();
          console.log('[MovementPage] 수동 모드 카메라 시작 성공');
          setIsStreamingActive(true);
          setIsCameraError(false);
          setStreamingRequestComplete(true); // 모드 변경 완료, 스트리밍 활성화
        } catch (cameraError) {
          console.error('[MovementPage] 카메라 시작 실패, 카메라 없이 수동 모드로 전환:', cameraError);
          setIsCameraError(true);
          setStreamingRequestComplete(true); // 요청은 완료되었으나 실패함
        }

        setCurrentMode(newMode);
      }

      console.log(`[MovementPage] 모드 변경 완료: ${newMode}`);
    } catch (error) {
      console.error(`[MovementPage] ${currentMode}에서 ${newMode}로 모드 변경 중 오류 발생:`, error);
      handleError(error.message || '모드 변경 중 오류가 발생했습니다', '모드 전환 실패', false, true);
      setStreamingRequestComplete(true); // 오류 발생했지만 요청 처리는 완료됨
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <Header isMainPage={false} pageName="오늘의 작업 선택"/>
      <div className="movement-page">
        {/* 모드 선택 영역 */}
        <div className="movement-page__mode-selector">
          <button
            className={`movement-page__mode-selector-button ${currentMode === 'manual' ? 'movement-page__mode-selector-button--active' : 'movement-page__mode-selector-button--inactive'}`}
            onClick={() => handleModeChange('manual')}
            disabled={isLoading}
          >
            수동 조작 모드
          </button>
          <button
            className={`movement-page__mode-selector-button ${currentMode === 'follow' ? 'movement-page__mode-selector-button--active' : 'movement-page__mode-selector-button--inactive'}`}
            onClick={() => handleModeChange('follow')}
            disabled={isLoading}
          >
            추종 주행 모드
          </button>
        </div>

        {/* 스트리밍 영역 */}
        <div className="movement-page__streaming">
          {/* 모드 전환 오류 메시지 표시 영역 */}
          {modeChangeError && (
            <div className="movement-page__error-message">
              <span>{modeChangeError}</span>
            </div>
          )}
          {/* 
            isActive: 스트리밍이 활성화 상태인지 여부
            streamingReady: API 요청이 완료되어 iframe을 로드할 준비가 되었는지 여부
            onRetry: 카메라 재연결 시도 콜백
          */}
          <Streaming 
            isActive={isStreamingActive} 
            streamingReady={!isCameraError && streamingRequestComplete}
            onRetry={retryCameraConnection}
          />

          {/* 카메라 연결 상태 메시지 제거 - Streaming 컴포넌트로 이동 */}
        </div>

        {/* 제어 버튼 영역 */}
        <div className="movement-page__control">
          {currentMode === 'manual' ? (
            <ManualControlButton onControl={handleControl} />
          ) : (
            <div className="movement-page__control-follow-message">
              <span>추종 주행 중입니다</span>
            </div>
          )}
        </div>

        {/* 주행 종료 버튼 */}
        <div className="movement-page__end-button">
          <button
            onClick={handleEndMovement}
            disabled={isLoading}
          >
            주행 종료
          </button>
        </div>
      </div>
    </div>
  );
};