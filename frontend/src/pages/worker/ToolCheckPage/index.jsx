import { useNavigate } from "react-router-dom";
import { useState, useEffect, useMemo } from "react";
import ToolCheckSection from "./components/ToolCheck";
import TodayWorkList from "./components/TodayWorkList";
import Modal from "./components/Modal";
import Button from "@/shared/ui/Button/Button";
import "./styles.scss";

// 기본 도구 데이터
const MOCK_DEFAULT_TOOLS = [
    {
        id: 1,
        name: "토크 렌치 세트",
        works: [
            { id: "1-1", name: "엔진 점검" },
            { id: "1-2", name: "타이어 교체" }
        ],
        isDefault: true,
        isActive: true,
        isChecked: false
    },
    {
        id: 2,
        name: "유압 게이지",
        works: [
            { id: "2-1", name: "엔진 점검" }
        ],
        isDefault: true,
        isActive: true,
        isChecked: false
    },
    {
        id: 3,
        name: "멀티미터",
        works: [
            { id: "3-1", name: "전기 시스템 점검" }
        ],
        isDefault: true,
        isActive: true,
        isChecked: false
    }
];

const ToolCheckPage = () => {
    const navigate = useNavigate();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [tools, setTools] = useState(() => {
        // localStorage에서 추가된 도구 로드
        const storedAdditionalTools = JSON.parse(localStorage.getItem('additionalTools') || '[]');
        return [...MOCK_DEFAULT_TOOLS, ...storedAdditionalTools];
    });
    const [checkedTools, setCheckedTools] = useState([]);
    const [disabledTools, setDisabledTools] = useState(new Set());
    const [allTools, setAllTools] = useState([]);

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
            id: `additional-${Date.now()}-${newTool.id}`, // 고유 ID 생성
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

    // 공구 삭제 핸들러 (추가)
    const handleDeleteTool = (toolKey) => {
        // 도구 삭제
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
    
        // 기본 도구 제외한 추가된 도구만 저장
        const toolsToSave = allTools
            .filter(tool => !tool.isDefault)
            .map(({ id, name, works }) => ({ id, name, works }));
    
        // localStorage에 저장된 도구 업데이트
        localStorage.setItem('todayTools', JSON.stringify(toolsToSave));
        localStorage.setItem('additionalTools', JSON.stringify(toolsToSave));
    
        navigate('/return');
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
                    onDeleteTool={handleDeleteTool} // 추가된 prop
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

export default ToolCheckPage;