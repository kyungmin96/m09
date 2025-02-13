// WorkInProgressPage.jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './styles.scss';

const getStatusEmoji = (status) => {
  switch(status) {
    case '작업완료':
      return '⭕';
    case '작업중':
      return '⏳';
    case '작업전':
      return '';
    default:
      return '';
  }
};

const WorkInProgressPage = () => {
  const navigate = useNavigate();
  const [tasks, setTasks] = useState([]);
  const [selectedTask, setSelectedTask] = useState(null);
  const [workStatus, setWorkStatus] = useState('작업전');
  const [specialNote, setSpecialNote] = useState('');
  const [specialNotes, setSpecialNotes] = useState([]);

  useEffect(() => {
    // selectedTasks에서 작업 정보 가져오기
    const savedTasks = localStorage.getItem('selectedTasks');
    const storedNotes = localStorage.getItem('specialNotes');
    const dailyWorkStatus = localStorage.getItem('dailyWorkStatus');
    
    if (savedTasks) {
      const parsedTasks = JSON.parse(savedTasks);
      // 작업 상태 정보 추가
      const tasksWithStatus = parsedTasks.map(task => ({
        id: task.id,
        name: task.name,
        status: '작업전',
        manualUrl: task.manual,
        tools: task.tools,
        notes: task.notes
      }));

      // 이전에 저장된 작업 상태가 있다면 복원
      if (dailyWorkStatus) {
        const savedStatus = JSON.parse(dailyWorkStatus);
        tasksWithStatus.forEach(task => {
          const savedTaskStatus = savedStatus.find(s => s.id === task.id);
          if (savedTaskStatus) {
            task.status = savedTaskStatus.status;
          }
        });
      }

      setTasks(tasksWithStatus);
      setSelectedTask(tasksWithStatus[0]);
      setWorkStatus(tasksWithStatus[0]?.status || '작업전');
    }

    if (storedNotes) {
      setSpecialNotes(JSON.parse(storedNotes));
    }
  }, []);

  const handleTaskClick = (task) => {
    setSelectedTask(task);
    setWorkStatus(task.status);
  };

  const handleStatusChange = (status) => {
    if (!selectedTask) return;
    
    const updatedTasks = tasks.map(task => {
      if (task.id === selectedTask.id) {
        return { ...task, status };
      }
      return task;
    });

    setTasks(updatedTasks);
    setWorkStatus(status);
    setSelectedTask({ ...selectedTask, status });

    // 작업 상태 저장
    const statusToSave = updatedTasks.map(({ id, status }) => ({ id, status }));
    localStorage.setItem('dailyWorkStatus', JSON.stringify(statusToSave));
  };

  const handleSpecialNoteSubmit = () => {
    if (!specialNote.trim()) return;

    const newNote = {
      id: Date.now(),
      taskId: selectedTask.id,
      content: specialNote,
      timestamp: new Date().toLocaleString()
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
    if (selectedTask?.manualUrl) {
      window.open(selectedTask.manualUrl, '_blank');
    }
  };

  const handleReturn = () => {
    navigate('/worker/complete-work');
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
              task.status
            }`}
            onClick={() => handleTaskClick(task)}
          >
            <div className="status-circle">
              {getStatusEmoji(task.status)}
            </div>
            <span className="task-name">{task.name}</span>
          </button>
        ))}
      </div>

      {selectedTask && (
        <div className="task-detail">
          <h2>{selectedTask.name}</h2>
          <div className="status-buttons">
            <button
              className={`status-button ${workStatus === '작업전' ? 'active' : ''}`}
              onClick={() => handleStatusChange('작업전')}
            >
              작업 전
            </button>
            <button
              className={`status-button ${workStatus === '작업중' ? 'active' : ''}`}
              onClick={() => handleStatusChange('작업중')}
            >
              작업중
            </button>
            <button
              className={`status-button ${workStatus === '작업완료' ? 'active' : ''}`}
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
                    <span>{note.timestamp}</span>
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

export default WorkInProgressPage;