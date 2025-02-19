
// DOM 요소 선택
const DataElement = document.getElementById("Data");
const startButton = document.getElementById("start");
const stopButton = document.getElementById("stop");

// WebSocket과 스트리밍 상태 변수
let socket;
let streaming = false;
let socket_url = "ws://70.12.246.80:8080/api/v1/ws";

// WebSocket 연결 함수
function connectWebSocket(posturl) {
    socket = new WebSocket(socket_url); // 백엔드 WebSocket URL

    // WebSocket 연결 성공 시
    socket.onopen = async () => {
        console.log("WebSocket 연결 성공");
        streaming = true;

        try {
            // HTTP POST 요청 보내기
            const response = await fetch(posturl, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
            });

            // 응답 상태 확인
            if (!response.ok) {
                throw new Error(`HTTP 오류 발생! 상태 코드: ${response.status}`);
            }

            // 응답 본문이 비어 있는지 확인
            const contentLength = response.headers.get("Content-Length");
            if (contentLength === "0" || response.status === 204) {
                console.warn("서버 응답이 비어 있습니다.");
                return;
            }

            // JSON 응답 파싱 및 출력
            const responseData = await response.json();
            console.log("POST 요청 성공, 서버 응답:", responseData);
        } catch (error) {
            console.error("POST 요청 중 오류 발생:", error);
        }
    };

    // WebSocket 메시지 수신 처리
    socket.onmessage = (event) => {
        try {
            if (typeof event.data === "string") {
                console.log("데이터 수신:", event.data);

                // 수신된 데이터를 화면에 표시
                DataElement.textContent = event.data;
                if (DataElement.textContent === "ok") {
                    //추가 로직 필요
                    socket.close(); // 임시 코드
                }
                else if(DataElement.textContent === "failed"){
                    console.error("failed");
                }
                else{
                    //공구 체크로직 필요
                }
            } else {
                console.warn("알 수 없는 데이터 형식:", event.data);
            }
        } catch (error) {
            console.error("데이터 처리 중 오류:", error);
        }
    };

    // WebSocket 연결 종료 처리
    socket.onclose = () => {
        console.log("WebSocket 연결 종료");
        streaming = false;
    };

    // WebSocket 오류 처리
    socket.onerror = (error) => {
        console.error("WebSocket 오류:", error);
    };
}

// 테스트 시작 버튼 클릭 이벤트 핸들러
startButton.addEventListener("click", () => {
    if (!streaming) {
        connectWebSocket();
        console.log("테스트 시작");
    } else {
        console.log("이미 테스트 중입니다.");
    }
});

// 테스트 중단 버튼 클릭 이벤트 핸들러
stopButton.addEventListener("click", () => {
    if (socket && streaming) {
        socket.close(); // WebSocket 연결 종료
        console.log("테스트 중단");
    }
});
