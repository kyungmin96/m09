import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/shared/ui/Button/Button';
import { ModalFrame } from '@/shared/ui/ModalWorker/ModalFrame';
import './TaskAssignment.scss';

// 더미 데이터를 API 응답 형식에 맞게 수정
const DUMMY_TASKS = [
  {
    id: 1,
    title: 'F100-FW-229 엔진 저압 압축기 블레이드 균열 검사',
    content: '엔진 점검 및 진단 수행',
    comment: '최근 작품 시 경고등 점등 이력 있음',
    location: 'T.O. 1F-16CJ-2-70JG-00-1',
    vehicle: null,
    scheduledStartTime: '2025-01-24T09:00:00',
    scheduledEndTime: '2025-01-24T17:00:00',
    startTime: null,
    endTime: null,
    taskState: 'START',
    createdAt: '2025-01-23T16:15:00.037435',
    updatedAt: null,
    assignedUser: null
  },
  {
    id: 2,
    title: 'APU 배기 덕트 부식 검사',
    content: 'APU 배기 덕트 검사 및 상태 확인',
    comment: '지난 점검 시 경미한 부식 발견됨',
    location: 'T.O. 1F-16CJ-2-49JG-00-1',
    vehicle: null,
    scheduledStartTime: '2025-01-25T09:00:00',
    scheduledEndTime: '2025-01-25T17:00:00',
    startTime: null,
    endTime: null,
    taskState: 'START',
    createdAt: '2025-01-23T16:15:00.037435',
    updatedAt: null,
    assignedUser: null
  }
];

const DUMMY_WORKERS = [
  {
    id: 1,
    employeeId: '7859885',
    name: 'kbj1',
    position: 'ROLE_MEMBER',
    enabled: true,
    createdAt: '2025-02-11T16:01:20.862905',
    updatedAt: null
  },
  {
    id: 2,
    employeeId: '7859886',
    name: 'kbj2',
    position: 'ROLE_MEMBER',
    enabled: true,
    createdAt: '2025-02-11T16:01:20.862905',
    updatedAt: null
  }
];

export const TaskAssignment = () => {
  const navigate = useNavigate();
  const [availableTasks, setAvailableTasks] = useState(DUMMY_TASKS);
  const [selectedTasks, setSelectedTasks] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentTask, setCurrentTask] = useState(null);
  const [selectedWorkers, setSelectedWorkers] = useState([]);

  useEffect(() => {
    const savedTasks = localStorage.getItem('selectedTasks');
    if (savedTasks) {
      const parsedTasks = JSON.parse(savedTasks);
      setSelectedTasks(parsedTasks);
      setAvailableTasks(prev => 
        prev.filter(task => !parsedTasks.some(selected => selected.id === task.id))
      );
    }
  }, []);

  const handleTaskSelect = (task) => {
    setCurrentTask(task);
    setIsModalOpen(true);
  };

  const handleWorkerSelect = (workerId) => {
    setSelectedWorkers(prev => {
      const isSelected = prev.includes(workerId);
      if (isSelected) {
        return prev.filter(id => id !== workerId);
      }
      return [...prev, workerId];
    });
  };

  const handleModalConfirm = () => {
    if (currentTask && selectedWorkers.length > 0) {
      const assignedUser = DUMMY_WORKERS.find(worker => worker.id === selectedWorkers[0]);
      
      const newTask = {
        ...currentTask,
        assignedUser,
        taskState: 'START',
        updatedAt: new Date().toISOString()
      };

      const updatedTasks = [...selectedTasks, newTask];
      setSelectedTasks(updatedTasks);
      setAvailableTasks(prev => 
        prev.filter(task => task.id !== currentTask.id)
      );
      
      localStorage.setItem('selectedTasks', JSON.stringify(updatedTasks));
      
      setIsModalOpen(false);
      setSelectedWorkers([]);
      setCurrentTask(null);
    }
  };

  const handleNextPage = () => {
    if (selectedTasks.length > 0) {
      navigate('/worker/prepare-toolcheck');
    }
  };

  return (
    <div className="task-assignment">
      <section className="today-tasks">
        <h2>오늘의 작업</h2>
        <div className="task-list">
          {selectedTasks.map(task => (
            <div key={task.id} className="task-item">
              <h3>{task.title}</h3>
              <p>{task.content}</p>
              {task.assignedUser && (
                <div className="worker-tag">
                  {task.assignedUser.name}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      <section className="available-tasks">
        <h2>작업 리스트</h2>
        <div className="task-list">
          {availableTasks.map(task => (
            <div key={task.id} className="task-item">
              <h3>{task.title}</h3>
              <p>{task.content}</p>
              {task.comment && <p className="comment">{task.comment}</p>}
              <Button 
                variant="main"
                onClick={() => handleTaskSelect(task)}
              >
                작업 선택하기
              </Button>
            </div>
          ))}
        </div>
      </section>

      <div className="navigation-buttons">
        <Button
          variant="main"
          size="full"
          onClick={handleNextPage}
          disabled={selectedTasks.length === 0}
        >
          공구 체크리스트로 이동
        </Button>
      </div>

      <ModalFrame
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="작업자 선택"
        footerContent={
          <Button
            variant="main"
            size="full"
            onClick={handleModalConfirm}
            disabled={selectedWorkers.length === 0}
          >
            설정 완료
          </Button>
        }
      >
        <div className="worker-selection">
          {DUMMY_WORKERS.map(worker => (
            <div
              key={worker.id}
              className={`worker-item ${
                selectedWorkers.includes(worker.id) ? 'selected' : ''
              }`}
              onClick={() => handleWorkerSelect(worker.id)}
            >
              {worker.name}
            </div>
          ))}
        </div>
      </ModalFrame>
    </div>
  );
};