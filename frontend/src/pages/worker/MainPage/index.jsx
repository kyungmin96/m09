import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useWorks } from '@/contexts/WorksContext';
import { useCart } from '@/contexts/CartContext';
import { ModalFrame } from '@/shared/ui/ModalWorker/ModalFrame';
import { Button } from '@/shared/ui/Button/Button';
import './styles.scss';
import cartEmptyImage from '@/shared/assets/images/cart-empty.png';
import cartHasImage from '@/shared/assets/images/cart-origin.png'
import { getCartInfo, getTodayWorks } from './workers.api';
import { Header } from '@/shared/ui/Header/Header';


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
    const { todayWorks, selectedWorks, updateTodayWorks, isAllocated, allocateCompanions, prepareWorkersAllocation, resetAllocation } = useWorks();
    const {
        cartInfo,
        isRegistering,
        registrationError,
        startRfidRegistration,
        cancelRfidRegistration,
        setCartInfo,
    } = useCart();

    const [isLoading, setIsLoading] = useState(false);
    const [isRfidModalOpen, setIsRfidModalOpen] = useState(false);
    const [currentDate] = useState(new Date());

    // Mock: 오늘의 작업 목록 조회
    const fetchTodayWorks = async () => {
        try {
            const response = await getTodayWorks();
            // console.log('API 응답 데이터: ', response);

            if (response && response.data) {
                updateTodayWorks(response.data);
            }
            // await simulateApiDelay();
            // 이미 WorksContext에서 기본 작업 목록을 제공하므로 
            // 추가 Mock 데이터 생성 없이 진행
        } catch (error) {
            console.error('Failed to fetch today works:', error);
        }
    };

    // 카트 정보 조회
    const fetchCartInfo = async () => {
        try {
            const response = await getCartInfo();
            if (response && response.success && response.data && response.data.length > 0) {
                // API 응답 구조에 맞게 카트 정보 변환
                const cartData = {
                    id: response.data[0].id,
                    name: response.data[0].name,
                    location: response.data[0].location,
                    hasBattery: true,  // 적절한 필드가 있으면 해당 값으로 대체
                    isConnected: true,  // 적절한 필드가 있으면 해당 값으로 대체
                };
                setCartInfo(cartData);
            }
        } catch (error) {
            console.error('Failed to fetch cart info:', error);
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
    }, [user]);

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
        try {
            setIsLoading(true);

            if (!isAllocated) {
                const workersAllocation = prepareWorkersAllocation();
                await allocateCompanions(workersAllocation);
            }

            // 작업 시작 처리
            await startWorkAndFetchTools(selectedWorks.map(work => work.id));

            // 작업 시작 후 allocation 상태 초기화
            resetAllocation();

            // 공구 준비 페이지로 이동
            navigate('/worker/prepare-tool');
        } catch (error) {
            console.error('Failed to start work:', error);
        } finally {
            setIsLoading(false);
        }
    };

    // 모달 닫기 핸들러
    const handleModalClose = () => {
        if (isRegistering) {
            // 등록 중인 경우 취소 함수 호출
            cancelRfidRegistration();
        }
        setIsRfidModalOpen(false);
    };

    return (
        <div className="main-page">
            <Header isMainPage={true} pageName="메인페이지"/>
            <main className="main-content">
                <section className="cart-section">
                    <h1>안녕하세요, {user?.name}님</h1>
                    <div className="cart-content">
                        {!cartInfo ? (
                            <div className="cart-registration">
                                <div className="cart-empty">
                                    <p className="cart-empty-notion">카트 정보 없음</p>
                                    <div className="cart-image">
                                        <img src={cartEmptyImage} alt="빈 카트" />
                                        <div className="cart-icon">
                                            <span>+</span>
                                        </div>
                                    </div>
                                </div>
                                <Button
                                    variant="main" // 또는 적절한 variant
                                    size="full"
                                    className="register-button"
                                    onClick={handleCartRegister}
                                    disabled={isRegistering}
                                >
                                    {isRegistering ? '등록 중...' : '카트 등록'}
                                </Button>
                            </div>
                        ) : (
                            <div className="cart-info">
                                <div className="cart-status">
                                    <span className="cart-name">{cartInfo.name}</span>
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
                                <div className="cart-image">
                                    <img src={cartHasImage} alt="카트 있음" />
                                </div>
                            </div>
                        )}
                    </div>
                </section>
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
                    <Button
                        variant="main"
                        size="full"
                        className="work-setting-button"
                        onClick={handleWorkSettingClick}
                    >
                        오늘의 작업 설정하기
                    </Button>
                    <Button
                        variant="main"
                        size="full"
                        className="start-work-button"
                        onClick={handleStartWorkClick}
                        disabled={!cartInfo || selectedWorks.length === 0 || isLoading}
                    >
                        {isLoading ? '작업 시작 처리 중...' : '작업하러 가기'}
                    </Button>
                </div>
            </main>

            <ModalFrame
                isOpen={isRfidModalOpen}
                onClose={handleModalClose}
                title="카트 등록"
                footerContent={
                    registrationError ? (
                        <Button
                        size="full"
                        onClick={handleCartRegister}>
                            재시도
                        </Button>
                    ) : null
                }
            >
                <div className="rfid-registration-modal">
                    {isRegistering ? (
                        <>
                            <div className="loading-spinner"></div>
                            <p className="loading-info">RFID 카트 등록 중입니다...</p>
                            <p className="loading-info">카드를 리더기에 태그해주세요.</p>
                            <p className="loading-info">
                                30초 이내에 카드를 태그해주세요.
                            </p>
                        </>
                    ) : registrationError ? (
                        <div className="error-message">
                            <p className="loading-info">{registrationError}</p>
                            <p className="loading-info">카트 등록을 다시 시도해주세요.</p>
                        </div>
                    ) : null}
                </div>
            </ModalFrame>
        </div>
    );
};