import React, { useEffect, useState } from 'react';
import './TodayWorkList.scss';

export const TodayWorkList = () => {
  const [works, setWorks] = useState([]);

  useEffect(() => {
    const savedTasks = localStorage.getItem('selectedTasks');
    if (savedTasks) {
      const parsedTasks = JSON.parse(savedTasks);
      setWorks(parsedTasks);
    }
  }, []);

  const truncateText = (text, maxLength = 30) => {
    return text.length > maxLength ? `${text.substring(0, maxLength)}...` : text;
  };

  const handleManualClick = (location) => {
    if (!location) {
      alert('매뉴얼 정보가 없습니다.');
      return;
    }
    // T.O. 문서 위치를 기반으로 URL 생성
    // 실제 환경에서는 baseUrl을 환경 변수나 설정 파일에서 가져와야 합니다
    const baseUrl = '/technical-orders/';
    const url = `${baseUrl}${encodeURIComponent(location)}.pdf`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="today-work-section">
      <h2 className="section-title">오늘의 작업</h2>
      <div className="work-list">
        {works.map((work) => (
          <div key={work.id} className="work-item">
            <span className="work-title" title={work.title}>
              {truncateText(work.title)}
            </span>
            <button 
              className="manual-button"
              onClick={() => handleManualClick(work.location)}
              disabled={!work.location}
            >
              매뉴얼 보기
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};