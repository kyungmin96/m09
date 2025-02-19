import { useEffect, useState, useRef } from 'react';
import './Streaming.scss';

export const Streaming = ({ isActive = true }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const iframeRef = useRef(null);
  const streamingUrl = 'http://i12a202.p.ssafy.io/streaming/';

  // 컴포넌트 마운트/언마운트 시 로깅
  useEffect(() => {
    console.log('[Streaming] 컴포넌트 마운트됨, isActive:', isActive);
    
    return () => {
      console.log('[Streaming] 컴포넌트 언마운트됨');
    };
  }, []);

  // isActive 변경 시 상태 업데이트
  useEffect(() => {
    console.log('[Streaming] isActive 변경됨:', isActive);
    
    if (isActive) {
      // 로딩 상태만 짧게 표시 후 스트리밍 시작
      setIsLoading(true);
      const timer = setTimeout(() => {
        setIsLoading(false);
      }, 1000);
      return () => clearTimeout(timer);
    } else {
      setIsLoading(true);
      setHasError(false);
    }
  }, [isActive]);
  
  const getContainerClass = () => {
    let className = 'streaming-container';
    if (isLoading) className += ' is-loading';
    if (hasError) className += ' has-error';
    if (!isActive) className += ' is-inactive';
    return className;
  };

  return (
    <div className={getContainerClass()}>
      {isLoading ? (
        <div className="message loading-message">
          {isActive ? '카메라 스트림을 준비 중입니다. 잠시만 기다려주세요...' : '카메라 활성화 대기 중...'}
        </div>
      ) : hasError ? (
        <div className="message error-message">
          카메라 스트림을 불러오는데 실패했습니다.<br />
          잠시 후 다시 시도해주세요.
        </div>
      ) : !isActive ? (
        <div className="message inactive-message">
          현재 카메라가 활성화되어 있지 않습니다.
        </div>
      ) : (
        <iframe
          ref={iframeRef}
          src={streamingUrl}
          className={isActive && !isLoading && !hasError ? 'iframe-visible' : 'iframe-hidden'}
          title="임베디드 카메라 스트리밍"
          allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        ></iframe>
      )}
    </div>
  );
};