package ssafy.m09.service;
import org.springframework.http.*;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.TextWebSocketHandler;
import org.springframework.stereotype.Component;

import java.util.HashMap;
import java.util.HashSet;
import java.util.Map;
import java.util.Set;

@Component
public class StreamWebSocketHandler extends TextWebSocketHandler {
    private final Set<WebSocketSession> sessions = new HashSet<>();

    @Override
    public void afterConnectionEstablished(WebSocketSession session) throws Exception {
        sessions.add(session);  // 세션 등록
        System.out.println("WebSocket 연결됨: " + session.getId());
    }

    @Override
    public void handleTextMessage(WebSocketSession session, TextMessage message) throws Exception {
        // 프론트에서 전송된 이미지를 임베디드로 전달
        sendToEmbeddedDevice(message.getPayload());
    }

    @Override
    public void afterConnectionClosed(WebSocketSession session, org.springframework.web.socket.CloseStatus status) throws Exception {
        sessions.remove(session);
        System.out.println("WebSocket 연결 종료됨: " + session.getId());
    }

    private void sendToEmbeddedDevice(String imageData) {
        // 임베디드 장치로 HTTP 요청을 통해 이미지 전달
        System.out.println("임베디드로 이미지 데이터 전송 시작...");

        String embeddedUrl = "http://localhost:8765/embedded/helmet-detection";
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        // 이미지 데이터를 JSON 형식으로 포장
        Map<String, String> payload = new HashMap<>();
        payload.put("image", imageData);
        HttpEntity<Map<String, String>> request = new HttpEntity<>(payload, headers);

        RestTemplate restTemplate = new RestTemplate();
        ResponseEntity<String> response = restTemplate.postForEntity(embeddedUrl, request, String.class);

        if (response.getStatusCode() == HttpStatus.OK) {
            System.out.println("임베디드에서 성공적으로 처리됨: " + response.getBody());
        } else {
            System.out.println("임베디드에서 오류 발생");
        }
    }

    public void broadcastToClient(String message) {
        for (WebSocketSession session : sessions) {
            try {
                session.sendMessage(new TextMessage(message));
            } catch (Exception e) {
                e.printStackTrace();
            }
        }
    }
}

