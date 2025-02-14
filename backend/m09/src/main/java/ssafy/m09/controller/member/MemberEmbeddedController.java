package ssafy.m09.controller.member;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import ssafy.m09.dto.common.ApiResponse;
import ssafy.m09.dto.request.DetectionStartRequest;
import ssafy.m09.dto.response.CameraStreamResponse;
import ssafy.m09.dto.response.DetectionCheckResponse;
import ssafy.m09.dto.response.DetectionStartResponse;
import ssafy.m09.service.EmbeddedService;
import ssafy.m09.service.HelmetCheckService;

@RestController
@RequestMapping("/embedded")
@RequiredArgsConstructor
public class MemberEmbeddedController {
    private final EmbeddedService embeddedService;
    private final HelmetCheckService helmetCheckService;

    // 헬멧 인식 시작
    @PostMapping("/detect/helmet-check/start")
    public ApiResponse<?> detectHelmet() {
        return helmetCheckService.startHelmetCheck();
    }

    // NFC 시작
    @PostMapping("/nfc/start")
    public ResponseEntity<String> startNfc() {
        return embeddedService.nfcStart();
    }

    // NFC 중지
    @PostMapping("/nfc/stop")
    public ResponseEntity<String> stopNfc() {
        return embeddedService.nfcStop();
    }

    // NFC 상태 확인 (Polling)
    @GetMapping("/nfc/status")
    public ResponseEntity<?> pollNfcStatus() {
        return embeddedService.pollRFIDKey();
    }

    // 수동 조작 정지
    @PostMapping("/manual-drive/stop")
    public ResponseEntity<String> manualDriveStop() {
        return embeddedService.manualDriveStop();
    }

    // 수동 조작 우 조향 조정
    @PostMapping("/manual-drive/right")
    public ResponseEntity<String> manualDriveRight() {
        return embeddedService.manualDriveRight();
    }

    // 수동 조작 좌 조향 조정
    @PostMapping("/manual-drive/left")
    public ResponseEntity<String> manualDriveLeft() {
        return embeddedService.manualDriveLeft();
    }

    // 수동 조작 전진
    @PostMapping("/manual-drive/forward")
    public ResponseEntity<String> manualDriveForward() {
        return embeddedService.manualDriveForward();
    }

    // 수동 조작 후진
    @PostMapping("/manual-drive/backward")
    public ResponseEntity<String> manualDriveBackward() {
        return embeddedService.manualDriveBackward();
    }
    
    // 추적 주행 시작
    @PostMapping("/drive/start")
    public ResponseEntity<String> driveStart() {
        return embeddedService.driveStart();
    }

    // 추적 주행 중지
    @PostMapping("/drive/stop")
    public ResponseEntity<String> driveStop() {
        return embeddedService.driveStop();
    }

    // 공구 인식 시작
    @PostMapping("/detect-09/start")
    public ResponseEntity<DetectionStartResponse> detectStart(@RequestBody DetectionStartRequest request) {
        return embeddedService.detectStart(request);
    }

    // 공구 인식 추적 (체크리스트)
    @PostMapping("/detect-09/check")
    public ResponseEntity<DetectionCheckResponse> detectCheck(@RequestBody DetectionStartRequest request) {
        return embeddedService.detectCheck(request);
    }

    // 공구 인식 종료
    @PostMapping("/detect-09/stop")
    public ResponseEntity<String> detectStop() {
        return embeddedService.detectStop();
    }

    // 필요시) 카메라 촬영 시작
    @PostMapping("/camera/start")
    public ResponseEntity<String> cameraStart() {
        return embeddedService.cameraStart();
    }

    // 필요시) 카메라 촬영 중지
    @PostMapping("/camera/stop")
    public ResponseEntity<String> cameraStop() {
        return embeddedService.cameraStop();
    }

    // 카메라 스트리밍 주소 요청
    @GetMapping("/camera/stream")
    public ResponseEntity<CameraStreamResponse> cameraStream() {
        return embeddedService.cameraStream();
    }
}
