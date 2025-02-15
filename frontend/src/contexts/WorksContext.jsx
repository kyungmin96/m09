import { createContext, useContext, useState, useEffect } from 'react';

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
    },
    {
        id: 2,
        title: '착륙장치 정비',
        content: '착륙장치 유압 시스템 점검 및 작동 테스트',
        location: 'Hangar B-2',
        comment: '지난 정비 시 우측 유압 압력 불안정 현상 있었음',
        scheduledEndTime: '2025-02-16T17:00:00',
        taskState: WORK_STATUS.READY,
    },
    {
        id: 3,
        title: '전기 시스템 점검',
        content: '항공기 전기 시스템 전반적인 상태 점검',
        location: 'Hangar A-2',
        comment: '배터리 교체 후 첫 점검',
        scheduledEndTime: '2025-02-15T15:00:00',
        taskState: WORK_STATUS.READY,
    }
];

const WorksContext = createContext();

export const WorksProvider = ({ children }) => {
    // 서버에서 받은 전체 작업 목록
    const [todayWorks, setTodayWorks] = useState(() => {
        const storedWorks = localStorage.getItem('todayWorks');
        return storedWorks ? JSON.parse(storedWorks) : DEFAULT_TODAY_WORKS;
    });
    
    // 서버 날짜
    const [serverDate, setServerDate] = useState(() => {
        const storedDate = localStorage.getItem('serverDate');
        return storedDate || '';
    });

    // 작업자가 선택하고 공동작업자를 설정한 작업 목록
    const [selectedWorks, setSelectedWorks] = useState(() => {
        const storedSelectedWorks = localStorage.getItem('selectedWorks');
        return storedSelectedWorks ? JSON.parse(storedSelectedWorks) : [];
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

    return (
        <WorksContext.Provider value={{
            todayWorks,
            selectedWorks,
            serverDate,
            updateTodayWorks,
            updateSelectedWorks,
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