import React, { useState } from 'react';
import { startHelmetDetection } from '@/features/auth/embedded/embedded_api'; // API 함수 import

const HelmetDetectionTestPage = () => {
  const [responseMessage, setResponseMessage] = useState(null); // 응답 메시지 상태
  const [error, setError] = useState(null); // 에러 상태

  const handleStartDetection = async () => {
    try {
      const response = await startHelmetDetection(); // 헬멧 감지 시작 요청
      console.log('헬멧 감지 요청 성공:', response);
      setResponseMessage(response); // 성공 응답 저장
      setError(null); // 에러 초기화
      alert('헬멧 감지가 성공적으로 시작되었습니다.');
    } catch (err) {
      console.error('헬멧 감지 요청 실패:', err);
      setError(err.message || '헬멧 감지 요청 중 오류가 발생했습니다.');
      setResponseMessage(null); // 응답 초기화
    }
  };

  return (
    <div className="helmet-detection-test-page">
      <h1>헬멧 감지 시작 테스트 페이지</h1>
      <button onClick={handleStartDetection}>헬멧 감지 시작</button>

      {/* 성공 메시지 */}
      {responseMessage && (
        <div className="success-message">
          <h2>응답:</h2>
          <pre>{JSON.stringify(responseMessage, null, 2)}</pre>
        </div>
      )}

      {/* 에러 메시지 */}
      {error && <div className="error-message">{error}</div>}
    </div>
  );
};

export default HelmetDetectionTestPage;
