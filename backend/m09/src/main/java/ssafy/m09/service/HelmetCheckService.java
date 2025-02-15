package ssafy.m09.service;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import ssafy.m09.dto.common.ApiResponse;

import java.util.HashMap;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class HelmetCheckService {
    public ApiResponse<Map<String, Object>> startHelmetCheck() {
        String embeddedUrl = "http://embedded-device-address/start-check";  // 임베디드 URL

        try {
            // RestTemplate을 사용해 HTTP 요청 전송
            RestTemplate restTemplate = new RestTemplate();
            ResponseEntity<Map> response = restTemplate.postForEntity(embeddedUrl, null, Map.class);

            if (response.getStatusCode() == HttpStatus.OK) {
                Map<String, Object> responseBody = response.getBody();
                boolean isUniformCorrect = (boolean) responseBody.get("H");
                String imageData = (String) responseBody.get("image");

                // 결과 반환
                Map<String, Object> result = new HashMap<>();
                result.put("isUniformCorrect", isUniformCorrect);
                result.put("imageData", imageData);

                return ApiResponse.success(result, "복장 검사 결과 반환 성공");
            } else {
                return ApiResponse.error(HttpStatus.INTERNAL_SERVER_ERROR, "임베디드에서 검사 결과를 가져오지 못했습니다.");
            }
        } catch (Exception e) {
            return ApiResponse.error(HttpStatus.INTERNAL_SERVER_ERROR, "임베디드 통신 오류: " + e.getMessage());
        }
    }
}
