import { useEffect } from 'react';
import './Toast.scss';

/**
 * 토스트 알림 컴포넌트
 * @param {Object} props
 * @param {string} props.message - 표시할 메시지
 * @param {Function} props.onClose - 닫힐 때 실행할 콜백
 * @param {number} [props.duration=2000] - 자동으로 닫히는 시간(ms)
 * @param {string} [props.type='info'] - 토스트 타입 (info, success, warning, error)
 */
export const Toast = ({ 
  message, 
  onClose, 
  duration = 2000,
  type = 'info'
}) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);
    
    return () => clearTimeout(timer);
  }, [onClose, duration]);

  return (
    <div className={`toast toast--${type}`}>
      <div className="toast__content">
        <p>{message}</p>
      </div>
    </div>
  );
};

export default Toast;