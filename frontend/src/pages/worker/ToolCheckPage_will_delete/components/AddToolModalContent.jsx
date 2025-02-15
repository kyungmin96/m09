import React, { useState, useRef, useEffect } from 'react';
import './AddToolModalContent.scss';

const DUMMY_TOOLS = [
  { 
    id: 1, 
    title: "전동 드릴",
    content: "전동 드릴 - 18V, 충전식",
    comment: "정기 점검 필요",
    location: "공구실 A-1"
  },
  { 
    id: 2, 
    title: "토크 렌치",
    content: "토크 렌치 세트 - 1/2인치",
    comment: "보정 일자 확인 필요",
    location: "공구실 B-2"
  }
];

export const ToolSelectionContent = ({ onSubmit, onClose }) => {
  const [selectedTools, setSelectedTools] = useState([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [activeToolId, setActiveToolId] = useState(null);
  const [availableWorks, setAvailableWorks] = useState([]);
  const dropdownRef = useRef(null);
  const searchButtonRef = useRef(null);

  // localStorage에서 작업 목록 가져오기
  useEffect(() => {
    const savedTasks = localStorage.getItem('selectedTasks');
    if (savedTasks) {
      const parsedTasks = JSON.parse(savedTasks);
      setAvailableWorks(parsedTasks);
    }
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target) &&
          searchButtonRef.current && !searchButtonRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleToolSelect = (tool) => {
    const existingTool = selectedTools.find(t => t.id === tool.id);
    if (!existingTool) {
      setSelectedTools([...selectedTools, { 
        ...tool, 
        works: [],
        taskState: 'READY',
        startTime: null,
        endTime: null,
        createdAt: new Date().toISOString(),
        updatedAt: null
      }]);
    }
    setIsDropdownOpen(false);
  };

  const handleWorkToggle = (toolId, work) => {
    setSelectedTools(prevTools => 
      prevTools.map(tool => {
        if (tool.id === toolId) {
          const workExists = tool.works.some(w => w.id === work.id);
          if (workExists) {
            return {
              ...tool,
              works: tool.works.filter(w => w.id !== work.id),
              updatedAt: new Date().toISOString()
            };
          } else {
            return {
              ...tool,
              works: [...tool.works, work],
              updatedAt: new Date().toISOString()
            };
          }
        }
        return tool;
      })
    );
  };

  const handleRemoveTool = (toolId) => {
    setSelectedTools(prevTools => prevTools.filter(tool => tool.id !== toolId));
    if (activeToolId === toolId) {
      setActiveToolId(null);
    }
  };

  const toggleWorkDropdown = (toolId) => {
    setActiveToolId(activeToolId === toolId ? null : toolId);
  };

  const handleSubmit = () => {
    const newToolsToAdd = selectedTools.map(tool => ({
      id: `tool-${Date.now()}-${tool.id}`,
      title: tool.title,
      content: tool.content,
      comment: tool.comment,
      location: tool.location,
      taskState: 'READY',
      startTime: null,
      endTime: null,
      createdAt: new Date().toISOString(),
      updatedAt: null,
      works: tool.works.map(work => ({
        id: `${tool.id}-${work.id}`,
        title: work.title,
        content: work.content,
        taskState: work.taskState,
        scheduledStartTime: work.scheduledStartTime,
        scheduledEndTime: work.scheduledEndTime
      }))
    }));

    onSubmit(newToolsToAdd);
    setSelectedTools([]);
    setActiveToolId(null);
    onClose();
  };

  return (
    <>
      <div className="search-section">
        <div className="search-container">
          <button 
            ref={searchButtonRef}
            className="search-button"
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          >
            공구명 검색
            <span className={`arrow-down ${isDropdownOpen ? 'open' : ''}`}></span>
          </button>
          {isDropdownOpen && (
            <div ref={dropdownRef} className="tool-dropdown visible">
              {DUMMY_TOOLS
                .filter(tool => !selectedTools.some(t => t.id === tool.id))
                .map(tool => (
                  <div
                    key={tool.id}
                    className="tool-item"
                    onClick={() => handleToolSelect(tool)}
                  >
                    {tool.title}
                  </div>
                ))}
            </div>
          )}
        </div>
      </div>

      <div className="selected-tools">
        {selectedTools.map((tool) => (
          <div key={tool.id} className="selected-tool-item">
            <div className="tool-header">
              <span>{tool.title}</span>
              <button 
                className="remove-tool"
                onClick={() => handleRemoveTool(tool.id)}
              >
                ×
              </button>
            </div>

            <div className="tool-content">
              <div className="work-selection">
                <button 
                  className="work-button"
                  onClick={() => toggleWorkDropdown(tool.id)}
                >
                  필요 작업 선택
                  <span className={`arrow-down ${activeToolId === tool.id ? 'open' : ''}`}></span>
                </button>

                <div className={`work-dropdown ${activeToolId === tool.id ? 'visible' : ''}`}>
                  {availableWorks.map(work => (
                    <div
                      key={work.id}
                      className={`work-item ${tool.works.some(w => w.id === work.id) ? 'selected' : ''}`}
                      onClick={() => handleWorkToggle(tool.id, work)}
                    >
                      {work.title}
                    </div>
                  ))}
                </div>
              </div>

              <div className="selected-works">
                {tool.works.map(work => (
                  <div key={work.id} className="work-badge">
                    <span className="badge-text">{work.title}</span>
                    <button
                      className="remove-badge"
                      onClick={() => handleWorkToggle(tool.id, work)}
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      <button 
        className="submit-button"
        onClick={handleSubmit}
        disabled={selectedTools.length === 0 || selectedTools.some(tool => tool.works.length === 0)}
      >
        공구 추가 완료
      </button>
    </>
  );
};