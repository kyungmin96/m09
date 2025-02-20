import { useEffect, useState, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import './Streaming.scss';

export const Streaming = ({ isActive = true, streamingReady = false, onRetry }) => {
  const location = useLocation();
  const [streamStatus, setStreamStatus] = useState('loading'); // 'loading', 'success', 'error'
  const [streamUrl, setStreamUrl] = useState('');
  const iframeRef = useRef(null);
  const isDirectStreamAccess = location.pathname.startsWith('/stream/');

  useEffect(() => {
    console.log('[Streaming] 컴포넌트 마운트됨, isActive:', isActive, 'streamingReady:', streamingReady, 'isDirectAccess:', isDirectStreamAccess);
    
    // 직접 /stream/ 경로로 접근한 경우 (iframe 내부가 아닌 직접 URL 접근)
    if (isDirectStreamAccess) {
      // 이미 스트림 URL에 있으므로 iframe을 표시하지 않고 현재 페이지를 그대로 사용
      return () => {
        console.log('[Streaming] 직접 접근 컴포넌트 언마운트됨');
      };
    }
    
    // isActive가 false면 그냥 loading 상태를 유지
    if (isActive && streamingReady) {
      // 실제 스트리밍 URL 사용
      const baseStreamUrl = "http://70.12.246.80:8765/barebone/camera/stream";
      setStreamUrl(baseStreamUrl);
      setStreamStatus('success');
    } else if (isActive && !streamingReady) {
      setStreamStatus('loading');
    } else {
      setStreamStatus('loading');
    }
    
    return () => {
      console.log('[Streaming] 컴포넌트 언마운트됨');
    };
  }, [isActive, streamingReady, isDirectStreamAccess]);

  // 재시도 핸들러 - 부모 컴포넌트의 onRetry 콜백 호출
  const handleRetry = () => {
    console.log('[Streaming] 스트리밍 재시도 요청');
    if (onRetry && typeof onRetry === 'function') {
      onRetry();
    }
  };

  // 직접 스트림 URL에 접근한 경우 iframe 없이 컨텐츠를 직접 표시
  if (isDirectStreamAccess) {
    return (
      <div className="direct-stream-content">
        {/* 여기는 스트림 서버의 실제 컨텐츠가 표시됨 - 아무것도 렌더링하지 않음 */}
      </div>
    );
  }

  // 상태에 따른 CSS 클래스 계산
  const getContainerClass = () => {
    let className = 'streaming-container';
    if (streamStatus === 'loading') className += ' is-loading';
    if (streamStatus === 'error') className += ' has-error';
    return className;
  };

  return (
    <div className={getContainerClass()}>
      {streamStatus === 'loading' && (
        <div className="message loading-message">
          카메라 스트림을 준비 중입니다. 잠시만 기다려주세요...
        </div>
      )}
      
      {streamStatus === 'error' && (
        <div className="message error-message">
          카메라 스트림을 불러오는데 실패했습니다.<br />
          <button 
            className="retry-button"
            onClick={handleRetry}
          >
            재시도
          </button>
        </div>
      )}
      
      {streamStatus === 'success' && (
        <iframe
          ref={iframeRef}
          src={streamUrl}
          className="streaming-iframe"
          title="임베디드 카메라 스트리밍"
          allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        ></iframe>
      )}
    </div>
  );
};