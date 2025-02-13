import { useNavigate } from "react-router-dom";
import { useState, useEffect, useMemo } from "react";
import { ToolCheckSection } from "@/shared/ui/ToolCheck/ToolCheck";
import { TodayWorkList } from "./components/TodayWorkList";
import { Modal } from "./components/AddToolModal";
import { Button } from "@/shared/ui/Button/Button";
import "./styles.scss";

// 기본 도구 데이터 구조
const createToolObject = (name, works = [], isDefault = true) => ({
    id: `tool-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    title: name,  // name 대신 title 사용
    content: '',  // 설명이 필요한 경우를 위해 추가
    comment: null,
    location: null,
    assignedUser: null,
    scheduledStartTime: null,
    scheduledEndTime: null,
    startTime: null,
    endTime: null,
    taskState: 'READY',
    createdAt: new Date().toISOString(),
    updatedAt: null,
    isDefault,
    works
});

export const ToolCheckPage = () => {
    const navigate = useNavigate();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [tools, setTools] = useState([]);
    const [checkedTools, setCheckedTools] = useState([]);
    const [disabledTools, setDisabledTools] = useState(new Set());
    const [allTools, setAllTools] = useState([]);

    useEffect(() => {
        const initializeTools = () => {
            const savedTasks = localStorage.getItem('selectedTasks');
            if (!savedTasks) return;

            const parsedTasks = JSON.parse(savedTasks);
            
            // 작업별 필요 도구 추출 (tools 필드가 있다고 가정)
            const toolSet = new Set();
            parsedTasks.forEach(task => {
                // tools 필드가 없는 경우를 대비한 안전한 접근
                const taskTools = task.content?.split(',') || [];
                taskTools.forEach(tool => toolSet.add(tool.trim()));
            });

            // 기본 도구 목록 생성
            const defaultTools = Array.from(toolSet).map(toolName => 
                createToolObject(toolName, parsedTasks
                    .filter(task => task.content?.includes(toolName))
                    .map(task => ({
                        id: task.id,
                        title: task.title,  // name 대신 title 사용
                        content: task.content
                    }))
                )
            );

            // localStorage에서 추가된 도구 로드
            const storedAdditionalTools = JSON.parse(localStorage.getItem('additionalTools') || '[]');
            
            setTools([...defaultTools, ...storedAdditionalTools]);
        };

        initializeTools();
    }, []);

    const activeTools = useMemo(() => {
        return allTools.filter(tool =>
            !disabledTools.has(`${tool.id}-${tool.isDefault ? 'default' : 'additional'}`)
        );
    }, [allTools, disabledTools]);

    const handleAddTool = (newTools) => {
        const toolsToAdd = newTools.map(newTool => ({
            ...createToolObject(newTool.title, newTool.works, false),
            content: newTool.content || ''
        }));

        const updatedTools = [...tools, ...toolsToAdd];
        setTools(updatedTools);

        const additionalTools = updatedTools.filter(tool => !tool.isDefault);
        localStorage.setItem('additionalTools', JSON.stringify(additionalTools));

        setIsModalOpen(false);
    };

    const handleDeleteTool = (toolKey) => {
        const updatedTools = tools.filter(tool =>
            `${tool.id}-${tool.isDefault ? 'default' : 'additional'}` !== toolKey
        );

        setTools(updatedTools);

        const additionalTools = updatedTools.filter(tool => !tool.isDefault);
        localStorage.setItem('additionalTools', JSON.stringify(additionalTools));
    };

    const handleToolsUpdate = (updatedCheckedTools, updatedDisabledTools, updatedAllTools) => {
        setCheckedTools(updatedCheckedTools);
        setDisabledTools(updatedDisabledTools);
        setAllTools(updatedAllTools);

        // 업데이트된 도구들의 상태 저장
        const toolsWithUpdates = updatedAllTools.map(tool => ({
            ...tool,
            taskState: updatedCheckedTools.includes(tool.id) ? 'COMPLETE' : 'READY',
            updatedAt: new Date().toISOString()
        }));

        localStorage.setItem('checkedTools', JSON.stringify(updatedCheckedTools));
        
        const additionalTools = toolsWithUpdates.filter(tool => !tool.isDefault);
        localStorage.setItem('additionalTools', JSON.stringify(additionalTools));
    };

    const handleComplete = () => {
        const isAllChecked = activeTools.length > 0 &&
            activeTools.length === checkedTools.length;

        if (!isAllChecked) return;

        const toolsToSave = activeTools.map(tool => ({
            ...tool,
            taskState: 'COMPLETE',
            endTime: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        }));

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