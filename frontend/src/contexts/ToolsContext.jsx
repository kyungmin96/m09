import { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

const STORAGE_KEYS = {
    REQUIRED_TOOLS: 'requiredTools',
    ADDITIONAL_TOOLS: 'additionalTools'
};

// Mock 데이터
const MOCK_REQUIRED_TOOLS = [
    { id: 1, name: '드라이버', code: 'T001', isRequired: true, isActive: true },
    { id: 2, name: '렌치', code: 'T002', isRequired: true, isActive: true },
    { id: 3, name: '망치', code: 'T003', isRequired: true, isActive: true }
];

const MOCK_AVAILABLE_TOOLS = [
    { id: 4, name: '펜치', code: 'T004', isRequired: false, isActive: true },
    { id: 5, name: '전기 테스터기', code: 'T005', isRequired: false, isActive: true },
    { id: 6, name: '절단기', code: 'T006', isRequired: false, isActive: true },
    { id: 7, name: '전동 드릴', code: 'T007', isRequired: false, isActive: true },
    { id: 8, name: '공구 세트', code: 'T008', isRequired: false, isActive: true }
];

const ToolsContext = createContext();

export const ToolsProvider = ({ children }) => {
    const { user } = useAuth();
    const [requiredTools, setRequiredTools] = useState(() => {
        const stored = localStorage.getItem(STORAGE_KEYS.REQUIRED_TOOLS);
        return stored ? JSON.parse(stored) : [];
    });

    const [additionalTools, setAdditionalTools] = useState(() => {
        const stored = localStorage.getItem(STORAGE_KEYS.ADDITIONAL_TOOLS);
        return stored ? JSON.parse(stored) : [];
    });

    const [availableTools, setAvailableTools] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    // LocalStorage 동기화
    useEffect(() => {
        if (requiredTools.length > 0) {
            localStorage.setItem(STORAGE_KEYS.REQUIRED_TOOLS, JSON.stringify(requiredTools));
        }
    }, [requiredTools]);

    useEffect(() => {
        if (additionalTools.length > 0) {
            localStorage.setItem(STORAGE_KEYS.ADDITIONAL_TOOLS, JSON.stringify(additionalTools));
        }
    }, [additionalTools]);

    // Mock API 호출
    const fetchRequiredTools = async () => {
        setIsLoading(true);
        try {
            // 실제 API 호출로 대체 예정
            await new Promise(resolve => setTimeout(resolve, 800));
            setRequiredTools(MOCK_REQUIRED_TOOLS);
        } catch (error) {
            console.error('Failed to fetch required tools:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const fetchAvailableTools = async () => {
        setIsLoading(true);
        try {
            // 실제 API 호출로 대체 예정
            await new Promise(resolve => setTimeout(resolve, 800));
            setAvailableTools(MOCK_AVAILABLE_TOOLS);
        } catch (error) {
            console.error('Failed to fetch available tools:', error);
        } finally {
            setIsLoading(false);
        }
    };

    // 공구 상태 관리 함수들
    const toggleToolStatus = (toolId) => {
        setRequiredTools(prev => prev.map(tool => 
            tool.id === toolId 
                ? { ...tool, isActive: !tool.isActive }
                : tool
        ));
    };

    const addTools = (toolIds) => {
        const toolsToAdd = availableTools.filter(tool => 
            toolIds.includes(tool.id) && 
            !requiredTools.some(t => t.id === tool.id) &&
            !additionalTools.some(t => t.id === tool.id)
        );

        setAdditionalTools(prev => [...prev, ...toolsToAdd]);
    };

    const removeAdditionalTool = (toolId) => {
        setAdditionalTools(prev => prev.filter(tool => tool.id !== toolId));
    };

    const clearToolsData = () => {
        setRequiredTools([]);
        setAdditionalTools([]);
        localStorage.removeItem(STORAGE_KEYS.REQUIRED_TOOLS);
        localStorage.removeItem(STORAGE_KEYS.ADDITIONAL_TOOLS);
    };

    const getActiveTools = () => {
        const activeRequired = requiredTools.filter(tool => tool.isActive);
        return [...activeRequired, ...additionalTools];
    };

    const getInactiveTools = () => {
        return requiredTools.filter(tool => !tool.isActive);
    };

    return (
        <ToolsContext.Provider value={{
            requiredTools,
            additionalTools,
            availableTools,
            isLoading,
            fetchRequiredTools,
            fetchAvailableTools,
            toggleToolStatus,
            addTools,
            removeAdditionalTool,
            clearToolsData,
            getActiveTools,
            getInactiveTools
        }}>
            {children}
        </ToolsContext.Provider>
    );
};

export const useTools = () => {
    const context = useContext(ToolsContext);
    if (!context) {
        throw new Error('useTools must be used within a ToolsProvider');
    }
    return context;
};