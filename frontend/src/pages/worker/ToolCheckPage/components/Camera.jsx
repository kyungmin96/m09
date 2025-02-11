// Camera.jsx
import React, { useEffect, useRef, useState } from 'react';
import './Camera.scss';

const Camera = ({ isEnabled = true }) => {
  const videoRef = useRef(null);
  const [error, setError] = useState(null);
  const [isStreamActive, setIsStreamActive] = useState(false);

  useEffect(() => {
    if (!isEnabled) {
      setError('카메라가 비활성화되어 있습니다.');
      return;
    }

    const startCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ 
          video: true,
          audio: false
        });
        
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          setIsStreamActive(true);
          setError(null);
        }
      } catch (err) {
        setError('카메라 연결에 실패했습니다.');
        setIsStreamActive(false);
      }
    };

    startCamera();

    return () => {
      // 컴포넌트 언마운트 시 스트림 정리
      if (videoRef.current?.srcObject) {
        const tracks = videoRef.current.srcObject.getTracks();
        tracks.forEach(track => track.stop());
      }
    };
  }, [isEnabled]);

  return (
    <div className="camera-container">
      {error ? (
        <div className="camera-error">
          <span className="error-message">{error}</span>
        </div>
      ) : (
        <div className="video-container">
          <video
            ref={videoRef}
            autoPlay
            playsInline
            className="camera-feed"
          />
          {isStreamActive && (
            <div className="live-badge">
              LIVE
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Camera;