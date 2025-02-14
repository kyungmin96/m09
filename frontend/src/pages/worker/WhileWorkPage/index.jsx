import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './styles.scss';

const getStatusEmoji = (taskState) => {
  switch(taskState) {
    case 'COMPLETE':
      return '⭕';
    case 'IN_PROGRESS':
      return '⏳';
    case 'START':
      return '';
    default:
      return '';
  }
};

const getTaskState = (koreanStatus) => {
  switch(koreanStatus) {
    case '작업완료':
      return 'COMPLETE';
    case '작업중':
      return 'IN_PROGRESS';
    case '작업전':
      return 'START';
    default:
      return 'START';
  }
};

export const WorkProgressPage = () => {
  const navigate = useNavigate();
  const [tasks, setTasks] = useState([]);
  const [selectedTask, setSelectedTask] = useState(null);
  const [workStatus, setWorkStatus] = useState('START');
  const [specialNote, setSpecialNote] = useState('');
  const [specialNotes, setSpecialNotes] = useState([]);

  useEffect(() => {
    // selectedTasks에서 작업 정보 가져오기
    const savedTasks = localStorage.getItem('selectedTasks');
    const storedNotes = localStorage.getItem('specialNotes');
    const dailyWorkStatus = localStorage.getItem('dailyWorkStatus');
    
    if (savedTasks) {
      const parsedTasks = JSON.parse(savedTasks);
      // 기존 taskState 유지하면서 추가 정보 병합
      const tasksWithStatus = parsedTasks.map(task => ({
        id: task.id,
        title: task.title,
        content: task.content,
        comment: task.comment,
        location: task.location,
        taskState: task.taskState || 'START',
        assignedUser: task.assignedUser,
        scheduledStartTime: task.scheduledStartTime,
        scheduledEndTime: task.scheduledEndTime
      }));

      // 이전에 저장된 작업 상태가 있다면 복원
      if (dailyWorkStatus) {
        const savedStatus = JSON.parse(dailyWorkStatus);
        tasksWithStatus.forEach(task => {
          const savedTaskStatus = savedStatus.find(s => s.id === task.id);
          if (savedTaskStatus) {
            task.taskState = savedTaskStatus.taskState;
          }
        });
      }

      setTasks(tasksWithStatus);
      setSelectedTask(tasksWithStatus[0]);
      setWorkStatus(tasksWithStatus[0]?.taskState || 'START');
    }

    if (storedNotes) {
      setSpecialNotes(JSON.parse(storedNotes));
    }
  }, []);

  const handleTaskClick = (task) => {
    setSelectedTask(task);
    setWorkStatus(task.taskState);
  };

  const handleStatusChange = (koreanStatus) => {
    if (!selectedTask) return;
    
    const newTaskState = getTaskState(koreanStatus);
    const updatedTasks = tasks.map(task => {
      if (task.id === selectedTask.id) {
        return { 
          ...task, 
          taskState: newTaskState,
          updatedAt: new Date().toISOString()
        };
      }
      return task;
    });

    setTasks(updatedTasks);
    setWorkStatus(newTaskState);
    setSelectedTask({ ...selectedTask, taskState: newTaskState });

    // 작업 상태 저장
    const statusToSave = updatedTasks.map(({ id, taskState }) => ({ id, taskState }));
    localStorage.setItem('dailyWorkStatus', JSON.stringify(statusToSave));
    localStorage.setItem('selectedTasks', JSON.stringify(updatedTasks));
  };

  const handleSpecialNoteSubmit = () => {
    if (!specialNote.trim()) return;

    const newNote = {
      id: Date.now(),
      taskId: selectedTask.id,
      content: specialNote,
      timestamp: new Date().toISOString()
    };

    const updatedNotes = [...specialNotes, newNote];
    setSpecialNotes(updatedNotes);
    setSpecialNote('');
    localStorage.setItem('specialNotes', JSON.stringify(updatedNotes));
  };

  const handleDeleteNote = (noteId) => {
    const updatedNotes = specialNotes.filter(note => note.id !== noteId);
    setSpecialNotes(updatedNotes);
    localStorage.setItem('specialNotes', JSON.stringify(updatedNotes));
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
        {tasks.map((task) => (
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
          <div className="status-buttons">
            <button
              className={`status-button ${workStatus === 'START' ? 'active' : ''}`}
              onClick={() => handleStatusChange('작업전')}
            >
              작업 전
            </button>
            <button
              className={`status-button ${workStatus === 'IN_PROGRESS' ? 'active' : ''}`}
              onClick={() => handleStatusChange('작업중')}
            >
              작업중
            </button>
            <button
              className={`status-button ${workStatus === 'COMPLETE' ? 'active' : ''}`}
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
            {specialNotes
              .filter((note) => note.taskId === selectedTask.id)
              .map((note) => (
                <div key={note.id} className="note-item">
                  <div className="note-content">
                    <p>{note.content}</p>
                    <span>{new Date(note.timestamp).toLocaleString()}</span>
                  </div>
                  <button 
                    className="delete-button"
                    onClick={() => handleDeleteNote(note.id)}
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