import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '@/shared/ui/Button/Button';
import ModalFrame from '@/shared/ui/ModalWorker/ModalFrame';
import './TaskAssignment.scss';

// 더미 데이터
const DUMMY_TASKS = [
  {
    id: 1,
    name: 'F100-FW-229 엔진 저압 압축기 블레이드 균열 검사',
    details: [
      '엔진 오일 레벨 점검 및 필요 시 보충',
      'FADEC 시스템 진단 수행'
    ],
    deadline: '2025.01.24',
    location: 'T.O. 1F-16CJ-2-70JG-00-1',
    tools: ['내시경 검사 장비', '토크 렌치 세트', '3mm 육각 렌치'],
    manual: 'manual-link-1',
    notes: '최근 작품 시 경고등 점등 이력 있음'
  },
  {
    id: 2,
    name: 'APU 배기 덕트 부식 검사',
    details: [
      'APU 배기 덕트 외부 육안 검사',
      '부식 정도 측정 및 기록',
      '클램프 체결 상태 확인'
    ],
    deadline: '2025.01.25',
    location: 'T.O. 1F-16CJ-2-49JG-00-1',
    tools: ['부식 측정 게이지', '토크 렌치', '디지털 카메라'],
    manual: 'manual-link-2',
    notes: '지난 점검 시 경미한 부식 발견됨'
  },
  {
    id: 3,
    name: '착륙장치 유압 시스템 점검',
    details: [
      '유압 레벨 및 누유 여부 확인',
      '작동 압력 테스트 수행',
      '비상 확장 시스템 점검'
    ],
    deadline: '2025.01.26',
    location: 'T.O. 1F-16CJ-2-32JG-00-1',
    tools: ['유압 게이지', '손전등', '다용도 렌치 세트', '유압유'],
    manual: 'manual-link-3',
    notes: '동절기 특별 점검 항목 포함'
  }
];

const DUMMY_WORKERS = [
  { id: 1, name: '김민호' },
  { id: 2, name: '이상욱' },
  { id: 3, name: '박준영' },
  { id: 4, name: '최지훈' },
  { id: 5, name: '정다은' }
];

export const TaskAssignment = () => {
  const navigate = useNavigate();
  const [availableTasks, setAvailableTasks] = useState(DUMMY_TASKS);
  const [selectedTasks, setSelectedTasks] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentTask, setCurrentTask] = useState(null);
  const [selectedWorkers, setSelectedWorkers] = useState([]);

  useEffect(() => {
    // 로컬 스토리지에서 선택된 작업 불러오기
    const savedTasks = localStorage.getItem('selectedTasks');
    if (savedTasks) {
      const parsedTasks = JSON.parse(savedTasks);
      setSelectedTasks(parsedTasks);
      // 저장된 작업들을 available 리스트에서 제외
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
      const newTask = {
        ...currentTask,
        workers: selectedWorkers.map(id => 
          DUMMY_WORKERS.find(worker => worker.id === id)
        )
      };

      const updatedTasks = [...selectedTasks, newTask];
      setSelectedTasks(updatedTasks);
      
      // 선택된 작업을 가용 작업 목록에서 제거
      setAvailableTasks(prev => 
        prev.filter(task => task.id !== currentTask.id)
      );
      
      // 로컬 스토리지에 저장
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
              <h3>{task.name}</h3>
              <div className="workers">
                {task.workers.map(worker => (
                  <span key={worker.id} className="worker-tag">
                    {worker.name}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="available-tasks">
        <h2>작업 리스트</h2>
        <div className="task-list">
          {availableTasks.map(task => (
            <div key={task.id} className="task-item">
              <h3>{task.name}</h3>
              <div className="task-details">
                {task.details.map((detail, index) => (
                  <p key={index}>{detail}</p>
                ))}
              </div>
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
        title="공동 작업자 선택"
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