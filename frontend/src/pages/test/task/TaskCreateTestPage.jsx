import React, { useState } from 'react';
import { createTaskPost } from '@/features/auth/task/task_api'; // 작업 생성 API 함수 import
// import './TaskCreateTestPage.scss'; // 스타일 파일 (선택)

const TaskCreateTestPage = () => {
  const [taskData, setTaskData] = useState({
    title: '',
    content: '',
    location: '',
    employeeId: '',
    scheduledStartTime: '',
    scheduledEndTime: '',
  });

  const [responseData, setResponseData] = useState(null); // 응답 데이터를 저장할 상태

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTaskData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await createTaskPost(taskData); // 작업 생성 API 호출
      console.log('작업 생성 성공:', response);
      setResponseData(response); // 응답 데이터를 상태에 저장
      alert('작업이 성공적으로 생성되었습니다.');
    } catch (error) {
      console.error('작업 생성 실패:', error);
      alert(error.message || '작업 생성 중 오류가 발생했습니다.');
    }
  };

  return (
    <div className="task-create-test-page">
      <h1>작업 생성 테스트 페이지</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="title">작업 제목:</label>
          <input
            type="text"
            id="title"
            name="title"
            value={taskData.title}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label htmlFor="content">작업 내용:</label>
          <textarea
            id="content"
            name="content"
            value={taskData.content}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label htmlFor="location">작업 위치:</label>
          <input
            type="text"
            id="location"
            name="location"
            value={taskData.location}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label htmlFor="employeeId">직원 ID:</label>
          <input
            type="text"
            id="employeeId"
            name="employeeId"
            value={taskData.employeeId}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label htmlFor="scheduledStartTime">시작 시간:</label>
          <input
            type="datetime-local"
            id="scheduledStartTime"
            name="scheduledStartTime"
            value={taskData.scheduledStartTime}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label htmlFor="scheduledEndTime">종료 시간:</label>
          <input
            type="datetime-local"
            id="scheduledEndTime"
            name="scheduledEndTime"
            value={taskData.scheduledEndTime}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit">작업 생성</button>
      </form>

      {/* 응답 데이터 표시 */}
      {responseData && (
        <div className="response-data">
          <h2>응답 데이터:</h2>
          <pre>{JSON.stringify(responseData, null, 2)}</pre>
        </div>
      )}
    </div>
  );
};

export default TaskCreateTestPage;

