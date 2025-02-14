import React, { useState } from 'react';
import { fetchReportByTask, createReportForTask } from '@/features/auth/reports/reports_api'; // API 함수 import

const ReportTaskTestPage = () => {
  const [taskId, setTaskId] = useState('');
  const [reportData, setReportData] = useState(null); // 조회된 리포트 데이터 상태
  const [newReportData, setNewReportData] = useState({}); // 생성할 리포트 데이터 상태
  const [error, setError] = useState(null); // 에러 상태

  // Task와 연결된 Report 조회 핸들러
  const handleFetchReportByTask = async () => {
    try {
      const response = await fetchReportByTask(taskId);
      if (response.success) {
        setReportData(response.data);
        setError(null);
        alert(response.message || `Task ID ${taskId}에 연결된 Report 조회 성공`);
      } else {
        throw new Error(response.message || 'Task와 연결된 Report 조회 실패');
      }
    } catch (err) {
      console.error('Report 조회 실패:', err);
      setError(err.message || 'Task와 연결된 Report 조회 중 오류 발생');
      setReportData(null);
    }
  };

  // Task와 연결된 Report 생성 핸들러
  const handleCreateReportForTask = async () => {
    try {
      const response = await createReportForTask(taskId, newReportData);
      if (response.success) {
        setReportData(response.data);
        setError(null);
        alert(response.message || `Task ID ${taskId}에 대한 Report 생성 성공`);
      } else {
        throw new Error(response.message || 'Task와 연결된 Report 생성 실패');
      }
    } catch (err) {
      console.error('Report 생성 실패:', err);
      setError(err.message || 'Task와 연결된 Report 생성 중 오류 발생');
    }
  };

  return (
    <div className="report-task-test-page">
      <h1>Task와 연결된 Report 테스트 페이지</h1>
      
      {/* Task ID 입력 */}
      <input
        type="text"
        placeholder="Task ID 입력"
        value={taskId}
        onChange={(e) => setTaskId(e.target.value)}
      />

      {/* 조회 버튼 */}
      <button onClick={handleFetchReportByTask}>조회</button>

      {/* 생성 폼 */}
      <div>
        <h2>리포트 생성</h2>
        <textarea
          placeholder="생성할 데이터(JSON 형식)"
          value={JSON.stringify(newReportData)}
          onChange={(e) => setNewReportData(JSON.parse(e.target.value))}
        />
        <button onClick={handleCreateReportForTask}>생성</button>
      </div>

      {/* 결과 표시 */}
      {reportData && (
        <div className="report-data">
          <h2>조회/생성된 리포트:</h2>
          <pre>{JSON.stringify(reportData, null, 2)}</pre>
        </div>
      )}

      {/* 에러 메시지 */}
      {error && <div className="error-message">{error}</div>}
    </div>
  );
};

export default ReportTaskTestPage;
