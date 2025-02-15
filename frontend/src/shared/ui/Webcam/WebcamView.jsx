import React, { useEffect, useRef, useState } from 'react';
import './WebcamView.scss';

export const WebcamView = ({
    isActive = true,
    isPaused = false,
    onStreamStart,
    onStreamError,
    deviceId,
    className,
}) => {
    const videoRef = useRef(null);
    const streamRef = useRef(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (isActive) {
            initializeCamera();
        }
        return () => {
            stopStream();
        };
    }, [isActive, deviceId]);

    useEffect(() => {
        if (videoRef.current && streamRef.current) {
            videoRef.current.srcObject = isPaused ? null : streamRef.current;
        }
    }, [isPaused]);

    const initializeCamera = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                video: {
                    deviceId: deviceId ? { exact: deviceId } : undefined,
                    facingMode: 'environment',
                    width: { ideal: 1280 },
                    height: { ideal: 720 }
                }
            });

            streamRef.current = stream;
            
            if (videoRef.current && !isPaused) {
                videoRef.current.srcObject = stream;
            }

            setError(null);
            onStreamStart?.();
        } catch (err) {
            console.error('Failed to initialize camera:', err);
            setError('카메라를 시작할 수 없습니다.');
            onStreamError?.(err);
        }
    };

    const stopStream = () => {
        if (streamRef.current) {
            streamRef.current.getTracks().forEach(track => track.stop());
            streamRef.current = null;
        }
        if (videoRef.current) {
            videoRef.current.srcObject = null;
        }
    };

    return (
        <div className={`webcam-view ${isPaused ? 'paused' : ''} ${className || ''}`}>
            {error ? (
                <div className="error-message">
                    <span>{error}</span>
                </div>
            ) : (
                <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    className="video-element"
                />
            )}
            {isPaused && (
                <div className="pause-overlay">
                    <span>탐지 일시중지됨</span>
                </div>
            )}
        </div>
    );
};