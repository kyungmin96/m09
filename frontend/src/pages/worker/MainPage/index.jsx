import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useWorks } from '@/contexts/WorksContext';
import { useCart } from '@/contexts/CartContext';
import { ModalFrame } from '@/shared/ui/ModalWorker/ModalFrame';
import { Button } from '@/shared/ui/Button/Button';
import './styles.scss';
import { getTodayWorks } from './workers.api';

// Mock 데이터 생성 함수들
const generateMockTools = (workIds) => ({
    tools: [
        { id: 1, name: '드라이버', code: 'T001', status: 'AVAILABLE' },
        { id: 2, name: '렌치', code: 'T002', status: 'AVAILABLE' },
        { id: 3, name: '망치', code: 'T003', status: 'AVAILABLE' },
        { id: 4, name: '펜치', code: 'T004', status: 'AVAILABLE' }
    ].slice(0, Math.floor(Math.random() * 3) + 2) // 2-4개의 랜덤한 공구 선택
});

const simulateApiDelay = () => new Promise(resolve => setTimeout(resolve, 1000));

export const MainPage = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const { todayWorks, selectedWorks, updateTodayWorks } = useWorks();
    const { 
        cartInfo, 
        isRegistering, 
        registrationError, 
        startRfidRegistration 
    } = useCart();
    
    const [isLoading, setIsLoading] = useState(false);
    const [isRfidModalOpen, setIsRfidModalOpen] = useState(false);
    const [currentDate] = useState(new Date());

    // Mock: 오늘의 작업 목록 조회
    const fetchTodayWorks = async () => {
        try {
            await getTodayWorks();
            // await simulateApiDelay();
            // 이미 WorksContext에서 기본 작업 목록을 제공하므로 
            // 추가 Mock 데이터 생성 없이 진행
        } catch (error) {
            console.error('Failed to fetch today works:', error);
        }
    };

    // Mock: 작업 시작 및 공구 목록 조회
    const startWorkAndFetchTools = async (workIds) => {
        try {
            await simulateApiDelay();
            
            // 작업 시작 시뮬레이션
            const startSuccess = Math.random() > 0.1; // 90% 성공률
            if (!startSuccess) {
                throw new Error('작업 시작에 실패했습니다.');
            }

            // 공구 목록 생성
            return generateMockTools(workIds);
        } catch (error) {
            console.error('Error:', error.message);
            throw error;
        }
    };

    useEffect(() => {
        if (user) {
            fetchTodayWorks();
        }
    }, [user, updateTodayWorks]);

    // 카트 등록 핸들러
    const handleCartRegister = async () => {
        setIsRfidModalOpen(true);
        
        try {
            await startRfidRegistration();
            setIsRfidModalOpen(false);
        } catch (error) {
            console.error('Cart registration failed:', error);
        }
    };

    // 작업 설정 페이지로 이동
    const handleWorkSettingClick = () => {
        navigate('/worker/today-task');
    };

    // 작업 시작 처리
    const handleStartWorkClick = async () => {
        if (!cartInfo || !selectedWorks.length) return;

        try {
            setIsLoading(true);
            const workIds = selectedWorks.map(work => work.id);
            
            const toolsData = await startWorkAndFetchTools(workIds);
            
            // 공구 목록 저장
            localStorage.setItem('workTools', JSON.stringify(toolsData));
            navigate('/worker/prepare-tool');
        } catch (error) {
            console.error('Failed to start work:', error);
            // TODO: 에러 알림 UI 추가
        } finally {
            setIsLoading(false);
        }
    };

    // 모달 닫기 핸들러
    const handleModalClose = () => {
        if (!isRegistering) {
            setIsRfidModalOpen(false);
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
                                disabled={isRegistering}
                            >
                                {isRegistering ? '등록 중...' : '카트 등록'}
                            </button>
                        </div>
                    ) : (
                        <div className="cart-info">
                            <span className="cart-name">{cartInfo.name}</span>
                            <div className="cart-status">
                                <div className="battery-status">
                                    <span className={`status-indicator ${cartInfo.hasBattery ? 'active' : 'inactive'}`}>
                                        {cartInfo.hasBattery ? '배터리 있음' : '배터리 없음'}
                                    </span>
                                </div>
                                <div className="connection-status">
                                    <span className={`status-indicator ${cartInfo.isConnected ? 'active' : 'inactive'}`}>
                                        {cartInfo.isConnected ? '연결됨' : '연결 끊김'}
                                    </span>
                                </div>
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
                            const configuredWork = selectedWorks.find(w => w.id === work.id);
                            
                            return (
                                <div 
                                    key={work.id} 
                                    className={`work-item ${isConfigured ? 'configured' : ''}`}
                                >
                                    <div className="work-info">
                                        <h3>{work.title}</h3>
                                        {isConfigured && configuredWork?.workers?.length > 0 && (
                                            <p className="workers">
                                                공동작업자: {
                                                    configuredWork.workers
                                                        .map(w => w.name)
                                                        .join(', ')
                                                }
                                            </p>
                                        )}
                                    </div>
                                    <div className="work-status">
                                        {isConfigured ? (
                                            <span className="status-badge configured">
                                                설정 완료
                                            </span>
                                        ) : (
                                            <span className="status-badge">
                                                미설정
                                            </span>
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
                onClose={handleModalClose}
                title="카트 등록"
                footerContent={
                    registrationError ? (
                        <Button onClick={handleCartRegister}>
                            재시도
                        </Button>
                    ) : null
                }
            >
                <div className="rfid-registration-modal">
                    {isRegistering ? (
                        <>
                            <div className="loading-spinner"></div>
                            <p>RFID 카트 등록 중입니다...</p>
                            <p>카드를 리더기에 태그해주세요.</p>
                            <p className="timeout-notice">
                                30초 이내에 카드를 태그해주세요.
                            </p>
                        </>
                    ) : registrationError ? (
                        <div className="error-message">
                            <p>{registrationError}</p>
                            <p>카트 등록을 다시 시도해주세요.</p>
                        </div>
                    ) : null}
                </div>
            </ModalFrame>
        </div>
    );
};