import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useWorks } from '@/contexts/WorksContext';
import { Header } from '@/shared/ui/Header/Header';
import { Button } from '@/shared/ui/Button/Button';
import { ModalFrame } from '@/shared/ui/ModalWorker/ModalFrame';
import './TaskAssignment.scss';
import { getAllWorkers } from './workers.api';

// 임시 전체 작업자 데이터
// const DUMMY_ALL_WORKERS = [
//   {
//     id: 1,
//     employeeId: '7859885',
//     name: '김철수',
//     position: 'ROLE_MEMBER',
//   },
//   {
//     id: 2,
//     employeeId: '7859886',
//     name: '이영희',
//     position: 'ROLE_MEMBER',
//   },
//   {
//     id: 3,
//     employeeId: '7859887',
//     name: '박지민',
//     position: 'ROLE_MEMBER',
//   },
//   {
//     id: 4,
//     employeeId: '7859888',
//     name: '최민수',
//     position: 'ROLE_MEMBER',
//   }
// ];

export const TaskAssignment = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const {
     todayWorks,
     selectedWorks,
     updateSelectedWorks,
     uniqueTools,
     allocateCompanions,
     prepareWorkersAllocation,
    } = useWorks();
  
  const [availableTasks, setAvailableTasks] = useState([]);
  const [workers, setWorkers] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentTask, setCurrentTask] = useState(null);
  const [selectedWorkers, setSelectedWorkers] = useState([]);

  const fetchAllWorkers = async () => {
    try {
      const workersList = await getAllWorkers();
      console.log('작업자 목록:', workersList);
      setWorkers(workersList);
    } catch (error) {
      console.error('Failed to fetch all workers:', error);
      setWorkers([]); // 에러 시 빈 배열로 초기화
    }
  };

  useEffect(() => {
    // 작업자 목록 가져오기 (실제로는 API 호출)
    fetchAllWorkers();
    // setWorkers(DUMMY_ALL_WORKERS);

    // todayWorks에서 아직 선택되지 않은 작업만 필터링
    const unselectedTasks = todayWorks.filter(
      task => !selectedWorks.some(selected => selected.id === task.id)
    );
    setAvailableTasks(unselectedTasks);
  }, [todayWorks, selectedWorks]);

  const handleTaskSelect = (task) => {
    setCurrentTask(task);
    // 현재 사용자를 기본으로 선택
    setSelectedWorkers(user?.id ? [user.id] : []);
    setIsModalOpen(true);
  };

  const handleWorkerSelect = (workerId) => {
    setSelectedWorkers(prev => {
      const isSelected = prev.includes(workerId);
      if (isSelected) {
        // 이미 선택된 작업자라면 제거
        return prev.filter(id => id !== workerId);
      }
      // 새 작업자 추가
      return [...prev, workerId];
    });
  };

  const handleModalConfirm = () => {
    if (currentTask) {
      // 선택된 작업자들의 정보 가져오기
      const selectedWorkerDetails = workers
        .filter(worker => selectedWorkers.includes(worker.id))
        .map(worker => ({
          id: worker.id,
          name: worker.name,
          employeeId: worker.employeeId
        }));

      const newTask = {
        ...currentTask,
        workers: selectedWorkerDetails,
        isConfigured: true,
        updatedAt: new Date().toISOString(),
        workersSelectedAt: new Date().toISOString()
      };

      // 선택된 작업 목록 업데이트
      const updatedSelectedWorks = [...selectedWorks, newTask];
      updateSelectedWorks(updatedSelectedWorks);

      // 사용 가능한 작업 목록에서 제거
      setAvailableTasks(prev => 
        prev.filter(task => task.id !== currentTask.id)
      );
      
      setIsModalOpen(false);
      setSelectedWorkers([]);
      setCurrentTask(null);
    }
  };

  // 선택된 작업 해제 핸들러
  const handleTaskRemove = (taskToRemove) => {
    // 선택된 작업 목록에서 제거
    const updatedSelectedWorks = selectedWorks.filter(
      task => task.id !== taskToRemove.id
    );
    updateSelectedWorks(updatedSelectedWorks);

    // 사용 가능한 작업 목록에 다시 추가
    setAvailableTasks(prev => [...prev, taskToRemove]);
  };

  const handleConfirmSelection = () => {
    if (selectedWorks.length > 0) {
        navigate('/worker/main');
    }
};

  return (
    <div className="task-assignment">
      <Header isMainPage={false} pageName="오늘의 작업 선택"/>
      <section className="today-tasks">
        <h2>선택된 작업</h2>
        <div className="task-list">
          {selectedWorks.length > 0 ? (
            selectedWorks.map(task => (
              <div key={task.id} className="task-item configured">
                <h3>{task.title}</h3>
                {task.workers && task.workers.length > 0 && (
                  <div className="worker-tags">
                    {task.workers.map((worker, index) => (
                      <span key={index} className="worker-tag">{worker.name}</span>
                    ))}
                  </div>
                )}
                <div className="task-details">
                  <p className="task-info"><strong>위치:</strong> {task.location}</p>
                  <p className="task-info"><strong>내용:</strong> {task.content}</p>
                  <p className="task-info"><strong>납기일:</strong> {task.scheduledEndTime}</p>
                  {task.comment && <p className="task-info"><strong>비고:</strong> {task.comment}</p>}
                </div>
                <Button 
                  variant="secondary"
                  size="full"
                  onClick={() => handleTaskRemove(task)}
                >
                  작업 해제
                </Button>
              </div>
            ))
          ) : (
            <div className="no-tasks">오늘 작업이 없습니다</div>
          )}
        </div>
      </section>

      <section className="available-tasks">
        <h2>작업 리스트</h2>
        {availableTasks.length > 0 ? (
          <div className="task-list">
            {availableTasks.map(task => (
              <div key={task.id} className="task-item">
                <h3>{task.title}</h3>
                <div className="task-details">
                  <p><strong>위치:</strong> {task.location}</p>
                  <p><strong>내용:</strong> {task.content}</p>
                  <p><strong>예정 종료 시간:</strong> {task.scheduledEndTime}</p>
                  {task.comment && <p><strong>비고:</strong> {task.comment}</p>}
                </div>
                <Button 
                  variant="main"
                  size="full"
                  onClick={() => handleTaskSelect(task)}
                >
                  작업 선택하기
                </Button>
              </div>
            ))}
          </div>
        ) : (
          <div className="all-tasks-selected">
            오늘 할당된 작업을 모두 선택하셨습니다
          </div>
        )}
      </section>

      <div className="navigation-buttons">
        <Button
          variant="main"
          size="full"
          onClick={handleConfirmSelection}
          disabled={selectedWorks.length === 0}
        >
          {selectedWorks.length === 0 ? '한 개 이상의 작업을 선택해주세요' : '설정 완료'}
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
          >
            설정 완료
          </Button>
        }
      >
        <div className="worker-selection">
          {Array.isArray(workers) && workers
            .filter(worker => user?.employeeId ? worker.employeeId !== user.employeeId : true)
            .map(worker => (
              <div
                key={worker.id}
                className={`worker-item ${
                  selectedWorkers.includes(worker.id) ? 'selected' : ''
                }`}
                onClick={() => handleWorkerSelect(worker.id)}
              >
                <span className="worker-name">{worker.name}</span>
                <span className="worker-id">({worker.employeeId})</span>
              </div>
            ))}
        </div>
      </ModalFrame>
    </div>
  );
};