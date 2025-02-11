import React, { useState, useEffect } from 'react';
import Camera from './Camera';
import ToolCheckItem from './ToolCheckItem';
import './ToolCheck.scss';

// key 생성 함수들
const createToolKey = (toolId, isDefault) => `${toolId}-${isDefault ? 'default' : 'additional'}`;
const createListKey = (tool) => `${tool.id}-${tool.isDefault ? 'default' : 'additional'}-${tool.works.map(w => w.id).join('-')}`;

const ToolCheckSection = ({
  tools = [],
  onAddToolClick,
  onToolsUpdate,
  onDeleteTool,
  isCameraEnabled = true
}) => {
  const [defaultTools, setDefaultTools] = useState([]);
  const [additionalTools, setAdditionalTools] = useState([]);
  const [checkedTools, setCheckedTools] = useState(new Set());
  const [cameraDetectedTools, setCameraDetectedTools] = useState(new Set());
  const [disabledTools, setDisabledTools] = useState(new Set());

  // tools prop이 변경될 때마다 실행
  useEffect(() => {
    // 도구의 works 배열이 정의되어 있는지 확인하고 기본값 설정
    const normalizedTools = tools.map(tool => ({
      ...tool,
      works: Array.isArray(tool.works) ? tool.works : []
    }));

    const loadedDefaultTools = normalizedTools.filter(tool => tool.isDefault);
    const loadedAdditionalTools = normalizedTools.filter(tool => !tool.isDefault);

    setDefaultTools(loadedDefaultTools);
    setAdditionalTools(loadedAdditionalTools);

    // localStorage에서 상태 로드
    const loadedCheckedTools = JSON.parse(localStorage.getItem('checkedTools')) || [];
    const loadedCameraDetected = JSON.parse(localStorage.getItem('cameraDetectedTools')) || [];
    const loadedDisabledTools = JSON.parse(localStorage.getItem('disabledTools')) || [];

    setCheckedTools(new Set(loadedCheckedTools));
    setCameraDetectedTools(new Set(loadedCameraDetected));
    setDisabledTools(new Set(loadedDisabledTools));
  }, [tools]);

  // 상태 변경을 감지하고 상위 컴포넌트에 알림
  useEffect(() => {
    // 로컬 스토리지 업데이트
    localStorage.setItem('checkedTools', JSON.stringify([...checkedTools]));
    localStorage.setItem('cameraDetectedTools', JSON.stringify([...cameraDetectedTools]));
    localStorage.setItem('disabledTools', JSON.stringify([...disabledTools]));

    // 전체 도구 목록
    const allTools = [...defaultTools, ...additionalTools];

    // 활성화된 도구 목록 (비활성화되지 않은 도구)
    const activeTools = allTools.filter(tool =>
      !disabledTools.has(createToolKey(tool.id, tool.isDefault))
    );

    // 체크된 도구 목록
    const checkedToolsList = activeTools
      .filter(tool => checkedTools.has(createToolKey(tool.id, tool.isDefault)))
      .map(tool => ({
        id: tool.id,
        name: tool.name,
        isDefault: tool.isDefault,
        works: tool.works
      }));

    // 상위 컴포넌트에 업데이트된 정보 전달
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
      // 기본 공구는 활성화/비활성화 토글
      const newDisabledTools = new Set(disabledTools);
      if (newDisabledTools.has(toolKey)) {
        newDisabledTools.delete(toolKey);
      } else {
        newDisabledTools.add(toolKey);
        // 비활성화 시 체크 해제
        const newCheckedTools = new Set(checkedTools);
        newCheckedTools.delete(toolKey);
        setCheckedTools(newCheckedTools);
      }
      setDisabledTools(newDisabledTools);
    } else {
      // 추가된 공구는 부모 컴포넌트의 삭제 함수 호출
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
        <button className="add-tool-button" onClick={onAddToolClick}>
          공구 추가
        </button>
      </div>

      <div className="camera-section">
        <Camera
          isEnabled={isCameraEnabled}
          onToolDetected={handleCameraDetection}
        />
      </div>

      <div className="tools-list">
        {!hasDefaultTools && (
          <p className="tool-status">작업에 고정적으로 할당된 작업이 없습니다.</p>
        )}

        {hasDefaultTools && !hasActiveTools && (
          <p className="tool-status">체크할 공구가 없습니다</p>
        )}
        {/* 기본 도구 목록 */}
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
          />
        ))}

        {/* 추가된 도구 목록 */}
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
          />
        ))}
      </div>
    </div>
  );
};

export default ToolCheckSection;