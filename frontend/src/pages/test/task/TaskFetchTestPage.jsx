import React, { useState } from 'react';
import { fetchTaskPosts } from '@/features/auth/task/task_api'; // 작업 조회 API 함수 import
// import './TaskFetchTestPage.scss'; // 스타일 파일 (선택)

const TaskFetchTestPage = () => {
  const [tasks, setTasks] = useState([]); // 작업 목록 상태
  const [error, setError] = useState(null); // 에러 상태

  const handleFetchTasks = async () => {
    try {
      const response = await fetchTaskPosts(); // 작업 조회 API 호출
      console.log('작업 조회 성공:', response);
      setTasks(response); // 작업 목록을 상태에 저장
      setError(null); // 에러 초기화
    } catch (err) {
      console.error('작업 조회 실패:', err);
      setError(err.message || '작업 조회 중 오류가 발생했습니다.');
    }
  };

  return (
    <div className="task-fetch-test-page">
      <h1>작업 조회 테스트 페이지</h1>
      <button onClick={handleFetchTasks}>작업 조회</button>

      {/* 에러 메시지 */}
      {error && <div className="error-message">{error}</div>}

      {/* 작업 목록 표시 */}
      {tasks.length > 0 ? (
        <div className="task-list">
          <h2>작업 목록:</h2>
          <ul>
            {tasks.map((task, index) => (
              <li key={index}>
                <strong>제목:</strong> {task.title} | <strong>내용:</strong> {task.content} |{' '}
                <strong>위치:</strong> {task.location} | <strong>직원 ID:</strong> {task.employeeId} |{' '}
                <strong>시작 시간:</strong> {task.scheduledStartTime} |{' '}
                <strong>종료 시간:</strong> {task.scheduledEndTime}
              </li>
            ))}
          </ul>
        </div>
      ) : (
        !error && <p>조회된 작업이 없습니다.</p>
      )}
    </div>
  );
};

export default TaskFetchTestPage;
