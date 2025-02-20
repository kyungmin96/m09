import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Header } from '@/shared/ui/Header/Header';
import { useWorks } from '@/contexts/WorksContext';
import { useTools } from '@/contexts/ToolsContext';
import { ModalFrame } from '@/shared/ui/ModalWorker/ModalFrame';
import { Button } from '@/shared/ui/Button/Button';
import './styles.scss';
import { convertToolListToKorean } from '@/utils/toolNameMapper';

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
        getInactiveTools,
        updateAndSaveRequiredTools
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

    const handleNextStep = () => {
        try {
            // 1. 현재 활성화된 필수 공구만 필터링
            const activeRequiredTools = requiredTools.filter(tool => tool.isActive);
            console.log('활성화된 필수 공구:', activeRequiredTools);

            // 2. 추가된 공구 목록과 병합
            const mergedTools = [
                ...activeRequiredTools,
                ...additionalTools
            ];
            console.log('병합된 전체 공구:', mergedTools);

            // 3. id 기준으로 중복 제거
            const uniqueTools = Array.from(
                new Map(mergedTools.map(tool => [tool.id, {
                    ...tool,
                    isRequired: true,  // 최종 목록에 추가되는 모든 공구는 필수로 설정
                    isActive: true     // 모든 공구를 활성 상태로 설정
                }])).values()
            );
            console.log('중복 제거된 최종 공구:', uniqueTools);

            // 4. localStorage와 Context 상태 모두 업데이트
            localStorage.setItem('requiredTools', JSON.stringify(uniqueTools));
            updateAndSaveRequiredTools(uniqueTools);

            // 5. 다음 페이지로 이동
            navigate('/worker/tool-check/before');
        } catch (error) {
            console.error('Failed to save tools:', error);
        }
    };

    // 공구 목록 렌더링 시 한글 이름으로 변환
    const koreanRequiredTools = convertToolListToKorean(requiredTools);
    const koreanAdditionalTools = convertToolListToKorean(additionalTools);
    const koreanAvailableTools = convertToolListToKorean(availableTools);

    return (
        <div className="work-page">
            <Header isMainPage={false} pageName="공구 확정" />
            <main>
                <section className="required-tools">
                    <div className="tools-head">
                        <h2>필요한 공구</h2>
                        <Button
                            variant="main"
                            size="small"
                            onClick={handleOpenToolModal}
                            disabled={isLoading}
                        >
                            공구 추가
                        </Button>
                    </div>
                    {koreanRequiredTools.map(tool => (
                        <div
                            key={tool.id}
                            className={`tool-item ${tool.isActive ? 'active' : 'inactive'}`}
                        >
                            <span className="tool-name">{tool.name}</span>
                            <Button
                                size="small"
                                variant={tool.isActive ? "secondary" : "main"}
                                onClick={() => toggleToolStatus(tool.id)}
                            >
                                {tool.isActive ? '제외' : '추가'}
                            </Button>
                        </div>
                    ))}
                </section>

                {koreanAdditionalTools.length > 0 && (
                    <section className="additional-tools">
                        <div className="tools-head">
                            <h2 className="additional-head">추가된 공구</h2>
                        </div>
                        {koreanAdditionalTools.map(tool => (
                            <div key={tool.id} className="tool-item">
                                <span>{tool.name}</span>
                                <Button
                                    size="small"
                                    variant="secondary"
                                    onClick={() => removeAdditionalTool(tool.id)}
                                >
                                    삭제
                                </Button>
                            </div>
                        ))}
                    </section>
                )}
            </main>
            <div className="tool-actions">
                <Button
                    variant="main"
                    size="full"
                    onClick={handleNextStep}
                    disabled={isLoading}
                >
                    다음 단계 이동
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
                    {koreanAvailableTools.map(tool => (
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