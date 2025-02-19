package ssafy.m09.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.web.socket.config.annotation.EnableWebSocket;
import org.springframework.web.socket.config.annotation.WebSocketConfigurer;
import org.springframework.web.socket.config.annotation.WebSocketHandlerRegistry;
import ssafy.m09.domain.WebSocketManager;

@Configuration
@EnableWebSocket
@EnableScheduling
public class WebSocketConfig implements WebSocketConfigurer {
    private final WebSocketManager webSocketManager;

    public WebSocketConfig(WebSocketManager webSocketManager) {
        this.webSocketManager = webSocketManager;
    }

    @Override
    public void registerWebSocketHandlers(WebSocketHandlerRegistry registry) {
        registry.addHandler(webSocketManager, "/ws")  // WebSocket 엔드포인트 설정
                .setAllowedOrigins("*");  // CORS 문제 해결
    }
}
