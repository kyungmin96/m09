import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Header } from '@/shared/ui/Header/Header';
import { useWorks } from '@/contexts/WorksContext';
import { useTools } from '@/contexts/ToolsContext';
import { ModalFrame } from '@/shared/ui/ModalWorker/ModalFrame';
import { Button } from '@/shared/ui/Button/Button';
import './styles.scss';

export const PrepareToolPage = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const { selectedWorks } = useWorks();
    const { 
        requiredTools,
        additionalTools,
        availableTools,
        isLoading,
        toggleToolStatus,
        addTools,
        removeAdditionalTool,
        getActiveTools,
        getInactiveTools
    } = useTools();  // fetchRequiredTools, fetchAvailableTools 제거

    const [isToolModalOpen, setIsToolModalOpen] = useState(false);
    const [selectedToolIds, setSelectedToolIds] = useState(new Set());
    const [isStarting, setIsStarting] = useState(false);

    // 이 useEffect는 제거 (ToolsContext에서 자동으로 처리됨)
    // useEffect(() => {
    //     fetchRequiredTools();
    // }, [selectedWorks]);

    const handleOpenToolModal = () => {
        // fetchAvailableTools 호출 제거
        setIsToolModalOpen(true);
    };

    const handleToolSelection = (toolId) => {
        setSelectedToolIds(prev => {
            const newSet = new Set(prev);
            if (newSet.has(toolId)) {
                newSet.delete(toolId);
            } else {
                newSet.add(toolId);
            }
            return newSet;
        });
    };

    const handleAddTools = () => {
        addTools(Array.from(selectedToolIds));
        setSelectedToolIds(new Set());
        setIsToolModalOpen(false);
    };

    const handleStartWork = async () => {
        try {
            setIsStarting(true);
            await new Promise(resolve => setTimeout(resolve, 800)); // Mock API delay

            const activeTools = getActiveTools();
            const inactiveTools = getInactiveTools();

            console.log('작업 시작:', {
                workIds: selectedWorks.map(work => work.id),
                activeTools: activeTools.map(tool => tool.id),
                inactiveTools: inactiveTools.map(tool => tool.id)
            });

            navigate('/worker/tool-check/before');
        } catch (error) {
            console.error('Failed to start work:', error);
        } finally {
            setIsStarting(false);
        }
    };

    return (
        <div className="work-page">
            <Header isMainPage={false} pageName="공구 확정"/>
            <section className="required-tools">
                <h2>필요한 공구</h2>
                {requiredTools.map(tool => (
                    <div 
                        key={tool.id} 
                        className={`tool-item ${tool.isActive ? 'active' : 'inactive'}`}
                    >
                        <span className="tool-name">{tool.name}</span>
                        <Button 
                            variant={tool.isActive ? "secondary" : "main"}
                            onClick={() => toggleToolStatus(tool.id)}
                        >
                            {tool.isActive ? '제외' : '추가'}
                        </Button>
                    </div>
                ))}
            </section>

            {additionalTools.length > 0 && (
                <section className="additional-tools">
                    <h2>추가된 공구</h2>
                    {additionalTools.map(tool => (
                        <div key={tool.id} className="tool-item">
                            <span>{tool.name}</span>
                            <Button 
                                variant="secondary" 
                                onClick={() => removeAdditionalTool(tool.id)}
                            >
                                삭제
                            </Button>
                        </div>
                    ))}
                </section>
            )}

            <div className="tool-actions">
                <Button 
                    variant="main" 
                    onClick={handleOpenToolModal}
                    disabled={isLoading}
                >
                    공구 추가
                </Button>
                <Button 
                    variant="main" 
                    onClick={handleStartWork}
                    disabled={isLoading || isStarting}
                >
                    {isStarting ? '공구 탐지 준비 중...' : '다음 단계 이동'}
                </Button>
            </div>

            <ModalFrame
                isOpen={isToolModalOpen}
                onClose={() => {
                    setIsToolModalOpen(false);
                    setSelectedToolIds(new Set());
                }}
                title="공구 선택"
                footerContent={
                    <Button
                        variant="main"
                        size="full"
                        onClick={handleAddTools}
                        disabled={selectedToolIds.size === 0}
                    >
                        {selectedToolIds.size}개 추가하기
                    </Button>
                }
            >
                <div className="tool-selection">
                    {availableTools.map(tool => (
                        <div 
                            key={tool.id} 
                            className={`tool-item ${selectedToolIds.has(tool.id) ? 'selected' : ''}`}
                            onClick={() => handleToolSelection(tool.id)}
                        >
                            <span>{tool.name}</span>
                            <div className="checkbox">
                                {selectedToolIds.has(tool.id) && '✓'}
                            </div>
                        </div>
                    ))}
                </div>
            </ModalFrame>
        </div>
    );
};