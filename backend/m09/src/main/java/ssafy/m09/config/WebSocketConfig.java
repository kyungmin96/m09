package ssafy.m09.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.socket.config.annotation.EnableWebSocket;
import org.springframework.web.socket.config.annotation.WebSocketConfigurer;
import org.springframework.web.socket.config.annotation.WebSocketHandlerRegistry;
import ssafy.m09.service.StreamWebSocketHandler;

@Configuration
@EnableWebSocket
public class WebSocketConfig implements WebSocketConfigurer {
    private final StreamWebSocketHandler streamWebSocketHandler;

    public WebSocketConfig(StreamWebSocketHandler streamWebSocketHandler) {
        this.streamWebSocketHandler = streamWebSocketHandler;
    }

    @Override
    public void registerWebSocketHandlers(WebSocketHandlerRegistry registry) {
        registry.addHandler(streamWebSocketHandler, "/ws/stream")
                .setAllowedOrigins("*");  // 모든 도메인에서 연결 허용 (개발 단계)
    }
}
