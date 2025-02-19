import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useTools } from '@/contexts/ToolsContext';
import { Button } from '@/shared/ui/Button/Button';
import { Header } from '@/shared/ui/Header/Header';
import { ModalFrame } from '@/shared/ui/ModalWorker/ModalFrame';
import { Streaming } from '@/features/streaming/Streaming';
import './styles.scss';

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

    const routeConfig = ROUTE_CONFIG[checkType] || ROUTE_CONFIG.before;

    useEffect(() => {
        initializeTools();
    }, []);

    useEffect(() => {
        if (tools.length > 0 && detectionStatus === DETECTION_STATUS.DETECTING) {
            detectTools();
        }
    }, [tools, detectedTools, detectionStatus]);

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
            } catch (error) {
                console.error('Failed to fetch tools:', error);
                navigate('/worker/prepare-tool');
            }
        } else {
            setTools(activeTools);
        }
    };

    const sendDetectionRequest = async (action) => {
        try {
            // 실제 API 엔드포인트로 대체 필요
            await fetch('/api/detection', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ action }),
            });
            setLastDetectionRequest(action);
        } catch (error) {
            console.error('Detection request failed:', error);
        }
    };

    const detectTools = async () => {
        const undetectedTools = tools.filter(tool => !detectedTools.has(tool.id));
        if (undetectedTools.length === 0) return;

        try {
            const response = await mockDetectTools(undetectedTools);
            const newlyDetectedTools = getNewlyDetectedTools(undetectedTools, response.undetectedTools);
            
            if (newlyDetectedTools.length > 0) {
                setDetectedTools(prev => {
                    const newSet = new Set(prev);
                    newlyDetectedTools.forEach(toolId => newSet.add(toolId));
                    return newSet;
                });
            }
        } catch (error) {
            console.error('Detection failed:', error);
        }
    };

    const getNewlyDetectedTools = (previousUndetected, currentUndetected) => {
        const previousIds = new Set(previousUndetected.map(tool => tool.id));
        const currentIds = new Set(currentUndetected.map(tool => tool.id));
        return Array.from(previousIds).filter(id => !currentIds.has(id));
    };

    const stopDetection = async () => {
        await sendDetectionRequest('stop');
        setDetectionStatus(DETECTION_STATUS.PAUSED);
    };

    const resumeDetection = async () => {
        await sendDetectionRequest('start');
        setDetectionStatus(DETECTION_STATUS.DETECTING);
    };

    const handleManualCheck = async (toolId) => {
        setDetectedTools(prev => {
            const newSet = new Set(prev);
            newSet.add(toolId);
            return newSet;
        });
    };

    const handleComplete = async () => {
        if (detectedTools.size === tools.length) {
            if (lastDetectionRequest === 'start') {
                await sendDetectionRequest('stop');
            }
            navigate(routeConfig.nextPage);
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