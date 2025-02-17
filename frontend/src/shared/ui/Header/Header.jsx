import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import './Header.scss';

export const Header = ({ 
  isMainPage = false, 
  pageName = 'M09',
  mode = 'to-workplace' // 기본값을 'to-workplace'로 설정
}) => {
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleBack = () => {
    navigate(-1);
  };

  // 모드에 따른 페이지 제목 설정
  const getPageTitle = () => {
    if (pageName !== 'M09') {
      return pageName; // pageName이 전달된 경우 그대로 사용
    }
    return mode === "to-workplace" ? "작업장 이동" : "물류 창고 이동";
  };

  return (
    <>
      <header className="header">
        <div className="header__left">
          {!isMainPage && (
            <button onClick={handleBack}>
              <svg 
                width="24" 
                height="24" 
                viewBox="0 0 24 24" 
                fill="none" 
                xmlns="http://www.w3.org/2000/svg"
              >
                <path 
                  d="M15 18L9 12L15 6" 
                  stroke="#1A1A1A" 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          )}
        </div>

        <div className="header__center">
          <h1>{getPageTitle()}</h1>
        </div>

        <div className="header__right">
          <button onClick={() => setIsSidebarOpen(true)}>
            <svg 
              width="24" 
              height="24" 
              viewBox="0 0 24 24" 
              fill="none" 
              xmlns="http://www.w3.org/2000/svg"
            >
              <path 
                d="M3 12H21M3 6H21M3 18H21" 
                stroke="#1A1A1A" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>
      </header>

      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
    </>
  );
};

/** 사용 방법
 * import { Header } from '@/shared/ui/Header/Header';
 * <Header isMainPage={true} pageName="홈"/>
 */