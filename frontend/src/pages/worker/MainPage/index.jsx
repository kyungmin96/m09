// MainPage.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './styles.scss';

export const MainPage = () => {
    const navigate = useNavigate();
    const [cartInfo, setCartInfo] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [selectedDate, setSelectedDate] = useState(new Date('2025-01-17'));

    // 더미 작업 데이터 - 추후 실제 데이터로 대체
    const workData = {
        '2025-01-17': [
            {
                id: 1,
                title: '엔진 점검 및 정비',
                workers: ['김병지', '염정우'],
                count: 0
            },
            {
                id: 2,
                title: '작물 장치 정비',
                workers: ['김병지', '염정우'],
                count: 0
            }
        ],
        '2025-01-18': [
            {
                id: 3,
                title: '배터리 점검',
                workers: ['이영표', '안정환'],
                count: 1
            }
        ]
    };

    const getWeekDates = (baseDate) => {
        const dates = [];
        for (let i = -3; i <= 3; i++) {
            const date = new Date(baseDate);
            date.setDate(date.getDate() + i);
            const dateKey = date.toISOString().split('T')[0];
            dates.push({
                date: date,
                workCount: workData[dateKey]?.length || 0,
                isToday: i === 0,
            });
        }
        return dates;
    };

    const [weekDates, setWeekDates] = useState(getWeekDates(selectedDate));

    // 날짜 이동 (좌우 버튼)
    const handleDateChange = (direction) => {
        const newDate = new Date(selectedDate);
        newDate.setDate(newDate.getDate() + (direction === 'prev' ? -7 : 7));
        updateSelectedDate(newDate);
    };

    // 특정 날짜 선택
    const handleDateSelect = (date) => {
        updateSelectedDate(date);
    };

    // 날짜 업데이트 공통 함수
    const updateSelectedDate = (newDate) => {
        setSelectedDate(newDate);
        setWeekDates(getWeekDates(newDate));
    };

    // 현재 선택된 날짜의 작업 목록 가져오기
    const getCurrentWorks = () => {
        const dateKey = selectedDate.toISOString().split('T')[0];
        return workData[dateKey] || [];
    };

    // 카트 등록 핸들러
    const handleCartRegister = () => {
        setIsLoading(true);
        setTimeout(() => {
            setCartInfo({
                id: '09목 9678',
                battery: 67
            });
            setIsLoading(false);
        }, 1000);
    };

    const handleWorkSettingClick = () => {
        navigate('/worker/today-task');
    };

    return (
        <div className="main-page">
            <header className="main-header">
                <h1>안녕하세요, 김동우님</h1>

                <div className="cart-section">
                    {!cartInfo ? (
                        <div className="cart-registration">
                            <div className="cart-empty">
                                <div className="cart-icon">+</div>
                                <p>카트 정보 없음</p>
                            </div>
                            <button
                                className="register-button"
                                onClick={handleCartRegister}
                                disabled={isLoading}
                            >
                                카트 등록
                            </button>
                        </div>
                    ) : (
                        <div className="cart-info">
                            <span>배정 카트 {cartInfo.id}</span>
                            <div className="battery-status">
                                <div className="battery-bar" style={{ width: `${cartInfo.battery}%` }}></div>
                                <span>{cartInfo.battery}%</span>
                            </div>
                        </div>
                    )}
                </div>
            </header>

            <main className="main-content">
                <section className="work-schedule">
                    <h2>작업 현황</h2>
                    <div className="calendar-section">
                        <div className="calendar-nav">
                            <button
                                className="nav-button"
                                onClick={() => handleDateChange('prev')}
                            >
                                &lt;
                            </button>
                            <span>
                                {selectedDate.getFullYear()}년 {selectedDate.getMonth() + 1}월 {selectedDate.getDate()}일
                            </span>
                            <button
                                className="nav-button"
                                onClick={() => handleDateChange('next')}
                            >
                                &gt;
                            </button>
                        </div>

                        <div className="weekdays">
                            {['화', '수', '목', '금', '토', '일', '월'].map(day => (
                                <div key={day} className="weekday">{day}</div>
                            ))}
                        </div>

                        <div className="dates-grid">
                            {weekDates.map(({ date, workCount, isToday }) => (
                                <div
                                    key={date.toISOString()}
                                    className={`date-cell ${isToday ? 'selected' : ''}`}
                                    onClick={() => handleDateSelect(date)}
                                >
                                    <span className="date">{date.getDate()}</span>
                                    {workCount > 0 && (
                                        <span className="work-count">{workCount}</span>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="work-list">
                        {getCurrentWorks().map(work => (
                            <div key={work.id} className="work-item">
                                <span className="count">{work.count}</span>
                                <div className="work-info">
                                    <h3>{work.title}</h3>
                                    <p className="workers">공동작업자: {work.workers.join(', ')}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                <button
                    className="work-setting-button"
                    onClick={handleWorkSettingClick}
                >
                    오늘의 작업 설정하기
                </button>
            </main>
        </div>
    );
}