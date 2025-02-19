package ssafy.m09.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**")
               .allowedOrigins(
                       "http://localhost:5173",
                       "http://localhost:3000",
                       "https://i12a202.p.ssafy.io/",
                       "http://backend:8080/",
                       "http://s12p11a202-backend:8080/",
                       "https://ecdd-211-192-210-42.ngrok-free.app/"
               )  // 허용할 출처
//                .allowedOriginPatterns("*")  // 개발 환경에서는 모든 origin 허용
//                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                .allowedMethods("*")
//                .allowedHeaders("Authorization", "Content-Type", "X-Requested-With", "accept", "Origin", "Access-Control-Request-Method",
//                        "Access-Control-Request-Headers")  // JWT 관련 헤더 명시적 허용
                .allowedHeaders("*")  // JWT 관련 헤더 명시적 허용
                .exposedHeaders("*")  // 클라이언트가 읽을 수 있는 헤더 설정
                .allowCredentials(true)
                .maxAge(3600);
    }
}
