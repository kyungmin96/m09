package ssafy.m09.service;

import org.springframework.http.*;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.socket.*;
import org.springframework.web.socket.handler.BinaryWebSocketHandler;

import javax.imageio.ImageIO;
import java.awt.image.BufferedImage;
import java.io.ByteArrayOutputStream;
import java.net.URL;
import java.nio.ByteBuffer;
import java.util.HashSet;
import java.util.Set;

@Component
public class EmbeddedWebSocketHandler extends BinaryWebSocketHandler {
    private final String EMBEDDED_API_URL = "http://localhost:8765/barebone";
    private final String EC2_URL = "https://i12a202.p.ssafy.io/api/v1/embedded";
    private final Set<WebSocketSession> sessions = new HashSet<>();
    private final RestTemplate restTemplate = new RestTemplate();  // HTTP 요청을 위한 RestTemplate
    private final String fastApiStreamUrl = EMBEDDED_API_URL + "/camera/stream"; // FAST API 스트리밍 URL
    private final String fastApiStartUrl = EMBEDDED_API_URL + "/detect-helmet/start";   // FAST API 시작 명령 URL
    private final String fastApiNFCUrl = EMBEDDED_API_URL + "/nfc/start";

    @Override
    public void afterConnectionEstablished(WebSocketSession session) throws Exception {
        sessions.add(session);
        System.out.println("WebSocket 연결됨: " + session.getId());
    }

    @Override
    public void handleTextMessage(WebSocketSession session, TextMessage message) {
        String payload = message.getPayload();
        System.out.println("수신된 메시지: " + payload);

        if ("START_HELMET".equalsIgnoreCase(payload)) {
            // FAST API에 HTTP 요청을 보내 스트리밍 시작
            startHelmetStreaming();
        } else if("RFID_START".equalsIgnoreCase(payload)) {
            startNFC();
        } else if ("OK".equalsIgnoreCase(payload)) {
            sendToFrontEnd(new TextMessage("OK"));
            closeSessions();
        }
    }

    @Override
    public void afterConnectionClosed(WebSocketSession session, CloseStatus status) throws Exception {
        sessions.remove(session);
        System.out.println("WebSocket 연결 종료됨: " + session.getId());
    }

    public void startNFC()
    {
        try{
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            HttpEntity<String> request = new HttpEntity<>("{}", headers);
            restTemplate.postForObject(fastApiNFCUrl, request, String.class);
            System.out.println("FAST API에 NFC 시작 요청 보냄 (POST)");
        } catch (Exception e) {
            System.out.println("NFC 오류: " + e.getMessage());
        }
    }
    /**
     * FAST API에서 스트리밍된 이미지를 받아 프론트엔드로 전송
     */
    @Async
    public void startHelmetStreaming() {
        try {
            // FAST API에 헬멧 감지 시작 요청 전송
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            HttpEntity<String> request = new HttpEntity<>("{}", headers);
            restTemplate.postForObject(fastApiStartUrl, request, String.class);
            System.out.println("FAST API에 스트리밍 시작 요청 보냄 (POST)");

            // FAST API에서 스트리밍된 이미지를 가져와서 전송
            while (!sessions.isEmpty()) {
                BufferedImage image = ImageIO.read(new URL(fastApiStreamUrl));
                if (image == null) continue;

                // 이미지를 WebSocket을 통해 프론트로 전송
                ByteArrayOutputStream baos = new ByteArrayOutputStream();
                ImageIO.write(image, "png", baos);
                byte[] imageBytes = baos.toByteArray();
                BinaryMessage binaryMessage = new BinaryMessage(ByteBuffer.wrap(imageBytes));

                for (WebSocketSession session : sessions) {
                    session.sendMessage(binaryMessage);
                }
                System.out.println("FAST API 스트리밍 이미지 전송");

                Thread.sleep(100);  // 100ms 간격으로 영상 전송 (초당 10프레임)
            }
        } catch (Exception e) {
            System.out.println("스트리밍 오류: " + e.getMessage());
        }
    }

    /**
     *  FAST API에서 헬멧 감지 성공 POST 요청을 받으면 프론트에 알림 전송
     */
    public ResponseEntity<String> handleHelmetDetection() {
        try {
            sendToFrontEnd(new TextMessage("{\"helmet\": true}"));
            closeSessions();
            System.out.println("헬멧 감지 성공 -> 프론트로 전송 완료");
            return ResponseEntity.ok("Helmet detected, message sent to frontend.");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error sending message to frontend");
        }
    }

    /**
     *  프론트엔드에 메시지 전송
     */
    private void sendToFrontEnd(TextMessage message) {
        for (WebSocketSession session : sessions) {
            try {
                session.sendMessage(message);
            } catch (Exception e) {
                System.out.println("메시지 전송 오류: " + e.getMessage());
            }
        }
    }

    /**
     *  모든 WebSocket 세션 닫기
     */
    private void closeSessions() {
        for (WebSocketSession session : sessions) {
            try {
                session.close();
            } catch (Exception e) {
                System.out.println("세션 종료 오류: " + e.getMessage());
            }
        }
        sessions.clear();
    }
}
