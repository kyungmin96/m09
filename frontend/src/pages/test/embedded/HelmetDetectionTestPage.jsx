// import { startHelmetDetection } from '@/features/auth/embedded/embedded_api'; // API 함수 import


import React, { useState, useEffect } from "react";

const HelmetDetectionTestPage = () => {
  const [people, setPeople] = useState([
    { name: "Alice", checked: false },
    { name: "Bob", checked: false },
    { name: "Charlie", checked: false },
  ]); // 초기 사람 목록
  const [currentPersonIndex, setCurrentPersonIndex] = useState(0); // 현재 검사 중인 사람의 인덱스
  const [isChecking, setIsChecking] = useState(false); // 검사 진행 여부
  const [allChecked, setAllChecked] = useState(false); // 모든 사람이 확인되었는지 여부
  const [socket, setSocket] = useState(null); // WebSocket 객체

  // WebSocket 연결 설정
  useEffect(() => {
    const ws = new WebSocket("ws://localhost:8080/api/v1/ws"); // 백엔드 WebSocket URL
    setSocket(ws);

    ws.onopen = () => {
      console.log("WebSocket 연결 성공");
    };

    ws.onmessage = (event) => {
      try {
        const response = JSON.parse(event.data);
        if (response.helmet === true) {
          console.log("헬멧 착용 확인됨");
          handleManualCheck(); // 헬멧 착용 확인 시 자동으로 수동 확인 처리
        }
      } catch (error) {
        console.error("응답 데이터 처리 중 오류:", error);
      }
    };

    ws.onclose = () => {
      console.log("WebSocket 연결 종료");
    };

    ws.onerror = (error) => {
      console.error("WebSocket 오류:", error);
    };

    return () => {
      ws.close(); // 컴포넌트 언마운트 시 WebSocket 연결 종료
    };
  }, []);

  // 검사 시작 핸들러
  const startChecking = () => {
    if (!isChecking && socket) {
      setIsChecking(true);
      console.log("검사 시작");
      sendCheckRequest();
    }
  };

  // 검사 중단 핸들러
  const stopChecking = () => {
    if (isChecking) {
      setIsChecking(false);
      console.log("검사 중단");
    }
  };

  // 수동 확인 핸들러
  const handleManualCheck = () => {
    const updatedPeople = [...people];
    updatedPeople[currentPersonIndex].checked = true; // 현재 사람을 확인된 상태로 변경
    setPeople(updatedPeople);

    // 다음 사람으로 이동
    if (currentPersonIndex < people.length - 1) {
      setCurrentPersonIndex(currentPersonIndex + 1);
    } else {
      setAllChecked(true); // 모든 사람이 확인되었으면 다음 단계 활성화
      console.log("모든 사람이 확인되었습니다.");
    }
  };

  // 특정 사람 선택 핸들러
  const handleSelectPerson = (index) => {
    if (!isChecking) {
      setCurrentPersonIndex(index);
      console.log(`${people[index].name} 검사로 이동`);
    }
  };

  // 백엔드에 헬멧 착용 여부 요청 전송
  const sendCheckRequest = () => {
    if (socket && isChecking) {
      socket.send(JSON.stringify({ type: "check", person: people[currentPersonIndex].name }));
      console.log(`헬멧 착용 여부 요청 전송: ${people[currentPersonIndex].name}`);
      
      // 주기적으로 요청 전송 (예: 2초마다)
      setTimeout(sendCheckRequest, 2000);
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>헬멧 착용 여부 검사</h1>
      
      {/* 사람 목록 */}
      <ul>
        {people.map((person, index) => (
          <li
            key={index}
            onClick={() => handleSelectPerson(index)}
            style={{
              cursor: "pointer",
              padding: "10px",
              marginBottom: "5px",
              backgroundColor: person.checked ? "lightgreen" : index === currentPersonIndex ? "lightblue" : "",
              border: "1px solid #ccc",
            }}
          >
            {person.name}
          </li>
        ))}
      </ul>

      {/* 버튼들 */}
      <button onClick={startChecking} disabled={isChecking || allChecked}>
        검사 시작
      </button>
      <button onClick={stopChecking} disabled={!isChecking}>
        중단
      </button>
      <button onClick={handleManualCheck} disabled={people[currentPersonIndex]?.checked || allChecked}>
        수동 확인
      </button>
      
      {/* 다음 단계 버튼 */}
      <button onClick={() => alert("다음 단계로 진행합니다!")} disabled={!allChecked}>
        다음 단계
      </button>
      
      {/* 상태 표시 */}
      <div style={{ marginTop: "20px" }}>
        <strong>현재 검사 대상:</strong> {people[currentPersonIndex]?.name || "없음"}
        <br />
        <strong>검사 상태:</strong> {isChecking ? "진행 중" : "중단됨"}
        <br />
        <strong>전체 상태:</strong> {allChecked ? "모든 사람 확인 완료" : "확인 필요"}
      </div>
    </div>
  );
};

export default HelmetDetectionTestPage;
