import React, { useState } from 'react';
import { 
  manualDriveForward, 
  manualDriveBackward, 
  manualDriveLeft, 
  manualDriveRight,
  manualDriveStop  
} from '@/features/auth/embedded/embedded_api'; // API 함수 import


const ManualDriveTestPage = () => {
    const [responseMessage, setResponseMessage] = useState(null); // 응답 메시지 상태
    const [error, setError] = useState(null); // 에러 상태
  
    const handleManualDrive = async (direction) => {
      try {
        let response;
        switch (direction) {
          case 'forward':
            response = await manualDriveForward();
            break;
          case 'backward':
            response = await manualDriveBackward();
            break;
          case 'left':
            response = await manualDriveLeft();
            break;
          case 'right':
            response = await manualDriveRight();
            break;
          case 'stop':
            response = await manualDriveStop();
            break;
          default:
            throw new Error('잘못된 방향 요청');
        }
        console.log();
        
        console.log(`수동 주행 ${direction} 요청 성공:`, response);
        setResponseMessage(response); // 성공 응답 저장
        setError(null); // 에러 초기화
        alert(`수동 주행 ${direction} 요청이 성공적으로 처리되었습니다.`);
      } catch (err) {
        console.error(`수동 주행 ${direction} 요청 실패:`, err);
        setError(err.message || `수동 주행 ${direction} 요청 중 오류 발생`);
        setResponseMessage(null); // 응답 초기화
      }
    };
  
    return (
      <div className="manual-drive-test-page">
        <h1>수동 주행 테스트 페이지</h1>
        <div className="manual-drive-buttons">
          <button onClick={() => handleManualDrive('forward')}>전진</button>
          <button onClick={() => handleManualDrive('backward')}>후진</button>
          <button onClick={() => handleManualDrive('left')}>좌회전</button>
          <button onClick={() => handleManualDrive('right')}>우회전</button>
          <button onClick={() => handleManualDrive('stop')}>정지</button>
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
  
  export default ManualDriveTestPage;
