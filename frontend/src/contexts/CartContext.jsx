import { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { getCartInfo } from '../pages/worker/MainPage/workers.api';

const CART_STORAGE_KEY = 'cartInfo';
const RFID_TIMEOUT = 30000; // 30초
const MOCK_REGISTRATION_TIME = 5000; // 실제 등록에 걸리는 시간을 시뮬레이션 (5초)

// 카트 정보 Mock Data 생성 함수
const generateMockCartData = () => ({
    name: `카트-${Math.floor(Math.random() * 900) + 100}`,
    hasBattery: true, // 배터리 유무
    isConnected: true, // 연결 상태
});

const CartContext = createContext();

export const CartProvider = ({ children }) => {
    const { user } = useAuth();
    const [cartInfo, setCartInfo] = useState(() => {
        const storedCart = localStorage.getItem(CART_STORAGE_KEY);
        return storedCart ? JSON.parse(storedCart) : null;
    });
    const [isRegistering, setIsRegistering] = useState(false);
    const [registrationError, setRegistrationError] = useState(null);

    useEffect(() => {
        if (cartInfo) {
            localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartInfo));
        } else {
            localStorage.removeItem(CART_STORAGE_KEY);
        }
    }, [cartInfo]);

    const mockRfidRegistration = () => {
        return new Promise((resolve, reject) => {
            // 80%의 확률로 성공, 20%의 확률로 실패
            const willSucceed = Math.random() < 0.8;

            setTimeout(() => {
                if (willSucceed) {
                    resolve(generateMockCartData());
                } else {
                    reject(new Error('RFID 카드 인식에 실패했습니다.'));
                }
            }, MOCK_REGISTRATION_TIME);
        });
    };

    const startRfidRegistration = async () => {
        // if (!user) return;
        
        setIsRegistering(true);
        setRegistrationError(null);

        try {
            // Mock: RFID 등록 프로세스 시뮬레이션
            // const cartData = await mockRfidRegistration();
            const cartData = await getCartInfo();
            console.log('카트 정보:', cartData);
            
            setCartInfo(cartData);
            return cartData;
        } catch (error) {
            setRegistrationError(error.message);
            throw error;
        } finally {
            setIsRegistering(false);
        }
    };

    const clearCartInfo = () => {
        setCartInfo(null);
        localStorage.removeItem(CART_STORAGE_KEY);
    };

    // 연결 상태 랜덤 변경 시뮬레이션 (선택적)
    useEffect(() => {
        if (cartInfo) {
            const interval = setInterval(() => {
                // 5%의 확률로 연결 상태 변경
                if (Math.random() < 0.05) {
                    setCartInfo(prev => ({
                        ...prev,
                        isConnected: !prev.isConnected
                    }));
                }
            }, 10000); // 10초마다 체크

            return () => clearInterval(interval);
        }
    }, [cartInfo]);

    return (
        <CartContext.Provider value={{
            cartInfo,
            isRegistering,
            registrationError,
            startRfidRegistration,
            clearCartInfo,
            setCartInfo,
        }}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
};