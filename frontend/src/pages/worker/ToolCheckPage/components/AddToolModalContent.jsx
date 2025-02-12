import React, { useState, useRef, useEffect } from 'react';
import './AddToolModalContent.scss';

const DUMMY_TOOLS = [
  { id: 1, name: "전동 드릴" },
  { id: 2, name: "토크 렌치" },
  { id: 3, name: "햄머" },
  { id: 4, name: "유압 게이지" }
];

const DUMMY_WORKS = [
  { id: 1, name: "엔진 점검 및 정비" },
  { id: 2, name: "작동 상태 정비" }
];

const ToolSelectionContent = ({ onSubmit, onClose }) => {
  const [selectedTools, setSelectedTools] = useState([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [activeToolId, setActiveToolId] = useState(null);
  const dropdownRef = useRef(null);
  const searchButtonRef = useRef(null);

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
      setSelectedTools([...selectedTools, { ...tool, works: [] }]);
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
              works: tool.works.filter(w => w.id !== work.id)
            };
          } else {
            return {
              ...tool,
              works: [...tool.works, work]
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
    const existingTools = JSON.parse(localStorage.getItem('todayTools')) || [];
    
    const newToolsToAdd = selectedTools.map(tool => ({
      id: `tool-${Date.now()}-${tool.id}`,
      name: tool.name,
      works: tool.works.map((work, index) => ({
        id: `${tool.id}-${index + 1}`,
        name: work.name
      }))
    }));

    const updatedTools = [...existingTools, ...newToolsToAdd];
    localStorage.setItem('todayTools', JSON.stringify(updatedTools));
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
                    {tool.name}
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
              <span>{tool.name}</span>
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
                  {DUMMY_WORKS.map(work => (
                    <div
                      key={work.id}
                      className={`work-item ${tool.works.some(w => w.id === work.id) ? 'selected' : ''}`}
                      onClick={() => handleWorkToggle(tool.id, work)}
                    >
                      {work.name}
                    </div>
                  ))}
                </div>
              </div>

              <div className="selected-works">
                {tool.works.map(work => (
                  <div key={work.id} className="work-badge">
                    <span className="badge-text">{work.name}</span>
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

export default ToolSelectionContent;