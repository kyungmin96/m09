// Streaming.jsx
import React, { useEffect, useState, useRef } from 'react';
import { getStreamingUrl } from '@/features/streaming/stream.api.js';
import './Streaming.scss';

export const Streaming = ({ isActive = true }) => {
  const [streamingUrl, setStreamingUrl] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const iframeRef = useRef(null);

  useEffect(() => {
    const fetchStreamingUrl = async () => {
      try {
        setIsLoading(true);
        setHasError(false);
        const url = await getStreamingUrl();
        setStreamingUrl(url);
      } catch (error) {
        console.error('스트리밍 URL 가져오기 실패:', error);
        setHasError(true);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStreamingUrl();
  }, []);

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
        <div className="message loading-message">카메라 스트림을 불러오는 중...</div>
      ) : hasError ? (
        <div className="message error-message">
          카메라 스트림을 불러오는데 실패했습니다.<br />
          잠시 후 다시 시도해주세요.
        </div>
      ) : !isActive ? (
        <div className="message inactive-message">
          현재 카메라가 활성화되어 있지 않습니다.<br />
          탐지 시작 버튼을 눌러 카메라를 활성화해주세요.
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