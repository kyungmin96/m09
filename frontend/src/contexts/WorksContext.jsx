import { createContext, useContext, useState, useEffect } from 'react';
import { api } from '@/shared/api/axios';
import { API_ROUTES } from '@/shared/api/routes';

export const WORK_STATUS = {
    READY: 'READY',
    IN_PROGRESS: 'IN_PROGRESS',
    COMPLETED: 'COMPLETED',
};

// 서버에서 최초로 받는 작업 데이터 형식
const DEFAULT_TODAY_WORKS = [
    {
        id: 1,
        title: '엔진 점검 및 정비',
        content: '항공기 엔진 정기 점검 및 부품 교체 작업',
        location: 'Hangar A-1',
        comment: '최근 시동 시 비정상 소음 발생 이력 있음',
        scheduledEndTime: '2025-02-15T17:00:00',
        taskState: WORK_STATUS.READY,
        specialNotes: [] // 특이사항 배열 추가
    },
    {
        id: 2,
        title: '착륙장치 정비',
        content: '착륙장치 유압 시스템 점검 및 작동 테스트',
        location: 'Hangar B-2',
        comment: '지난 정비 시 우측 유압 압력 불안정 현상 있었음',
        scheduledEndTime: '2025-02-16T17:00:00',
        taskState: WORK_STATUS.READY,
        specialNotes: []
    },
    {
        id: 3,
        title: '전기 시스템 점검',
        content: '항공기 전기 시스템 전반적인 상태 점검',
        location: 'Hangar A-2',
        comment: '배터리 교체 후 첫 점검',
        scheduledEndTime: '2025-02-15T15:00:00',
        taskState: WORK_STATUS.READY,
        specialNotes: []
    }
];

const WorksContext = createContext();

export const WorksProvider = ({ children }) => {
    const [todayWorks, setTodayWorks] = useState(() => {
        const storedWorks = localStorage.getItem('todayWorks');
        return storedWorks ? JSON.parse(storedWorks) : DEFAULT_TODAY_WORKS;
    });
    
    const [serverDate, setServerDate] = useState(() => {
        const storedDate = localStorage.getItem('serverDate');
        return storedDate || '';
    });

    const [selectedWorks, setSelectedWorks] = useState(() => {
        const storedSelectedWorks = localStorage.getItem('selectedWorks');
        return storedSelectedWorks ? JSON.parse(storedSelectedWorks) : [];
    });

    const [uniqueTools, setUniqueTools] = useState(() => {
        const storedTools = localStorage.getItem('uniqueTools');
        return storedTools ? JSON.parse(storedTools) : [];
    });

    const [isAllocated, setIsAllocated] = useState(() => {
        const allocated = localStorage.getItem('isAllocated');
        return allocated ? JSON.parse(allocated) : false;
    });

    useEffect(() => {
        const storedWorks = localStorage.getItem('todayWorks');
        const storedSelectedWorks = localStorage.getItem('selectedWorks');
        const storedDate = localStorage.getItem('serverDate');
        
        if (storedWorks) setTodayWorks(JSON.parse(storedWorks));
        if (storedSelectedWorks) setSelectedWorks(JSON.parse(storedSelectedWorks));
        if (storedDate) setServerDate(storedDate);
    }, []);

    const updateTodayWorks = (works, date) => {
        setTodayWorks(works);
        setServerDate(date);
        localStorage.setItem('todayWorks', JSON.stringify(works));
        localStorage.setItem('serverDate', date);
    };

    const updateSelectedWorks = (works) => {
        setSelectedWorks(works);
        localStorage.setItem('selectedWorks', JSON.stringify(works));
    };

    // 특이사항 관련 함수들 추가
    const addSpecialNote = (workId, content) => {
        const newNote = {
            id: Date.now(),
            content,
            timestamp: new Date().toISOString()
        };

        const updatedWorks = selectedWorks.map(work => {
            if (work.id === workId) {
                return {
                    ...work,
                    specialNotes: [...(work.specialNotes || []), newNote]
                };
            }
            return work;
        });

        updateSelectedWorks(updatedWorks);
    };

    const deleteSpecialNote = (workId, noteId) => {
        const updatedWorks = selectedWorks.map(work => {
            if (work.id === workId) {
                return {
                    ...work,
                    specialNotes: work.specialNotes.filter(note => note.id !== noteId)
                };
            }
            return work;
        });

        updateSelectedWorks(updatedWorks);
    };

    // 작업별 공동 작업자 할당 및 공구 목록 조회
    const allocateCompanions = async (workersAllocation) => {
        try {
            const response = await api.post(
                API_ROUTES.TASKS.TODAY_ALLOCATE, 
                workersAllocation
            );
            
            if (response.data.success) {
                const tools = response.data.data.uniqueTools;
                setUniqueTools(tools);
                setIsAllocated(true);
                localStorage.setItem('uniqueTools', JSON.stringify(tools));
                localStorage.setItem('isAllocated', 'true');
                return tools;
            }
            throw new Error('Failed to allocate companions');
        } catch (error) {
            console.error('Companions allocation error:', error);
            throw error;
        }
    };

    // allocation 상태 초기화 함수 추가
    const resetAllocation = () => {
        setIsAllocated(false);
        localStorage.removeItem('isAllocated');
    };

    // 선택된 작업들의 공동 작업자 정보를 API 요청 형식으로 변환
    const prepareWorkersAllocation = () => {
        return selectedWorks
            .filter(work => work.workers && work.workers.length > 0)
            .map(work => ({
                taskId: work.id,
                employeeIds: work.workers.map(worker => worker.employeeId)
            }));
    };

    return (
        <WorksContext.Provider value={{
            todayWorks,
            selectedWorks,
            serverDate,
            uniqueTools,
            isAllocated,
            updateTodayWorks,
            updateSelectedWorks,
            addSpecialNote,
            deleteSpecialNote,
            allocateCompanions,
            resetAllocation,
            prepareWorkersAllocation
        }}>
            {children}
        </WorksContext.Provider>
    );
};

export const useWorks = () => {
    const context = useContext(WorksContext);
    if (!context) {
        throw new Error('useWorks must be used within a WorksProvider');
    }
    return context;
};