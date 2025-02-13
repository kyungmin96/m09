import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/shared/ui/Button/Button';

export const TestMainPage = () => {
  const navigate = useNavigate();
  const [supportsPWA, setSupportsPWA] = useState(true);
  const [promptInstall, setPromptInstall] = useState(null);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    // PWA가 이미 설치되어 있는지 확인
    if (window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone) {
      setIsInstalled(true);
      return;
    }

    const handler = (e) => {
      e.preventDefault();
      setPromptInstall(e);
      setSupportsPWA(true);
    };

    window.addEventListener('beforeinstallprompt', handler);

    // PWA 설치 완료 이벤트 감지
    window.addEventListener('appinstalled', () => {
      setIsInstalled(true);
      setPromptInstall(null);
    });

    return () => {
      window.removeEventListener('beforeinstallprompt', handler);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!promptInstall) {
      alert('이미 설치되어 있거나 설치할 수 없는 환경입니다.');
      return;
    }

    promptInstall.prompt();
    const { outcome } = await promptInstall.userChoice;
    setPromptInstall(null);

    if (outcome === 'accepted') {
      console.log('사용자가 PWA 설치를 수락했습니다.');
      setIsInstalled(true);
    } else {
      console.log('사용자가 PWA 설치를 거절했습니다.');
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>테스트 메인 페이지</h1>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <h2>작업자 영역</h2>
        <Button
          variant="main"
          size="full"
          onClick={() => navigate('/worker/login')}
        >
          작업자 로그인 페이지
        </Button>
        <Button
          variant="main"
          size="full"
          onClick={() => navigate('/worker/prepare-toolcheck')}
        >
          공구 체크 페이지
        </Button>

        <h2>관제탑 영역</h2>
        <Button
          variant="main"
          size="full"
          onClick={() => navigate('/control/login')}
        >
          관제탑 로그인 페이지
        </Button>

        {/* PWA 설치 버튼 - 설치되지 않은 경우에만 표시 */}
        {supportsPWA && !isInstalled && (
          <div style={{ display: 'flex', justifyContent: 'center', marginTop: '1rem' }}>
            <Button
              variant="main"
              size="full"
              onClick={handleInstallClick}
            >
              앱 설치하기
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};