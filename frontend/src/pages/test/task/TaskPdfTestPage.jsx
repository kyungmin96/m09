import React, { useState } from 'react';
import { fetchTaskPdf } from '@/features/auth/task/task_api'; // API 함수 import

const TaskPdfTestPage = () => {
  const [taskId, setTaskId] = useState('');
  const [error, setError] = useState(null); // 에러 상태

  const handleFetchPdf = async () => {
    try {
      const pdfData = await fetchTaskPdf(taskId); // 작업 PDF 조회 API 호출
      const url = window.URL.createObjectURL(new Blob([pdfData], { type: 'application/pdf' }));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `task_${taskId}.pdf`); // 다운로드 파일 이름 설정
      document.body.appendChild(link);
      link.click();
      link.remove();
      setError(null); // 에러 초기화
      alert(`작업 ID ${taskId}에 대한 PDF가 성공적으로 다운로드되었습니다.`);
    } catch (err) {
      console.error('작업 PDF 조회 실패:', err);
      setError(err.message || '작업 PDF 조회 중 오류 발생');
    }
  };

  return (
    <div className="task-pdf-test-page">
      <h1>작업 PDF 조회 테스트 페이지</h1>
      <input
        type="text"
        placeholder="작업 ID 입력"
        value={taskId}
        onChange={(e) => setTaskId(e.target.value)}
      />
      <button onClick={handleFetchPdf}>PDF 다운로드</button>

      {/* 에러 메시지 */}
      {error && <div className="error-message">{error}</div>}
    </div>
  );
};

export default TaskPdfTestPage;