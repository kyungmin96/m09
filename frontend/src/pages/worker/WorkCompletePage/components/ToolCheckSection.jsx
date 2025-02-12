import { useNavigate } from "react-router-dom";
import { useState, useEffect, useMemo } from "react";
import ToolCheckSection from "@/shared/ui/ToolCheck/ToolCheck";
import Button from "@/shared/ui/Button/Button";
import "./ToolReturnSection.scss";  // 파일명 변경

const ToolReturnSection = () => {    // 컴포넌트명 변경
    const navigate = useNavigate();
    const [tools, setTools] = useState([]);
    const [checkedTools, setCheckedTools] = useState([]);
    const [disabledTools, setDisabledTools] = useState(new Set());
    const [allTools, setAllTools] = useState([]);

    const activeTools = useMemo(() => {
        return allTools.filter(tool =>
            !disabledTools.has(`${tool.id}-${tool.isDefault ? 'default' : 'additional'}`)
        );
    }, [allTools, disabledTools]);

    useEffect(() => {
        // todayTools에서 도구 목록 로드
        const savedTools = localStorage.getItem('todayTools');
        if (savedTools) {
            const parsedTools = JSON.parse(savedTools);
            // 각 도구의 상태 초기화
            const initialTools = parsedTools.map(tool => ({
                ...tool,
                isActive: true,
                isChecked: false
            }));
            
            setTools(initialTools);
        }
    }, []);

    const handleToolsUpdate = (updatedCheckedTools, updatedDisabledTools, updatedAllTools) => {
        setCheckedTools(updatedCheckedTools);
        setDisabledTools(updatedDisabledTools);
        setAllTools(updatedAllTools);
    };

    const handleComplete = () => {
        const isAllChecked = activeTools.length > 0 && 
            activeTools.length === checkedTools.length;
    
        if (!isAllChecked) return;
    
        // 모든 도구가 반납되었으므로 localStorage 초기화
        localStorage.removeItem('checkedTools');
        localStorage.removeItem('additionalTools');
        localStorage.removeItem('dailyWorkStatus');  // 작업 상태도 초기화
    
        navigate('/worker/complete');
    };

    return (
        <div className="tool-return-page">
            <div className="header">
                <h1>공구 반납</h1>
            </div>
            <div className="content">
                <ToolCheckSection
                    tools={tools}
                    onToolsUpdate={handleToolsUpdate}
                    isReturnPage={true}
                    hideAddButton={true}
                    hideDeleteButton={true}
                    hideDisableButton={true}
                    hideNewBadge={true}
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
                    공구 반납 완료 ({checkedTools.length}/{activeTools.length})
                </Button>
            </div>
        </div>
    );
};

export default ToolReturnSection;