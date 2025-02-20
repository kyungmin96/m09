import { useAuth } from '@/contexts/AuthContext';
import { useCart } from '@/contexts/CartContext';
import { useEffect, useState } from 'react';
import LogoutButton from '@/features/auth/ui/LogoutButton';
import './Sidebar.scss';

export const Sidebar = ({ isOpen, onClose }) => {
  const { user } = useAuth();
  const { cartInfo } = useCart();
  const [shouldRender, setShouldRender] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setShouldRender(true);
    } else {
      // 애니메이션이 끝난 후에 컴포넌트를 제거
      const timer = setTimeout(() => {
        setShouldRender(false);
      }, 300); // transition 시간과 동일하게 설정
      
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  if (!shouldRender) return null;


  return (
    <>
      <div 
        className={`sidebar-overlay ${isOpen ? 'sidebar-overlay--visible' : ''}`}
        onClick={onClose}
      />
      <aside className={`sidebar ${isOpen ? 'sidebar--open' : ''}`}>
        <div className="sidebar__header">
          <button className="sidebar__close-btn" onClick={onClose}>
            X
          </button>
        </div>

        <div className="sidebar__user-info">
          <h2 className="sidebar__name">{user?.name || '사용자 없음'}</h2>
          <p className="sidebar__id">사번 : {user?.employeeId || '사번 없음'}</p>
          <p className="sidebar__position">직책 : {user?.position || '직책 없음'}</p>
        </div>

        <div className="sidebar__cart-info">
          <div className="sidebar__cart-header">
            <span className="sidebar__cart-icon">🛒</span>
            <span className="sidebar__cart-name">{cartInfo?.name || '연결된 카트 없음'}</span>
          </div>

          <div className="sidebar__cart-status">
            <div className="status-item">
              <span className="status-label">배터리 상태</span>
              <span className={`status-indicator ${cartInfo?.hasBattery ? 'active' : ''}`}>
                {cartInfo?.hasBattery ? '있음' : '없음'}
              </span>
            </div>
          </div>
        </div>

        <div className="sidebar__actions">
          <LogoutButton />
        </div>
      </aside>
    </>
  );
};