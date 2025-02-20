import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useTools } from '@/contexts/ToolsContext';
import { Button } from '@/shared/ui/Button/Button';
import { Header } from '@/shared/ui/Header/Header';
import { ModalFrame } from '@/shared/ui/ModalWorker/ModalFrame';
import { Streaming } from '@/features/streaming/Streaming';
import websocketService from '@/features/websocket/websocketService';
import './styles.scss';
import { startToolDetection, stopToolDetection } from './toolCheck.api';

const DETECTION_STATUS = {
    DETECTING: 'DETECTING',
    PAUSED: 'PAUSED',
    COMPLETED: 'COMPLETED'
};

const ROUTE_CONFIG = {
    before: {
        nextPage: '/worker/safety-check',
        buttonText: '다음 단계',
        title: '작업 전 공구 체크리스트'
    },
    after: {
        nextPage: '/worker/complete-work',
        buttonText: '반납 완료',
        title: '작업 후 공구 체크리스트'
    }
};

export const ToolCheckPage = () => {
    const navigate = useNavigate();
    const { checkType } = useParams();
    const { 
        getActiveTools,
        isLoading,
        fetchRequiredTools 
    } = useTools();

    const [detectionStatus, setDetectionStatus] = useState(DETECTION_STATUS.DETECTING);
    const [detectedTools, setDetectedTools] = useState(new Set());
    const [tools, setTools] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [lastDetectionRequest, setLastDetectionRequest] = useState('start');
    const [streamingReady, setStreamingReady] = useState(false);
    const [isConnected, setIsConnected] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    const routeConfig = ROUTE_CONFIG[checkType] || ROUTE_CONFIG.before;

    useEffect(() => {
        initializeTools();
        return () => {
            if (isConnected) {
                handleWebSocketStop();
            }
        };
    }, []);

    const initializeTools = async () => {
        const activeTools = getActiveTools();
        
        if (activeTools.length === 0) {
            try {
                await fetchRequiredTools();
                const updatedTools = getActiveTools();
                
                if (updatedTools.length === 0) {
                    navigate('/worker/prepare-tool');
                    return;
                }
                
                setTools(updatedTools);
                await startWebSocketConnection(updatedTools);
            } catch (error) {
                console.error('Failed to initialize:', error);
                navigate('/worker/prepare-tool');
            }
        } else {
            setTools(activeTools);
            await startWebSocketConnection(activeTools);
        }
    };

    const startWebSocketConnection = async (toolsList) => {
        try {
            setDetectionStatus(DETECTION_STATUS.DETECTING);
            setErrorMessage('');
            
            // 웹소켓 연결
            await websocketService.connectWebSocket();
            setIsConnected(true);
            
            // 초기화: 모든 공구 미탐지 상태로 설정
            setDetectedTools(new Set());
            
            // 메시지 수신 콜백 설정
            websocketService.setOnMessageCallback((data) => {
                try {
                    const result = JSON.parse(data);
                    console.log('[WebSocket] 공구 탐지 결과:', result);
                    
                    // 공구 탐지 상태 업데이트
                    toolsList.forEach(tool => {
                        if (result[tool.name] === true) {
                            setDetectedTools(prev => {
                                const newSet = new Set(prev);
                                newSet.add(tool.id);
                                return newSet;
                            });
                        }
                    });
                } catch (error) {
                    console.error('[WebSocket] JSON 파싱 오류:', error);
                }
            });
            
            // 연결 종료 콜백 설정
            websocketService.setOnCloseCallback(() => {
                setIsConnected(false);
                setDetectionStatus(DETECTION_STATUS.PAUSED);
                setStreamingReady(false);
            });
            
            // 에러 콜백 설정
            websocketService.setOnErrorCallback((error) => {
                setErrorMessage(`연결 오류: ${error.message}`);
                setDetectionStatus(DETECTION_STATUS.PAUSED);
                setStreamingReady(false);
            });
            
            // 공구 탐지 시작 API 요청
            const toolNames = toolsList.map(tool => tool.name);
            await startToolDetection(toolNames);
            
            // 스트리밍 준비 완료
            setStreamingReady(true);
            
        } catch (error) {
            setErrorMessage(`오류 발생: ${error.message}`);
            setDetectionStatus(DETECTION_STATUS.PAUSED);
            setIsConnected(false);
            setStreamingReady(false);
        }
    };

    const stopDetection = async () => {
        await handleWebSocketStop();
        setDetectionStatus(DETECTION_STATUS.PAUSED);
    };

    const resumeDetection = async () => {
        await startWebSocketConnection(tools);
    };

    const handleWebSocketStop = async () => {
        try {
            if (isConnected) {
                await stopToolDetection();
                websocketService.closeConnection();
            }
            setIsConnected(false);
            setStreamingReady(false);
        } catch (error) {
            console.error('Failed to stop websocket:', error);
            setErrorMessage(`중지 중 오류 발생: ${error.message}`);
        }
    };

    const handleManualCheck = async (toolId) => {
        setDetectedTools(prev => {
            const newSet = new Set(prev);
            newSet.add(toolId);
            return newSet;
        });
    };

    const handleComplete = async () => {
        try {
            if (detectedTools.size === tools.length) {
                if (detectionStatus === DETECTION_STATUS.DETECTING) {
                    // 탐지 중지 API 호출 및 웹소켓 연결 종료
                    await handleWebSocketStop();
                }
                navigate(routeConfig.nextPage);
            }
        } catch (error) {
            console.error('Failed to complete tool check:', error);
            setErrorMessage('공구 체크 완료 처리 중 오류가 발생했습니다.');
        }
    };

    const openManualCheckModal = async () => {
        await stopDetection();
        setIsModalOpen(true);
    };

    const closeManualCheckModal = () => {
        setIsModalOpen(false);
    };

    // Mock function for tool detection API - 실제 구현시 대체 필요
    const mockDetectTools = async (undetectedTools) => {
        await new Promise(resolve => setTimeout(resolve, 1000));
        const remainingTools = undetectedTools
            .filter(() => Math.random() > 0.3);
        return { undetectedTools: remainingTools };
    };

    const getUndetectedTools = () => {
        return tools.filter(tool => !detectedTools.has(tool.id));
    };

    // Sort tools to move detected ones to the bottom
    const sortedTools = [...tools].sort((a, b) => {
        const aDetected = detectedTools.has(a.id);
        const bDetected = detectedTools.has(b.id);
        return aDetected === bDetected ? 0 : aDetected ? 1 : -1;
    });

    return (
        <div className="tool-check-page">
            <Header isMainPage={false} pageName={routeConfig.title}/>
            <div className="webcam-section">
                <Streaming
                    isActive={detectionStatus === DETECTION_STATUS.DETECTING}
                    streamingReady={streamingReady}
                />
            </div>

            <div className="camera-controls">
                <Button 
                    variant="secondary" 
                    onClick={detectionStatus === DETECTION_STATUS.DETECTING ? stopDetection : resumeDetection}
                    className="control-button"
                >
                    {detectionStatus === DETECTION_STATUS.DETECTING ? '탐지 중지' : '탐지 재시작'}
                </Button>
                <Button 
                    variant="secondary" 
                    onClick={openManualCheckModal}
                    className="control-button"
                >
                    수동 체크
                </Button>
            </div>
            <div className="work-title">
                <p>필요한 공구 {detectedTools.size}/{tools.length}개 탐지됨</p>
            </div>
            <section className="tools-list">
                {sortedTools.map(tool => (
                    <div 
                        key={tool.id} 
                        className={`tool-item ${detectedTools.has(tool.id) ? 'detected' : ''}`}
                    >
                        <span className="tool-name">{tool.name}</span>
                        <span className="tool-status">
                            {detectedTools.has(tool.id) ? '✓ 탐지됨' : '미탐지'}
                        </span>
                    </div>
                ))}
            </section>

            <div className="next-step-controls">
                <Button 
                    variant="main" 
                    onClick={handleComplete}
                    disabled={detectedTools.size !== tools.length}
                    className="next-button"
                >
                    {routeConfig.buttonText}
                </Button>
            </div>

            {errorMessage && (
                <div className="error-message">
                    {errorMessage}
                </div>
            )}

            <ModalFrame
                isOpen={isModalOpen}
                onClose={closeManualCheckModal}
                title="미탐지 공구 확인"
                footerContent={
                    <Button
                        variant="main"
                        size="full"
                        onClick={closeManualCheckModal}
                        disabled={detectedTools.size !== tools.length}
                    >
                        수동 체크 완료
                    </Button>
                }
            >
                <div className="undetected-tools">
                    <p>다음 공구들이 아직 탐지되지 않았습니다:</p>
                    {getUndetectedTools().map(tool => (
                        <div key={tool.id} className="tool-item">
                            <span>{tool.name}</span>
                            <Button
                                variant="secondary"
                                onClick={() => handleManualCheck(tool.id)}
                            >
                                수동 체크
                            </Button>
                        </div>
                    ))}
                </div>
            </ModalFrame>
        </div>
    );
};