import { useNavigate } from "react-router-dom";
import { useState, useEffect, useMemo } from "react";
import { ToolCheckSection } from "@/shared/ui/ToolCheck/ToolCheck";
import { Button } from "@/shared/ui/Button/Button";
import "./ToolReturnSection.scss";

export const ToolReturnSection = () => {
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
        const savedTools = localStorage.getItem('todayTools');
        if (savedTools) {
            const parsedTools = JSON.parse(savedTools);
            const initialTools = parsedTools.map(tool => ({
                ...tool,
                isActive: true,
                isChecked: false,
                taskState: tool.taskState || 'START'
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
        if (activeTools.length === 0 || activeTools.length !== checkedTools.length) return;
        
        // 반납 완료 처리
        const updatedTools = tools.map(tool => ({
            ...tool,
            taskState: 'COMPLETE',
            endTime: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        }));
        
        localStorage.setItem('todayTools', JSON.stringify(updatedTools));
        localStorage.removeItem('checkedTools');
        localStorage.removeItem('additionalTools');
        
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
