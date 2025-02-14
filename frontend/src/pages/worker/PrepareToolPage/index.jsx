import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useWorks } from '@/contexts/WorksContext';
import { ModalFrame } from '@/shared/ui/ModalWorker/ModalFrame';
import { Button } from '@/shared/ui/Button/Button';
import './styles.scss';

export const PrepareToolPage = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const { selectedWorks } = useWorks();

    // 필요한 공구 상태
    const [requiredTools, setRequiredTools] = useState([]);
    // 전체 공구 목록 상태
    const [availableTools, setAvailableTools] = useState([]);
    // 추가된 공구 목록 상태
    const [additionalTools, setAdditionalTools] = useState([]);
    // 제외할 공구 목록 상태
    const [excludedTools, setExcludedTools] = useState([]);
    
    // 모달 상태
    const [isToolModalOpen, setIsToolModalOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    // API: 필요한 공구 목록 조회
    const fetchRequiredTools = async () => {
        try {
            // 선택된 작업들의 ID 추출
            const workIds = selectedWorks.map(work => work.id);
            
            const response = await fetch('/api/v1/tasks/posts/tools', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${user.token}`
                },
                body: JSON.stringify({ workIds })
            });

            if (!response.ok) {
                throw new Error('필요한 공구 목록 조회에 실패했습니다.');
            }

            const data = await response.json();
            setRequiredTools(data.requiredTools);
        } catch (error) {
            console.error('Failed to fetch required tools:', error);
        }
    };

    // API: 전체 공구 목록 조회
    const fetchAvailableTools = async () => {
        try {
            const response = await fetch('/api/v1/tools', {
                headers: {
                    'Authorization': `Bearer ${user.token}`
                }
            });

            if (!response.ok) {
                throw new Error('전체 공구 목록 조회에 실패했습니다.');
            }

            const data = await response.json();
            setAvailableTools(data.tools);
        } catch (error) {
            console.error('Failed to fetch available tools:', error);
        }
    };

    // 컴포넌트 마운트 시 필요한 공구 목록 조회
    useEffect(() => {
        fetchRequiredTools();
    }, [selectedWorks]);

    // 공구 제외 처리
    const handleExcludeTool = (tool) => {
        // 필요한 공구에서 제외
        const updatedRequiredTools = requiredTools.filter(t => t.id !== tool.id);
        setRequiredTools(updatedRequiredTools);

        // 제외된 공구 목록에 추가
        setExcludedTools(prev => [...prev, tool]);
    };

    // 추가 공구 제외 처리
    const handleRemoveAdditionalTool = (tool) => {
        const updatedAdditionalTools = additionalTools.filter(t => t.id !== tool.id);
        setAdditionalTools(updatedAdditionalTools);
    };

    // 공구 추가 모달 열기
    const handleOpenToolModal = () => {
        fetchAvailableTools();
        setIsToolModalOpen(true);
    };

    // 공구 선택 및 추가
    const handleAddTools = (selectedToolIds) => {
        // 선택된 공구 필터링
        const selectedTools = availableTools.filter(tool => 
            selectedToolIds.includes(tool.id) && 
            !requiredTools.some(t => t.id === tool.id) &&
            !additionalTools.some(t => t.id === tool.id)
        );

        // 추가된 공구 목록에 추가
        setAdditionalTools(prev => [...prev, ...selectedTools]);
        setIsToolModalOpen(false);
    };

    // 작업 시작 및 공구 목록 서버 전송
    const handleStartWork = async () => {
        try {
            setIsLoading(true);
            
            // 최종 공구 목록 (필요한 공구 + 추가된 공구)
            const finalToolList = [...requiredTools, ...additionalTools];

            const response = await fetch('/api/v1/tasks/posts/tools/confirm', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${user.token}`
                },
                body: JSON.stringify({ 
                    workIds: selectedWorks.map(work => work.id),
                    tools: finalToolList.map(tool => tool.id),
                    excludedTools: excludedTools.map(tool => tool.id)
                })
            });

            if (!response.ok) {
                throw new Error('공구 목록 전송에 실패했습니다.');
            }

            // 다음 페이지로 이동 (예: 실제 작업 시작 페이지)
            navigate('/worker/actual-work');
        } catch (error) {
            console.error('Failed to start work:', error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="work-page">
            <header className="work-header">
                <h1>공구 체크리스트</h1>
            </header>

            <section className="required-tools">
                <h2>필요한 공구</h2>
                {requiredTools.map(tool => (
                    <div key={tool.id} className="tool-item">
                        <span>{tool.name}</span>
                        <Button 
                            variant="secondary" 
                            onClick={() => handleExcludeTool(tool)}
                        >
                            제외
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
                                onClick={() => handleRemoveAdditionalTool(tool)}
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
                >
                    공구 추가
                </Button>
                <Button 
                    variant="main" 
                    onClick={handleStartWork}
                    disabled={isLoading}
                >
                    {isLoading ? '작업 시작 준비 중...' : '작업 시작'}
                </Button>
            </div>

            <ModalFrame
                isOpen={isToolModalOpen}
                onClose={() => setIsToolModalOpen(false)}
                title="공구 선택"
                footerContent={
                    <Button
                        variant="main"
                        size="full"
                        onClick={() => {
                            // 선택된 공구 ID 추출 로직 필요
                            const selectedToolIds = []; // 실제 구현 시 동적으로 처리
                            handleAddTools(selectedToolIds);
                        }}
                    >
                        추가하기
                    </Button>
                }
            >
                <div className="tool-selection">
                    {availableTools.map(tool => (
                        <div 
                            key={tool.id} 
                            className="tool-item"
                        >
                            <span>{tool.name}</span>
                            {/* 공구 선택 로직 추가 필요 */}
                        </div>
                    ))}
                </div>
            </ModalFrame>
        </div>
    );
};