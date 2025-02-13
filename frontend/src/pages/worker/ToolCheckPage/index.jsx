import { useNavigate } from "react-router-dom";
import { useState, useEffect, useMemo } from "react";
import ToolCheckSection from "@/shared/ui/ToolCheck/ToolCheck";
import TodayWorkList from "./components/TodayWorkList";
import Modal from "./components/AddToolModal";
import Button from "@/shared/ui/Button/Button";
import "./styles.scss";

export const ToolCheckPage = () => {
    const navigate = useNavigate();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [tools, setTools] = useState([]);
    const [checkedTools, setCheckedTools] = useState([]);
    const [disabledTools, setDisabledTools] = useState(new Set());
    const [allTools, setAllTools] = useState([]);

    // 초기 도구 목록 설정
    useEffect(() => {
        const initializeTools = () => {
            // 선택된 작업에서 도구 목록 가져오기
            const savedTasks = localStorage.getItem('selectedTasks');
            if (!savedTasks) return;

            const parsedTasks = JSON.parse(savedTasks);
            
            // 모든 작업의 도구 목록 추출 및 중복 제거
            const toolSet = new Set();
            parsedTasks.forEach(task => {
                task.tools.forEach(tool => toolSet.add(tool));
            });

            // 기본 도구 목록 생성
            const defaultTools = Array.from(toolSet).map((toolName, index) => ({
                id: `default-${index + 1}`,
                name: toolName,
                works: parsedTasks
                    .filter(task => task.tools.includes(toolName))
                    .map(task => ({
                        id: `work-${task.id}`,
                        name: task.name
                    })),
                isDefault: true,
                isActive: true,
                isChecked: false
            }));

            // localStorage에서 추가된 도구 로드
            const storedAdditionalTools = JSON.parse(localStorage.getItem('additionalTools') || '[]');
            
            // 전체 도구 목록 설정
            setTools([...defaultTools, ...storedAdditionalTools]);
        };

        initializeTools();
    }, []);

    // 활성화된 도구 계산
    const activeTools = useMemo(() => {
        return allTools.filter(tool =>
            !disabledTools.has(`${tool.id}-${tool.isDefault ? 'default' : 'additional'}`)
        );
    }, [allTools, disabledTools]);

    // 공구 추가 핸들러
    const handleAddTool = (newTools) => {
        const toolsToAdd = newTools.map(newTool => ({
            ...newTool,
            id: `additional-${Date.now()}-${newTool.id}`,
            isDefault: false,
            isActive: true,
            works: newTool.works.map((work, index) => ({
                ...work,
                id: `${newTool.id}-${index + 1}`
            }))
        }));

        const updatedTools = [...tools, ...toolsToAdd];
        setTools(updatedTools);

        // localStorage에 추가된 도구 저장
        const additionalTools = updatedTools.filter(tool => !tool.isDefault);
        localStorage.setItem('additionalTools', JSON.stringify(additionalTools));

        setIsModalOpen(false);
    };

    // 공구 삭제 핸들러
    const handleDeleteTool = (toolKey) => {
        const updatedTools = tools.filter(tool =>
            `${tool.id}-${tool.isDefault ? 'default' : 'additional'}` !== toolKey
        );

        setTools(updatedTools);

        // localStorage 업데이트 (추가된 도구만)
        const additionalTools = updatedTools.filter(tool => !tool.isDefault);
        localStorage.setItem('additionalTools', JSON.stringify(additionalTools));
    };

    // ToolCheckSection에서 업데이트된 상태 처리
    const handleToolsUpdate = (updatedCheckedTools, updatedDisabledTools, updatedAllTools) => {
        setCheckedTools(updatedCheckedTools);
        setDisabledTools(updatedDisabledTools);
        setAllTools(updatedAllTools);

        // 체크된 도구 목록 localStorage에 저장
        localStorage.setItem('checkedTools', JSON.stringify(updatedCheckedTools));
        
        // 추가된 도구 목록 localStorage에 저장
        const additionalTools = updatedAllTools.filter(tool => !tool.isDefault);
        localStorage.setItem('additionalTools', JSON.stringify(additionalTools));
    };

    // 완료 처리
    const handleComplete = () => {
        // 비활성화되지 않은 도구 중 체크되지 않은 도구가 있는지 확인
        const isAllChecked = activeTools.length > 0 &&
            activeTools.length === checkedTools.length;

        if (!isAllChecked) return;

        // 활성화된 모든 도구 저장
        const toolsToSave = activeTools.map(({ id, name, works, isDefault }) => ({
            id,
            name,
            works,
            isDefault
        }));

        // localStorage에 저장
        localStorage.setItem('todayTools', JSON.stringify(toolsToSave));

        navigate('/worker/safety-check');
    };

    return (
        <div className="tool-check-page">
            <div className="header">
                <h1>공구 체크리스트</h1>
            </div>
            <div className="content">
                <TodayWorkList />
                <ToolCheckSection
                    tools={tools}
                    onAddToolClick={() => setIsModalOpen(true)}
                    onToolsUpdate={handleToolsUpdate}
                    onDeleteTool={handleDeleteTool}
                />
            </div>
            <div className="button-wrapper">
                <Button
                    variant="main"
                    size="full"
                    onClick={handleComplete}
                    disabled={
                        activeTools.length === 0 ||
                        activeTools.length !== checkedTools.length
                    }
                >
                    공구 준비 완료 ({checkedTools.length}/{activeTools.length})
                </Button>
            </div>
            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSubmit={handleAddTool}
            />
        </div>
    );
};