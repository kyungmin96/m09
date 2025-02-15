import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useWorks, WORK_STATUS } from '@/contexts/WorksContext';
import { useTools } from '@/contexts/ToolsContext';
import { useCart } from '@/contexts/CartContext';
import './styles.scss';

export const WorkCompletePage = () => {
  const navigate = useNavigate();
  const { selectedWorks, updateSelectedWorks, clearToolsData } = useWorks();
  const { clearToolsData: clearTools } = useTools();
  const { clearCartInfo } = useCart();
  const [finalNotes, setFinalNotes] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    // 작업별 특이사항을 하나의 텍스트로 초기화
    const initialNotes = {};
    selectedWorks.forEach(work => {
      const notesText = work.specialNotes
        ?.map(note => `${new Date(note.timestamp).toLocaleString()}: ${note.content}`)
        .join('\n') || '';
      initialNotes[work.id] = notesText;
    });
    setFinalNotes(initialNotes);
  }, [selectedWorks]);

  const handleNoteChange = (workId, value) => {
    setFinalNotes(prev => ({
      ...prev,
      [workId]: value
    }));
  };

  const handleComplete = async () => {
    setIsSubmitting(true);
    try {
      // 최종 작업 상태 업데이트
      const completedWorks = selectedWorks.map(work => ({
        ...work,
        taskState: WORK_STATUS.COMPLETED,
        finalNote: finalNotes[work.id],
        completedAt: new Date().toISOString()
      }));

      // TODO: API를 통해 서버에 완료된 작업 데이터 전송
      await new Promise(resolve => setTimeout(resolve, 1000)); // Mock API 호출

      // 모든 Context 및 로컬 스토리지 초기화
      updateSelectedWorks([]);
      clearTools();
      clearCartInfo();
      clearToolsData();
      
      // 로컬 스토리지 추가 정리
      localStorage.removeItem('dailyWorkStatus');
      localStorage.removeItem('specialNotes');

      navigate('/worker/complete');
    } catch (error) {
      console.error('Failed to complete works:', error);
      // TODO: 에러 처리
    } finally {
      setIsSubmitting(false);
    }
  };

  const getStatusClass = (status) => {
    switch (status) {
      case WORK_STATUS.COMPLETED:
        return 'status-completed';
      case WORK_STATUS.IN_PROGRESS:
        return 'status-in-progress';
      default:
        return 'status-ready';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case WORK_STATUS.COMPLETED:
        return '완료';
      case WORK_STATUS.IN_PROGRESS:
        return '진행중';
      case WORK_STATUS.READY:
        return '대기';
      default:
        return '대기';
    }
  };

  return (
    <div className="work-complete-page">
      <header className="header">
        <h1>작업 종료</h1>
        <p>작업 내용을 확인하고 종료해주세요.</p>
      </header>

      <div className="work-list">
        {selectedWorks.map(work => (
          <div key={work.id} className="work-card">
            <div className="work-header">
              <h2>{work.title}</h2>
              <span className={`status-badge ${getStatusClass(work.taskState)}`}>
                {getStatusText(work.taskState)}
              </span>
            </div>

            <div className="work-content">
              <p>{work.content}</p>
              {work.comment && (
                <p className="comment">참고사항: {work.comment}</p>
              )}
            </div>

            <div className="notes-section">
              <label>특이사항 및 최종 코멘트</label>
              <textarea
                value={finalNotes[work.id] || ''}
                onChange={(e) => handleNoteChange(work.id, e.target.value)}
                placeholder="특이사항 및 추가 코멘트를 입력하세요"
              />
            </div>
          </div>
        ))}
      </div>

      <div className="button-group">
        <button
          className="back-button"
          onClick={() => navigate(-1)}
          disabled={isSubmitting}
        >
          이전
        </button>
        <button
          className="complete-button"
          onClick={handleComplete}
          disabled={isSubmitting}
        >
          {isSubmitting ? '처리중...' : '작업 종료'}
        </button>
      </div>
    </div>
  );
};