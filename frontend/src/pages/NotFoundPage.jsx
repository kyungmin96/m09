import { useNavigate } from 'react-router-dom';
import './NotFoundPage.scss'; // SCSS 파일 임포트

export const NotFoundPage = () => {
  const navigate = useNavigate();
  
  const handleGoToMain = () => {
    navigate('/worker/main');
  };
  
  const handleGoToLogin = () => {
    navigate('/login');
  };
  
  return (
    <div className="not-found-container">
      <div className="not-found-content">
        <h1 className="not-found-title">404</h1>
        <h2 className="not-found-subtitle">페이지를 찾을 수 없습니다</h2>
        <p className="not-found-message">
          요청하신 페이지가 존재하지 않거나 이동되었을 수 있습니다.
        </p>
        <div className="not-found-buttons">
          <button 
            onClick={handleGoToMain}
            className="not-found-button not-found-button--primary"
          >
            메인 페이지로 돌아가기
          </button>
          <button 
            onClick={handleGoToLogin}
            className="not-found-button not-found-button--secondary"
          >
            로그인 페이지로 이동
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;