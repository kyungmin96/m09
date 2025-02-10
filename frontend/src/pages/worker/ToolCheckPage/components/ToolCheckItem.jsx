import React from 'react';
import './ToolCheckItem.scss';

const ToolCheckItem = ({ 
  tool, 
  isDefault,
  isChecked, 
  isCameraDetected,
  isDisabled,
  onCheckChange,
  onDisable
}) => {
  const handleActionClick = (e) => {
    e.stopPropagation(); // 버튼 클릭이 상위로 전파되지 않도록 방지
    onDisable();
  };

  const handleCheckChange = (e) => {
    e.stopPropagation(); // 체크박스 클릭이 상위로 전파되지 않도록 방지
    if (!isDisabled || isDefault) {
      onCheckChange();
    }
  };

  return (
    <div 
      className={`tool-check-item ${isDefault ? 'default' : 'additional'} ${isDisabled ? 'disabled' : ''}`}
      style={{ opacity: isDisabled ? 0.6 : 1 }}
    >
      <div className="tool-info">
        <label className="checkbox-container" onClick={e => e.stopPropagation()}>
          <input
            type="checkbox"
            checked={isChecked}
            onChange={handleCheckChange}
            disabled={isDisabled && !isDefault}
          />
          <span className="checkmark"></span>
        </label>
        <span className="tool-name">{tool.name}</span>
        {!isDefault && <span className="new-badge">NEW</span>}
        {isCameraDetected && (
          <span className="camera-badge">
            <i className="camera-icon">📷</i>
          </span>
        )}
        <button 
          className={`action-button ${isDefault ? 'toggle-button' : 'delete-button'}`}
          onClick={handleActionClick}
        >
          {isDefault ? (isDisabled ? '활성화' : '비활성화') : '삭제'}
        </button>
      </div>
      <div className="work-badges">
        {tool.works.map((work) => (
          <span key={work.id} className="work-badge">
            {work.name}
          </span>
        ))}
      </div>
    </div>
  );
};

export default ToolCheckItem;