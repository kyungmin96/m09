import React from 'react';
import './ToolCheckItem.scss';

const ToolCheckItem = ({ 
  tool, 
  isDefault,
  isChecked, 
  isCameraDetected,
  isDisabled,
  onCheckChange,
  onDisable,
  isReturnPage = false  // 반납 페이지 여부
}) => {
  const handleActionClick = (e) => {
    e.stopPropagation();
    onDisable();
  };

  const handleCheckChange = (e) => {
    e.stopPropagation();
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
        {!isDefault && !isReturnPage && <span className="new-badge">NEW</span>}
        {isCameraDetected && !isReturnPage && (
          <span className="camera-badge">
            <i className="camera-icon">📷</i>
          </span>
        )}
        {!isReturnPage && (
          <button 
            className={`action-button ${isDefault ? 'toggle-button' : 'delete-button'}`}
            onClick={handleActionClick}
          >
            {isDefault ? (isDisabled ? '활성화' : '비활성화') : '삭제'}
          </button>
        )}
      </div>
      {!isReturnPage && (
        <div className="work-badges">
          {tool.works.map((work) => (
            <span key={work.id} className="work-badge">
              {work.name}
            </span>
          ))}
        </div>
      )}
    </div>
  );
};

export default ToolCheckItem;