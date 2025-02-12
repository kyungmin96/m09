package ssafy.m09.service;

import org.springframework.http.HttpStatus;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import ssafy.m09.dto.common.ApiResponse;
import ssafy.m09.dto.request.VideoFrame;

import java.time.Instant;

@Service
public class VideoStreamService {
    private final SimpMessagingTemplate messagingTemplate;

    public VideoStreamService(SimpMessagingTemplate messagingTemplate) {
        this.messagingTemplate = messagingTemplate;
    }

    public ApiResponse<String> sendVideoFrame(String base64Image, boolean isUserCheck) {
        if (base64Image == null || base64Image.isEmpty()) {
            return ApiResponse.error(HttpStatus.BAD_REQUEST, "영상 프레임이 없습니다.");
        }

        VideoFrame frame = VideoFrame.builder()
                .isUserCheck(isUserCheck)
                .frame(base64Image)
                .timestamp(Instant.now().getEpochSecond())
                .build();

        // WebSocket으로 프레임 전송
        messagingTemplate.convertAndSend("/topic/video", frame);

        return ApiResponse.success("영상 프레임 전송 성공");
    }
}
