package ssafy.m09.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import ssafy.m09.domain.QueueManager;

import java.util.HashMap;
import java.util.Map;

@Service
public class Tool2EmbeddedService {
    private final RestTemplate restTemplate;
    private final QueueManager queueManager;
    private final ObjectMapper objectMapper = new ObjectMapper();

    public Tool2EmbeddedService(QueueManager queueManager) {
        this.queueManager = queueManager;
        this.restTemplate = new RestTemplate();
    }

    public void sendToolDetectionRequest() {
        String url = "http://localhost:8765/barebone/detect-09/start";

        String res = queueManager.getQueue("/tool").poll();
        System.out.println("임베디드로 보내는 값: " + res);

        try {
//            ResponseEntity<String> response = restTemplate.postForEntity(url, res, String.class);
//            System.out.println("임베디드 서버 응답: " + response.getBody());
            Map<String, Object> requestBody = objectMapper.readValue(res, HashMap.class);

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);

            HttpEntity<Map<String, Object>> entity = new HttpEntity<>(requestBody, headers);

            ResponseEntity<String> response = restTemplate.postForEntity(url, entity, String.class);
            System.out.println("✅ 임베디드 서버 응답: " + response.getBody());
        } catch (Exception e) {
            System.out.println("임베디드 서버 요청 실패: " + e.getMessage());
        }
    }
}
