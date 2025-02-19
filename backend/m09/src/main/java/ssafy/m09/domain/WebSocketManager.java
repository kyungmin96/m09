package ssafy.m09.domain;

import lombok.Getter;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.CloseStatus;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.TextWebSocketHandler;
import ssafy.m09.service.Tool2EmbeddedService;

import java.util.Collections;
import java.util.HashSet;
import java.util.Set;

@Component
public class WebSocketManager extends TextWebSocketHandler {
    @Getter
    private final Set<WebSocketSession> sessions = Collections.synchronizedSet(new HashSet<>());
    private final QueueManager queueManager;
    private final Tool2EmbeddedService tool2EmbeddedService;

    public WebSocketManager(QueueManager queueManager, Tool2EmbeddedService tool2EmbeddedService) {
        this.queueManager = queueManager;
        this.tool2EmbeddedService = tool2EmbeddedService;
    }

    @Override
    public void afterConnectionEstablished(WebSocketSession session) {
        sessions.add(session);
        System.out.println("WebSocket connected: " + session.getId());
    }

    @Override
    public void handleTextMessage(WebSocketSession session, TextMessage msg){
        System.out.println(msg.getPayload());
        queueManager.add2Queue("/tool", msg.getPayload());
        tool2EmbeddedService.sendToolDetectionRequest();
    }

    @Override
    public void afterConnectionClosed(WebSocketSession session, CloseStatus status){
        sessions.remove(session);
        System.out.println("WebSocket disconnected: " + session.getId());
    }

    public void sendMessageToAll(String message) {
        synchronized (sessions) {
            for (WebSocketSession session : sessions) {
                try {
                    session.sendMessage(new TextMessage(message));
                } catch (Exception e) {
                    System.out.println("메시지 전송 오류: " + e.getMessage());
                }
            }
        }
    }
}
