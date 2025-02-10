// TodayWorkSection.jsx
import React from 'react';
import './TodayWorkList.scss';

// 더미 데이터
const DUMMY_WORKS = [
  {
    id: 1,
    title: "엔진 점검 및 정비",
    manualUrl: "/manuals/engine-maintenance.pdf"
  },
  {
    id: 2,
    title: "작동 상태 정비",
    manualUrl: "/manuals/operation-maintenance.pdf"
  }
];

const TodayWorkList = () => {
  const handleManualClick = (url) => {
    // PDF 열기 로직 구현
    window.open(url, '_blank');
  };

  return (
    <div className="today-work-section">
      <h2 className="section-title">오늘의 작업</h2>
      <div className="work-list">
        {DUMMY_WORKS.map((work) => (
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