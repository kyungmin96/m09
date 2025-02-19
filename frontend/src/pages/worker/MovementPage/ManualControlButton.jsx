import { useState } from 'react';
import './ManualControlButton.scss';

export const ManualControlButton = ({ onControl }) => {
  const [isPressed, setIsPressed] = useState(null);
  
  const handleButtonClick = (direction) => {
    // 이전에 누른 버튼과 같은 버튼을 다시 누른 경우는 토글 처리
    if (isPressed === direction) {
      setIsPressed(null);
      onControl('stop');
    } else {
      setIsPressed(direction);
      onControl(direction);
    }
  };

  return (
    <div className="manual-control-container">
      <div className="manual-control-circle">
        <div className="manual-control-directions">
          <button 
            className={`manual-control-button manual-control-button--up ${isPressed === 'forward' ? 'is-pressed' : ''}`}
            onClick={() => handleButtonClick('forward')}
            aria-label="전진"
          >
          </button>
          
          <button 
            className={`manual-control-button manual-control-button--down ${isPressed === 'backward' ? 'is-pressed' : ''}`}
            onClick={() => handleButtonClick('backward')}
            aria-label="후진"
          >
          </button>
          
          <button 
            className={`manual-control-button manual-control-button--left ${isPressed === 'left' ? 'is-pressed' : ''}`}
            onClick={() => handleButtonClick('left')}
            aria-label="좌회전"
          >
          </button>
          
          <button 
            className={`manual-control-button manual-control-button--right ${isPressed === 'right' ? 'is-pressed' : ''}`}
            onClick={() => handleButtonClick('right')}
            aria-label="우회전"
          >
          </button>
        </div>
        
        <div className="manual-control-stop">
          <button 
            className={`manual-control-button manual-control-button--stop ${isPressed === 'stop' ? 'is-pressed' : ''}`}
            onClick={() => handleButtonClick('stop')}
            aria-label="정지"
          >
            <span>정지</span>
          </button>
        </div>
      </div>
    </div>
  );
};