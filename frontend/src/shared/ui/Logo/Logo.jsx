import './Logo.scss';
import characterImage from '@/shared/assets/images/service-character.png';

export const Logo = ({ size = 'medium' }) => {
  return (
    <div className={`logo logo--${size}`}>
      <div className="logo__container">
        <h1 className="logo__title">작업 안전 도우미</h1>
        <div className="logo__image">
          <img 
            src={characterImage} 
            alt="Service Character"
            className="logo__character"
          />
        </div>
          <p className="logo__service">M09</p>
      </div>
    </div>
  );
};