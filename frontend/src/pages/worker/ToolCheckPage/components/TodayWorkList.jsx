import React, { useEffect, useState } from 'react';
import './TodayWorkList.scss';

const TodayWorkList = () => {
  const [works, setWorks] = useState([]);

  useEffect(() => {
    const savedTasks = localStorage.getItem('selectedTasks');
    if (savedTasks) {
      const parsedTasks = JSON.parse(savedTasks);
      // 작업 정보 포맷팅 - workers 제외
      const formattedWorks = parsedTasks.map(task => ({
        id: task.id,
        title: task.name,
        manualUrl: task.manual
      }));
      setWorks(formattedWorks);
    }
  }, []);

  const handleManualClick = (url) => {
    window.open(url, '_blank');
  };

  return (
    <div className="today-work-section">
      <h2 className="section-title">오늘의 작업</h2>
      <div className="work-list">
        {works.map((work) => (
          <div key={work.id} className="work-item">
            <span className="work-title">{work.title}</span>
            <button 
              className="manual-button"
              onClick={() => handleManualClick(work.manualUrl)}
            >
              매뉴얼 보기
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TodayWorkList;