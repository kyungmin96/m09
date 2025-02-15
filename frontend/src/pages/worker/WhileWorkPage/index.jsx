import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useWorks, WORK_STATUS } from '@/contexts/WorksContext';
import './styles.scss';

const getStatusEmoji = (taskState) => {
  switch(taskState) {
    case WORK_STATUS.COMPLETED:
      return '⭕';
    case WORK_STATUS.IN_PROGRESS:
      return '⏳';
    case WORK_STATUS.READY:
      return '';
    default:
      return '';
  }
};

const getTaskState = (koreanStatus) => {
  switch(koreanStatus) {
    case '작업완료':
      return WORK_STATUS.COMPLETED;
    case '작업중':
      return WORK_STATUS.IN_PROGRESS;
    case '작업전':
      return WORK_STATUS.READY;
    default:
      return WORK_STATUS.READY;
  }
};

export const WorkProgressPage = () => {
  const navigate = useNavigate();
  const { selectedWorks, updateSelectedWorks, addSpecialNote, deleteSpecialNote } = useWorks();
  const [selectedTask, setSelectedTask] = useState(null);
  const [workStatus, setWorkStatus] = useState(WORK_STATUS.READY);
  const [specialNote, setSpecialNote] = useState('');

  useEffect(() => {
    if (selectedWorks.length > 0) {
      setSelectedTask(selectedWorks[0]);
      setWorkStatus(selectedWorks[0]?.taskState || WORK_STATUS.READY);
    }
  }, [selectedWorks]);

  const handleTaskClick = (task) => {
    setSelectedTask(task);
    setWorkStatus(task.taskState);
  };

  const handleStatusChange = (koreanStatus) => {
    if (!selectedTask) return;
    
    const newTaskState = getTaskState(koreanStatus);
    const updatedWorks = selectedWorks.map(work => {
      if (work.id === selectedTask.id) {
        return { 
          ...work, 
          taskState: newTaskState,
          updatedAt: new Date().toISOString()
        };
      }
      return work;
    });

    updateSelectedWorks(updatedWorks);
    setWorkStatus(newTaskState);
    setSelectedTask({ ...selectedTask, taskState: newTaskState });
  };

  const handleSpecialNoteSubmit = () => {
    if (!specialNote.trim() || !selectedTask) return;
    
    addSpecialNote(selectedTask.id, specialNote);
    setSpecialNote('');
  };

  const handleManualView = () => {
    if (selectedTask?.location) {
      window.open(`/technical-orders/${selectedTask.location}.pdf`, '_blank');
    }
  };

  const handleReturn = () => {
    navigate('/worker/return-move');
  };

  return (
    <div className="work-progress-page">
      <header className="header">
        <button className="back-button">←</button>
        <h1>작업 중</h1>
        <button className="menu-button">≡</button>
      </header>

      <div className="task-menu-bar">
        {selectedWorks.map((task) => (
          <button
            key={task.id}
            className={`task-button ${selectedTask?.id === task.id ? 'active' : ''} ${
              task.taskState
            }`}
            onClick={() => handleTaskClick(task)}
          >
            <div className="status-circle">
              {getStatusEmoji(task.taskState)}
            </div>
            <span className="task-name">{task.title}</span>
          </button>
        ))}
      </div>

      {selectedTask && (
        <div className="task-detail">
          <h2>{selectedTask.title}</h2>
          <div className="task-info">
            <p>{selectedTask.content}</p>
            {selectedTask.comment && (
              <p className="comment">참고사항: {selectedTask.comment}</p>
            )}
          </div>

          <div className="status-buttons">
            <button
              className={`status-button ${workStatus === WORK_STATUS.READY ? 'active' : ''}`}
              onClick={() => handleStatusChange('작업전')}
            >
              작업 전
            </button>
            <button
              className={`status-button ${workStatus === WORK_STATUS.IN_PROGRESS ? 'active' : ''}`}
              onClick={() => handleStatusChange('작업중')}
            >
              작업중
            </button>
            <button
              className={`status-button ${workStatus === WORK_STATUS.COMPLETED ? 'active' : ''}`}
              onClick={() => handleStatusChange('작업완료')}
            >
              작업완료
            </button>
          </div>

          <div className="special-note">
            <textarea
              value={specialNote}
              onChange={(e) => setSpecialNote(e.target.value)}
              placeholder="보고할 사항을 입력하세요."
            />
            <button onClick={handleSpecialNoteSubmit}>전송</button>
          </div>

          <button className="manual-button" onClick={handleManualView}>
            작업 메뉴얼 보기
          </button>

          <div className="special-notes-list">
            {selectedTask.specialNotes?.map((note) => (
              <div key={note.id} className="note-item">
                <div className="note-content">
                  <p>{note.content}</p>
                  <span>{new Date(note.timestamp).toLocaleString()}</span>
                </div>
                <button 
                  className="delete-button"
                  onClick={() => deleteSpecialNote(selectedTask.id, note.id)}
                  aria-label="삭제"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      <button className="return-button" onClick={handleReturn}>
        물류 창고로 복귀
      </button>
    </div>
  );
};