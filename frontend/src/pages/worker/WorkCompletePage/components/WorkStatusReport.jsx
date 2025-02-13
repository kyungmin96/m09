import { useState, useEffect } from 'react';
import './WorkStatusReport.scss';

const WorkStatusReport = () => {
  const [workNotes, setWorkNotes] = useState([]);
  const [taskStatuses, setTaskStatuses] = useState([]);

  useEffect(() => {
    // 로컬 스토리지에서 작업 노트와 작업 상태 로드
    const storedNotes = JSON.parse(localStorage.getItem('specialNotes') || '[]');
    const storedTasks = JSON.parse(localStorage.getItem('dailyTasks') || '[]');
    
    setWorkNotes(storedNotes);
    setTaskStatuses(storedTasks);
  }, []);

  return (
    <div className="work-status-report">
      <h2>작업 상태 보고</h2>
      <div className="status-summary">
        {taskStatuses.map(task => (
          <div key={task.id} className="status-item">
            <span className="task-name">{task.name}</span>
            <span className={`status-badge ${task.status}`}>
              {task.status}
            </span>
          </div>
        ))}
      </div>
      
      <div className="notes-section">
        <h3>작업 특이사항</h3>
        <div className="notes-list">
          {workNotes.map(note => (
            <div key={note.id} className="note-item">
              <div className="note-header">
                <span className="task-name">
                  {taskStatuses.find(t => t.id === note.taskId)?.name}
                </span>
                <span className="timestamp">{note.timestamp}</span>
              </div>
              <p className="note-content">{note.content}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default WorkStatusReport;