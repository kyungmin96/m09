import React from 'react';
import { ModalFrame } from '@/shared/ui/ModalWorker/ModalFrame';
import { ToolSelectionContent } from './AddToolModalContent';

export const Modal = ({ isOpen, onClose, onSubmit }) => {
  return (
    <ModalFrame
      isOpen={isOpen}
      onClose={onClose}
      title="작업 공구 추가"
    >
      <ToolSelectionContent 
        onSubmit={onSubmit}
        onClose={onClose}
      />
    </ModalFrame>
  );
};