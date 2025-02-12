import { useNavigate } from "react-router-dom";
import { useState, useEffect, useMemo } from "react";
import ToolCheckSection from "@/shared/ui/ToolCheck/ToolCheck";
import Button from "@/shared/ui/Button/Button";
import "./styles.scss";

const ToolReturnPage = () => {
    const navigate = useNavigate();
    const [tools, setTools] = useState([]);
    const [checkedTools, setCheckedTools] = useState([]);
    const [disabledTools, setDisabledTools] = useState(new Set());
    const [allTools, setAllTools] = useState([]);

    // 활성화된 도구 계산
    const activeTools = useMemo(() => {
        return allTools.filter(tool =>
            !disabledTools.has(`${tool.id}-${tool.isDefault ? 'default' : 'additional'}`)
        );
    }, [allTools, disabledTools]);

    useEffect(() => {
        // localStorage에서 오늘 사용한 도구 목록 로드
        const storedTools = JSON.parse(localStorage.getItem('todayTools') || '[]');
        
        // 각 도구의 상태 초기화
        const initialTools = storedTools.map(tool => ({
            ...tool,
            isActive: true,
            isChecked: false
        }));
        
        setTools(initialTools);
    }, []);

    // ToolCheckSection에서 업데이트된 상태 처리
    const handleToolsUpdate = (updatedCheckedTools, updatedDisabledTools, updatedAllTools) => {
        setCheckedTools(updatedCheckedTools);
        setDisabledTools(updatedDisabledTools);
        setAllTools(updatedAllTools);
    };

    // 완료 처리
    const handleComplete = () => {
        // 비활성화되지 않은 도구 중 체크되지 않은 도구가 있는지 확인
        const isAllChecked = activeTools.length > 0 && 
            activeTools.length === checkedTools.length;
    
        if (!isAllChecked) return;
    
        // 모든 도구가 반납되었으므로 localStorage 초기화
        localStorage.removeItem('todayTools');
        localStorage.removeItem('additionalTools');
    
        // 완료 후 다음 페이지로 이동
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
                    hideDeleteButton={true}    // 삭제 버튼 숨김
                    hideDisableButton={true}   // 비활성화 버튼 숨김
                    hideNewBadge={true}        // New 뱃지 숨김
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

export default ToolReturnPage;