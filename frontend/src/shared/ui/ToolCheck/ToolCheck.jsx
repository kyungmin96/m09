import React, { useState, useEffect } from 'react';
import Camera from '@/shared/ui/Camera/Camera';
import ToolCheckItem from './ToolCheckItem';
import './ToolCheck.scss';

const createToolKey = (toolId, isDefault) => `${toolId}-${isDefault ? 'default' : 'additional'}`;

const ToolCheckSection = ({
  tools = [],
  onAddToolClick,
  onToolsUpdate,
  onDeleteTool,
  isCameraEnabled = true,
  isReturnPage = false,  // 반납 페이지 여부
  hideAddButton = false, // 추가 버튼 숨김 여부
}) => {
  const [defaultTools, setDefaultTools] = useState([]);
  const [additionalTools, setAdditionalTools] = useState([]);
  const [checkedTools, setCheckedTools] = useState(new Set());
  const [cameraDetectedTools, setCameraDetectedTools] = useState(new Set());
  const [disabledTools, setDisabledTools] = useState(new Set());

  useEffect(() => {
    const normalizedTools = tools.map(tool => ({
      ...tool,
      works: Array.isArray(tool.works) ? tool.works : []
    }));

    const loadedDefaultTools = normalizedTools.filter(tool => tool.isDefault);
    const loadedAdditionalTools = normalizedTools.filter(tool => !tool.isDefault);

    setDefaultTools(loadedDefaultTools);
    setAdditionalTools(loadedAdditionalTools);

    const loadedCheckedTools = JSON.parse(localStorage.getItem('checkedTools')) || [];
    const loadedCameraDetected = JSON.parse(localStorage.getItem('cameraDetectedTools')) || [];
    const loadedDisabledTools = JSON.parse(localStorage.getItem('disabledTools')) || [];

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
        name: tool.name,
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

export default ToolCheckSection;