package ssafy.m09.service;

import lombok.RequiredArgsConstructor;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import ssafy.m09.dto.common.ApiResponse;
import ssafy.m09.dto.request.DetectionStartRequest;
import ssafy.m09.dto.response.CameraStreamResponse;
import ssafy.m09.dto.response.DetectionCheckResponse;
import ssafy.m09.dto.response.DetectionStartResponse;

@Service
@RequiredArgsConstructor
public class EmbeddedService {
    private final String EMBEDDED_API_URL = "http://embedded:8765/barebone";
//    private final String EMBEDDED_API_URL = "http://localhost:8765/barebone";
    private final RestTemplate restTemplate;

    public ResponseEntity<ApiResponse> helmetStart() {
        String url = EMBEDDED_API_URL + "/detect-helmet/start";
        return restTemplate.postForEntity(url, null, ApiResponse.class);
    }

    public ResponseEntity<ApiResponse> helmetStop() {
        String url = EMBEDDED_API_URL + "/detect-helmet/stop";
        return restTemplate.postForEntity(url, null, ApiResponse.class);
    }

    public ResponseEntity<String> nfcStart(){
        String url = EMBEDDED_API_URL + "/nfc/start";
        return restTemplate.postForEntity(url, null, String.class);
    }

    public ResponseEntity<String> nfcStop(){
        String url = EMBEDDED_API_URL + "/nfc/stop";
        return restTemplate.postForEntity(url, null, String.class);
    }

    public ResponseEntity<String> manualDriveStop() {
        String url = EMBEDDED_API_URL + "/manual-drive/stop";
        return restTemplate.postForEntity(url, null, String.class);
    }

    public ResponseEntity<String> manualDriveRight() {
        String url = EMBEDDED_API_URL + "/manual-drive/right";
        return restTemplate.postForEntity(url, null, String.class);
    }

    public ResponseEntity<String> manualDriveLeft() {
        String url = EMBEDDED_API_URL + "/manual-drive/left";
        return restTemplate.postForEntity(url, null, String.class);
    }

    public ResponseEntity<String> manualDriveForward() {
        String url = EMBEDDED_API_URL + "/manual-drive/forward";
        return restTemplate.postForEntity(url, null, String.class);
    }

    public ResponseEntity<String> manualDriveBackward() {
        String url = EMBEDDED_API_URL + "/manual-drive/backward";
        return restTemplate.postForEntity(url, null, String.class);
    }

    public ResponseEntity<String> driveStart() {
        String url = EMBEDDED_API_URL + "/drive/start";
        return restTemplate.postForEntity(url, null, String.class);
    }

    public ResponseEntity<String> driveStop() {
        String url = EMBEDDED_API_URL + "/drive/stop";
        return restTemplate.postForEntity(url, null, String.class);
    }

    public ResponseEntity<String> detectStop() {
        String url = EMBEDDED_API_URL + "/detect-09/stop";
        return restTemplate.postForEntity(url, null, String.class);
    }

    public ResponseEntity<String> cameraStop() {
        String url = EMBEDDED_API_URL + "/camera/stop";
        return restTemplate.postForEntity(url, null, String.class);
    }

    public ResponseEntity<String> cameraStart() {
        String url = EMBEDDED_API_URL + "/camera/start";
        return restTemplate.postForEntity(url, null, String.class);
    }

    public ResponseEntity<DetectionStartResponse> detectStart(DetectionStartRequest request) {
        String url = EMBEDDED_API_URL + "/detect-09/start";

        // JSON 데이터를 올바른 형식으로 변환
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        HttpEntity<DetectionStartRequest> entity = new HttpEntity<>(request, headers);

        return restTemplate.postForEntity(url, entity, DetectionStartResponse.class);
    }


    public ResponseEntity<CameraStreamResponse> cameraStream() {
        String url = EMBEDDED_API_URL + "/camera/stream";
        return restTemplate.getForEntity(url, CameraStreamResponse.class);
    }

    // 공구 인식 추적 (체크리스트)
    public ResponseEntity<DetectionCheckResponse> detectCheck(DetectionStartRequest request) {
        String url = EMBEDDED_API_URL + "/detect-09/check";
        DetectionCheckResponse previousResponse = null;

        while (true) {
            ResponseEntity<DetectionCheckResponse> response =
                    restTemplate.postForEntity(url, request, DetectionCheckResponse.class);
            DetectionCheckResponse currentResponse = response.getBody();

            if (currentResponse == null) continue;

            // 이전 응답과 비교하여 새로운 탐지가 있는지 확인
            if (currentResponse.hasNewDetection(previousResponse)) {
                // 새로운 탐지가 있으면 현재 상태를 응답
                return response;
            }

            // 모든 공구가 탐지되었는지 확인
            if (currentResponse.isAllDetected()) {
                // 모든 공구가 탐지되면 탐지 중지 요청
                detectStop();
                return response;
            }

            previousResponse = currentResponse;

            try {
                // 잠시 대기 후 다시 체크
                Thread.sleep(1000);
            } catch (InterruptedException e) {
                Thread.currentThread().interrupt();
                break;
            }
        }

        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
    }
}
