import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ToolCheckSection } from '@/shared/ui/ToolCheck/ToolCheck';
import { Button } from '@/shared/ui/Button/Button';
import { WorkStatusReport } from './components/WorkStatusReport';
import { ConsumablesReport } from './components/ConsumablesReport';
import './styles.scss';

export const WorkCompletePage = () => {
  const navigate = useNavigate();
  const [tools, setTools] = useState([]);

  useEffect(() => {
    const savedTools = localStorage.getItem('todayTools');
    if (savedTools) {
      const parsedTools = JSON.parse(savedTools);
      const toolsWithStatus = parsedTools.map(tool => ({
        ...tool,
        taskState: tool.taskState || 'COMPLETE',
        endTime: tool.endTime || new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }));
      setTools(toolsWithStatus);
    }
  }, []);

  const handleComplete = () => {
    // 작업 완료 시 모든 localStorage 데이터 삭제
    const keysToRemove = [
      'dailyTasks',
      'specialNotes',
      'todayTools',
      'checkedTools',
      'cameraDetectedTools',
      'disabledTools',
      'additionalTools',
      'dailyWorkStatus',
      'selectedTasks'
    ];
    
    keysToRemove.forEach(key => localStorage.removeItem(key));
    navigate('/worker/today-task');
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
          readOnly={true}
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