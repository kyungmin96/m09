import { useState, useEffect } from 'react';
import './WorkStatusReport.scss';

const getStatusText = (taskState) => {
  switch(taskState) {
    case 'COMPLETE':
      return '작업완료';
    case 'IN_PROGRESS':
      return '작업중';
    case 'START':
      return '작업전';
    default:
      return '작업전';
  }
};

export const WorkStatusReport = () => {
  const [workNotes, setWorkNotes] = useState([]);
  const [taskStatuses, setTaskStatuses] = useState([]);

  useEffect(() => {
    const storedNotes = JSON.parse(localStorage.getItem('specialNotes') || '[]');
    const storedTasks = JSON.parse(localStorage.getItem('selectedTasks') || '[]');
    
    setWorkNotes(storedNotes);
    setTaskStatuses(storedTasks.map(task => ({
      id: task.id,
      title: task.title,
      taskState: task.taskState || 'START'
    })));
  }, []);

  return (
    <div className="work-status-report">
      <h2>작업 상태 보고</h2>
      <div className="status-summary">
        {taskStatuses.map(task => (
          <div key={task.id} className="status-item">
            <span className="task-name">{task.title}</span>
            <span className={`status-badge ${task.taskState.toLowerCase()}`}>
              {getStatusText(task.taskState)}
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
                  {taskStatuses.find(t => t.id === note.taskId)?.title}
                </span>
                <span className="timestamp">
                  {new Date(note.timestamp).toLocaleString()}
                </span>
              </div>
              <p className="note-content">{note.content}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
