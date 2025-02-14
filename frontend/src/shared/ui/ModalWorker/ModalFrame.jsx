import React from 'react';
import './ModalFrame.scss';

export const ModalFrame = ({ 
  isOpen, 
  onClose, 
  title, 
  children, 
  footerContent 
}) => {
  return (
    <div className={`modal-overlay ${isOpen ? 'visible' : ''}`}>
      <div className={`modal-content ${isOpen ? 'visible' : ''}`}>
        <div className="modal-header">
          <h2>{title}</h2>
          <button className="close-button" onClick={onClose}>×</button>
        </div>

        <div className="modal-body">
          {children}
        </div>

        <div className="modal-footer">
          {footerContent}
        </div>
      </div>
    </div>
  );
};