import React, { useState, useEffect } from 'react';
import { Camera } from '@/shared/ui/Camera/Camera';
import { ToolCheckItem } from './ToolCheckItem';
import './ToolCheck.scss';

const createToolKey = (toolId, isDefault) => `${toolId}-${isDefault ? 'default' : 'additional'}`;

export const ToolCheckSection = ({
  tools = [],
  onAddToolClick,
  onToolsUpdate,
  onDeleteTool,
  isCameraEnabled = true,
  isReturnPage = false,
  hideAddButton = false,
}) => {
  const [defaultTools, setDefaultTools] = useState([]);
  const [additionalTools, setAdditionalTools] = useState([]);
  const [checkedTools, setCheckedTools] = useState(new Set());
  const [cameraDetectedTools, setCameraDetectedTools] = useState(new Set());
  const [disabledTools, setDisabledTools] = useState(new Set());

  // 초기 도구 목록 설정
  useEffect(() => {
    // localStorage에서 작업 정보 가져오기
    const savedTasks = JSON.parse(localStorage.getItem('selectedTasks') || '[]');
    
    // 작업별 필요 도구 추출 및 가공
    const toolsFromTasks = savedTasks.reduce((acc, task) => {
      // task.content에서 도구 목록 추출
      const toolMatches = task.content?.match(/필요한\s*도구[:\s]*([\s\S]+?)(?=\n|$)/i);
      const toolsList = toolMatches ? toolMatches[1].split(',').map(t => t.trim()) : [];
      
      toolsList.forEach(toolName => {
        const existingTool = acc.find(t => t.title === toolName);
        if (existingTool) {
          existingTool.works.push({
            id: task.id,
            title: task.title
          });
        } else {
          acc.push({
            id: `default-${Date.now()}-${Math.random()}`,
            title: toolName,
            works: [{
              id: task.id,
              title: task.title
            }],
            isDefault: true
          });
        }
      });
      return acc;
    }, []);

    // 기존 추가된 도구들 가져오기
    const savedAdditionalTools = JSON.parse(localStorage.getItem('additionalTools') || '[]');

    // 도구 목록 설정
    const normalizedTools = [...toolsFromTasks, ...savedAdditionalTools].map(tool => ({
      ...tool,
      works: Array.isArray(tool.works) ? tool.works : []
    }));

    const loadedDefaultTools = normalizedTools.filter(tool => tool.isDefault);
    const loadedAdditionalTools = normalizedTools.filter(tool => !tool.isDefault);

    setDefaultTools(loadedDefaultTools);
    setAdditionalTools(loadedAdditionalTools);

    // 체크 상태 복원
    const loadedCheckedTools = JSON.parse(localStorage.getItem('checkedTools') || '[]');
    const loadedCameraDetected = JSON.parse(localStorage.getItem('cameraDetectedTools') || '[]');
    const loadedDisabledTools = JSON.parse(localStorage.getItem('disabledTools') || '[]');

    setCheckedTools(new Set(loadedCheckedTools));
    setCameraDetectedTools(new Set(loadedCameraDetected));
    setDisabledTools(new Set(loadedDisabledTools));
  }, [tools]);

  useEffect(() => {
    localStorage.setItem('checkedTools', JSON.stringify([...checkedTools]));
    localStorage.setItem('cameraDetectedTools', JSON.stringify([...cameraDetectedTools]));
    localStorage.setItem('disabledTools', JSON.stringify([...disabledTools]));

    const allTools = [...defaultTools, ...additionalTools];
    const activeTools = allTools.filter(tool =>
      !disabledTools.has(createToolKey(tool.id, tool.isDefault))
    );

    const checkedToolsList = activeTools
      .filter(tool => checkedTools.has(createToolKey(tool.id, tool.isDefault)))
      .map(tool => ({
        id: tool.id,
        title: tool.title,
        isDefault: tool.isDefault,
        works: tool.works
      }));

    onToolsUpdate?.(checkedToolsList, disabledTools, allTools);
  }, [defaultTools, additionalTools, checkedTools, cameraDetectedTools, disabledTools]);

  const handleToolCheck = (toolId, isDefault) => {
    const toolKey = createToolKey(toolId, isDefault);
    if (disabledTools.has(toolKey)) return;

    const newCheckedTools = new Set(checkedTools);
    if (newCheckedTools.has(toolKey)) {
      newCheckedTools.delete(toolKey);
    } else {
      newCheckedTools.add(toolKey);
    }
    setCheckedTools(newCheckedTools);
  };

  // 카메라 감지 처리 함수 추가
  const handleCameraDetection = (toolId, isDefault) => {
    const toolKey = createToolKey(toolId, isDefault);
    if (disabledTools.has(toolKey)) return;

    const newCameraDetectedTools = new Set(cameraDetectedTools);
    newCameraDetectedTools.add(toolKey);
    setCameraDetectedTools(newCameraDetectedTools);

    const newCheckedTools = new Set(checkedTools);
    newCheckedTools.add(toolKey);
    setCheckedTools(newCheckedTools);
  };

  const handleDisableTool = (toolId, isDefault) => {
    const toolKey = createToolKey(toolId, isDefault);

    if (isDefault) {
      const newDisabledTools = new Set(disabledTools);
      if (newDisabledTools.has(toolKey)) {
        newDisabledTools.delete(toolKey);
      } else {
        newDisabledTools.add(toolKey);
        const newCheckedTools = new Set(checkedTools);
        newCheckedTools.delete(toolKey);
        setCheckedTools(newCheckedTools);
      }
      setDisabledTools(newDisabledTools);
    } else {
      onDeleteTool?.(toolKey);
    }
  };

  const allTools = [...defaultTools, ...additionalTools];
  const hasActiveTools = allTools.some(tool =>
    !disabledTools.has(createToolKey(tool.id, tool.isDefault))
  );
  const hasDefaultTools = defaultTools.length > 0;

  return (
    <div className="tool-check-section">
      <div className="section-header">
        <h2 className="section-title">공구 체크리스트</h2>
        {!hideAddButton && (
          <button className="add-tool-button" onClick={onAddToolClick}>
            공구 추가
          </button>
        )}
      </div>

      {!isReturnPage && (
        <div className="camera-section">
          <Camera
            isEnabled={isCameraEnabled}
            onToolDetected={handleCameraDetection}
          />
        </div>
      )}

      <div className="tools-list">
        {!hasDefaultTools && (
          <p className="tool-status">작업에 고정적으로 할당된 작업이 없습니다.</p>
        )}

        {hasDefaultTools && !hasActiveTools && (
          <p className="tool-status">체크할 공구가 없습니다</p>
        )}
        
        {defaultTools.map((tool) => (
          <ToolCheckItem
            key={`default-${tool.id}`}
            tool={tool}
            isDefault={true}
            isChecked={checkedTools.has(createToolKey(tool.id, true))}
            isCameraDetected={cameraDetectedTools.has(createToolKey(tool.id, true))}
            isDisabled={disabledTools.has(createToolKey(tool.id, true))}
            onCheckChange={() => handleToolCheck(tool.id, true)}
            onDisable={() => handleDisableTool(tool.id, true)}
            isReturnPage={isReturnPage}
          />
        ))}

        {additionalTools.map((tool) => (
          <ToolCheckItem
            key={`additional-${tool.id}`}
            tool={tool}
            isDefault={false}
            isChecked={checkedTools.has(createToolKey(tool.id, false))}
            isCameraDetected={cameraDetectedTools.has(createToolKey(tool.id, false))}
            isDisabled={disabledTools.has(createToolKey(tool.id, false))}
            onCheckChange={() => handleToolCheck(tool.id, false)}
            onDisable={() => handleDisableTool(tool.id, false)}
            isReturnPage={isReturnPage}
          />
        ))}
      </div>
    </div>
  );
};