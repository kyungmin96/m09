import React, { useState } from 'react';
import { startDrive, stopDrive } from '@/features/auth/embedded/embedded_api'; // API 함수 import

const DriveTestPage = () => {
  const [responseMessage, setResponseMessage] = useState(null); // 응답 메시지 상태
  const [error, setError] = useState(null); // 에러 상태

  const handleDriveAction = async (action) => {
    try {
      let response;
      if (action === 'start') {
        response = await startDrive();
      } else if (action === 'stop') {
        response = await stopDrive();
      } else {
        throw new Error('잘못된 액션 요청');
      }
      console.log(`주행 ${action} 요청 성공:`, response);
      setResponseMessage(response); // 성공 응답 저장
      setError(null); // 에러 초기화
      alert(`주행 ${action} 요청이 성공적으로 처리되었습니다.`);
    } catch (err) {
      console.error(`주행 ${action} 요청 실패:`, err);
      setError(err.message || `주행 ${action} 요청 중 오류 발생`);
      setResponseMessage(null); // 응답 초기화
    }
  };

  return (
    <div className="drive-test-page">
      <h1>주행 테스트 페이지</h1>
      <div className="drive-buttons">
        <button onClick={() => handleDriveAction('start')}>주행 시작</button>
        <button onClick={() => handleDriveAction('stop')}>주행 정지</button>
      </div>

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

export default DriveTestPage;
