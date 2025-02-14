import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useWorks } from '@/contexts/WorksContext';
import { ModalFrame } from '@/shared/ui/ModalWorker/ModalFrame';
import { Button } from '@/shared/ui/Button/Button';
import './styles.scss';

export const MainPage = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const { todayWorks, selectedWorks, updateTodayWorks } = useWorks();
    const [cartInfo, setCartInfo] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isRfidModalOpen, setIsRfidModalOpen] = useState(false);
    const [currentDate, setCurrentDate] = useState(new Date());

    // API : 오늘의 작업 목록 조회
    const fetchTodayWorks = async () => {
        try {
            const response = await fetch('/api/v1/tasks/posts/in-process', {
                headers: {
                    'Authorization': `Bearer ${user.token}`
                }
            });
            const data = await response.json();
            updateTodayWorks(data.works);
        } catch (error) {
            console.error('Failed to fetch today works:', error);
        }
    };

    // API : 작업 시작 및 공구 목록 조회
    const startWorkAndFetchTools = async (workIds) => {
        try {
            // 1. 작업 시작 시간 기록
            const startResponse = await fetch('/api/v1/tasks/posts/start', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${user.token}`
                },
                body: JSON.stringify({ workIds })
            });

            if (!startResponse.ok) {
                throw new Error('작업 시작에 실패했습니다.');
            }

            // 2. 공구 목록 조회
            const queryString = workIds.map(id => `workId=${id}`).join('&');
            const toolsResponse = await fetch(`/api/v1/tasks/posts/tools?${queryString}`, {
                headers: {
                    'Authorization': `Bearer ${user.token}`
                }
            });

            if (!toolsResponse.ok) {
                throw new Error('공구 목록 조회에 실패했습니다.');
            }

            return await toolsResponse.json();
        } catch (error) {
            console.error('Error:', error.message);
            throw error;
        }
    };

    // API : RFID 카트 등록 (현재 미사용)
    /*
    const registerCartWithRfid = async () => {
        try {
            const response = await fetch('/api/v1/rfid/cart-registration', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${user.token}`
                }
            });

            if (!response.ok) {
                throw new Error('카트 등록에 실패했습니다.');
            }

            const cartData = await response.json();
            return cartData;
        } catch (error) {
            console.error('Failed to register cart:', error);
            throw error;
        }
    };
    */

    // API : 컴포넌트 마운트 시 오늘 작업 목록 조회
    useEffect(() => {
        if (user && !todayWorks.length) {
            fetchTodayWorks();
        }
    }, [user, updateTodayWorks]);

    // 카트 등록 시뮬레이션 핸들러
    const handleCartRegister = () => {
        setIsRfidModalOpen(true);
        setIsLoading(true);

        // 3-5초 사이의 임의의 시간 동안 로딩 후 카트 정보 설정
        const registrationTime = Math.floor(Math.random() * (5000 - 3000 + 1)) + 3000;

        setTimeout(() => {
            // 더미 카트 데이터 생성
            const dummyCartData = {
                id: `목${Math.floor(Math.random() * 9000) + 1000}`,
                battery: Math.floor(Math.random() * 80) + 20 // 20-100 사이의 배터리 레벨
            };

            setCartInfo(dummyCartData);
            setIsRfidModalOpen(false);
            setIsLoading(false);
        }, registrationTime);
    };

    // 작업 설정 페이지로 이동
    const handleWorkSettingClick = () => {
        navigate('/worker/today-task');
    };

    // 작업 시작 처리
    const handleStartWorkClick = async () => {
        try {
            setIsLoading(true);
            const workIds = selectedWorks.map(work => work.id);
            
            // 작업 시작 처리 및 공구 목록 조회
            // 더미 공구 데이터 생성
            const dummyToolsData = {
                tools: [
                    { id: 1, name: '드라이버', code: 'TOOL-001' },
                    { id: 2, name: '렌치', code: 'TOOL-002' }
                ]
            };
            // const toolsData = await startWorkAndFetchTools(workIds);
            
            // 공구 목록 저장 후 공구 확정 페이지로 이동
            localStorage.setItem('workTools', JSON.stringify(dummyToolsData));
            navigate('/worker/prepare-tool');
        } catch (error) {
            // 에러 처리 (사용자에게 알림 등)
            console.error('Failed to start work:', error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="main-page">
            <header className="main-header">
                <h1>안녕하세요, {user?.name}님</h1>

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
                    <div className="schedule-header">
                        <h2>오늘의 작업</h2>
                        <span className="today-date">
                            {currentDate.toLocaleDateString('ko-KR', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric',
                                weekday: 'long'
                            })}
                        </span>
                    </div>
                    <div className="work-list">
                        {todayWorks.map(work => {
                            const isConfigured = selectedWorks.some(
                                selected => selected.id === work.id
                            );
                            return (
                                <div key={work.id} className={`work-item ${isConfigured ? 'configured' : ''}`}>
                                    <div className="work-info">
                                        <h3>{work.title}</h3>
                                        {isConfigured && selectedWorks.find(w => w.id === work.id).workers?.length > 0 && (
                                            <p className="workers">
                                                공동작업자: {selectedWorks.find(w => w.id === work.id).workers.map(w => w.name).join(', ')}
                                            </p>
                                        )}
                                    </div>
                                    <div className="work-status">
                                        {isConfigured ? (
                                            <span className="status-badge configured">설정 완료</span>
                                        ) : (
                                            <span className="status-badge">미설정</span>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </section>

                <div className="action-buttons">
                    <button
                        className="work-setting-button"
                        onClick={handleWorkSettingClick}
                    >
                        오늘의 작업 설정하기
                    </button>
                    <button
                        className="start-work-button"
                        onClick={handleStartWorkClick}
                        disabled={!cartInfo || !selectedWorks.length || isLoading}
                    >
                        {isLoading ? '작업 시작 처리 중...' : '작업하러 가기'}
                    </button>
                </div>
            </main>

            <ModalFrame
                isOpen={isRfidModalOpen}
                onClose={() => setIsRfidModalOpen(false)}
                title="카트 등록"
                footerContent={null}
            >
                <div className="rfid-registration-modal">
                    <div className="loading-spinner"></div>
                    <p>RFID 카트 등록 중입니다...</p>
                </div>
            </ModalFrame>
        </div>
    );
};