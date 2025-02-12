package ssafy.m09.service;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import ssafy.m09.dto.response.VideoStreamingResponse;

@Service
@RequiredArgsConstructor
public class VideoStreamingService {

    @Value("${fastapi.server.url:http://localhost:8765}")
    private String fastapiServerUrl;

    private final RestTemplate restTemplate;

    public VideoStreamingResponse getStreamingUrl() {
        String url = fastapiServerUrl + "/api/v1/video-streaming";

        try {
            // FastAPI 서버로 GET 요청
            String streamingUrl = restTemplate.getForObject(url, String.class);

            return VideoStreamingResponse.builder()
                    .streamingUrl(streamingUrl)
                    .build();
        } catch (Exception e) {
            throw new RuntimeException("Failed to get streaming URL from FastAPI server", e);
        }
    }
}
