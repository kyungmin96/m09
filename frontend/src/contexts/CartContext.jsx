import { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import websocketService from '@/features/websocket/websocketService';
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

  // const mockRfidRegistration = () => {
  //     return new Promise((resolve, reject) => {
  //         // 80%의 확률로 성공, 20%의 확률로 실패
  //         const willSucceed = Math.random() < 0.8;

  //         setTimeout(() => {
  //             if (willSucceed) {
  //                 resolve(generateMockCartData());
  //             } else {
  //                 reject(new Error('RFID 카드 인식에 실패했습니다.'));
  //             }
  //         }, MOCK_REGISTRATION_TIME);
  //     });
  // };

  const startRfidRegistration = async () => {
    setIsRegistering(true);
    setRegistrationError(null);

    try {
      // 웹소켓 연결 및 NFC 인식 시작
      await websocketService.connectWebSocket();

      // NFC 메시지 수신 처리를 위한 Promise 생성
      const nfcDetectionResult = new Promise((resolve, reject) => {
        // 시간 제한 설정
        const timeoutId = setTimeout(() => {
          websocketService.closeConnection();
          reject(new Error('RFID 카드 인식 시간이 초과되었습니다.'));
        }, RFID_TIMEOUT);

        // 메시지 수신 콜백 설정
        websocketService.setOnMessageCallback((data) => {
          if (data === 'ok') {
            clearTimeout(timeoutId);
            resolve('success');
          }
        });

        // 오류 콜백 설정
        websocketService.setOnErrorCallback((error) => {
          clearTimeout(timeoutId);
          reject(new Error(`RFID 카드 인식 중 오류가 발생했습니다: ${error.message}`));
        });

        // 연결 종료 콜백
        websocketService.setOnCloseCallback(() => {
          clearTimeout(timeoutId);
        });
      });

      // NFC 감지 시작
      await websocketService.startNFCDetection();

      // NFC 인식 결과 대기
      await nfcDetectionResult;

      // NFC 인식 성공 후 웹소켓 연결 종료
      websocketService.closeConnection();

      // 인식 성공 후 카트 정보 API 요청
      const response = await getCartInfo();

      // 응답에서 실제 카트 데이터 추출
      if (response && response.success && response.data && response.data.length > 0) {
        const cartData = {
          id: response.data[0].id,
          name: response.data[0].name,
          location: response.data[0].location,
          hasBattery: true, // 기본값 설정 또는 적절한 필드가 있으면 해당 값 사용
          isConnected: true, // 기본값 설정 또는 적절한 필드가 있으면 해당 값 사용
          // 필요한 다른 정보 추가
        };

        setCartInfo(cartData);
        return cartData;
      } else {
        throw new Error('카트 정보를 가져오는데 실패했습니다.');
      }

    } catch (error) {
      websocketService.closeConnection();
      setRegistrationError(error.message);
      throw error;
    } finally {
      setIsRegistering(false);
    }
  };

  const cancelRfidRegistration = () => {
    if (isRegistering) {
      // 웹소켓 연결 종료
      websocketService.closeConnection();
      // 등록 상태 초기화
      setIsRegistering(false);
      // 등록 오류 설정
      setRegistrationError('사용자에 의해 등록이 취소되었습니다.');
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
      cancelRfidRegistration,
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