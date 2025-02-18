import { useState } from 'react';
import './ManualControlButton.scss';

export const ManualControlButton = ({ onControl }) => {
  const [isPressed, setIsPressed] = useState(null);

  const handleButtonPress = (direction) => {
    setIsPressed(direction);
    onControl(direction);
  };

  const handleButtonRelease = () => {
    setIsPressed(null);
    onControl('stop');
  };

  return (
    <div className="manual-control-container">
      <div className="manual-control-circle">
        <div className="manual-control-directions">
          <button 
            className={`manual-control-button manual-control-button--up ${isPressed === 'forward' ? 'is-pressed' : ''}`}
            onMouseDown={() => handleButtonPress('forward')}
            onMouseUp={handleButtonRelease}
            onTouchStart={() => handleButtonPress('forward')}
            onTouchEnd={handleButtonRelease}
          >
          </button>
          <button 
            className={`manual-control-button manual-control-button--down ${isPressed === 'backward' ? 'is-pressed' : ''}`}
            onMouseDown={() => handleButtonPress('backward')}
            onMouseUp={handleButtonRelease}
            onTouchStart={() => handleButtonPress('backward')}
            onTouchEnd={handleButtonRelease}
          >
          </button>
          <button 
            className={`manual-control-button manual-control-button--left ${isPressed === 'left' ? 'is-pressed' : ''}`}
            onMouseDown={() => handleButtonPress('left')}
            onMouseUp={handleButtonRelease}
            onTouchStart={() => handleButtonPress('left')}
            onTouchEnd={handleButtonRelease}
          >
          </button>
          <button 
            className={`manual-control-button manual-control-button--right ${isPressed === 'right' ? 'is-pressed' : ''}`}
            onMouseDown={() => handleButtonPress('right')}
            onMouseUp={handleButtonRelease}
            onTouchStart={() => handleButtonPress('right')}
            onTouchEnd={handleButtonRelease}
          >
          </button>
        </div>
        <div className="manual-control-stop">
          <button 
            className={`manual-control-button manual-control-button--stop ${isPressed === 'stop' ? 'is-pressed' : ''}`}
            onClick={() => handleButtonPress('stop')}
          >
            <span>정지</span>
          </button>
        </div>
      </div>
    </div>
  );
};