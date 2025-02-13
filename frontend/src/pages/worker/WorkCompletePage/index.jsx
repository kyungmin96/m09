import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ToolCheckSection from '@/shared/ui/ToolCheck/ToolCheck';
import Button from '@/shared/ui/Button/Button';
import WorkStatusReport from './components/WorkStatusReport';
import ConsumablesReport from './components/ConsumablesReport';
import './styles.scss';

const WorkCompletePage = () => {
  const navigate = useNavigate();
  const [tools, setTools] = useState([]);

  useEffect(() => {
    // todayTools에서 도구 목록 로드
    const savedTools = localStorage.getItem('todayTools');
    if (savedTools) {
      const parsedTools = JSON.parse(savedTools);
      setTools(parsedTools);
    }
  }, []);

  const handleComplete = () => {
    // 작업 완료 처리
    localStorage.removeItem('dailyTasks');
    localStorage.removeItem('specialNotes');
    localStorage.removeItem('todayTools');
    localStorage.removeItem('checkedTools');
    localStorage.removeItem('cameraDetectedTools');
    localStorage.removeItem('disabledTools');
    localStorage.removeItem('additionalTools');
    localStorage.removeItem('dailyWorkStatus');
    localStorage.removeItem('selectedTasks');
    navigate('/worker/main');
  };

  return (
    <div className="work-complete-page">
      <header className="header">
        <h1>작업 종료</h1>
      </header>
      
      <div className="content">
        <ToolCheckSection
          tools={tools}
          isReturnPage={true}
          hideAddButton={true}
          hideDeleteButton={true}
          hideDisableButton={true}
          hideNewBadge={true}
        />
        
        <WorkStatusReport />
        <ConsumablesReport />
      </div>
      <div className="button-wrapper">
        <Button
          variant="main"
          size="full"
          onClick={handleComplete}
        >
          작업 종료
        </Button>
      </div>
    </div>
  );
};

export default WorkCompletePage;