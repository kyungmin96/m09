package ssafy.m09.controller.member;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import ssafy.m09.dto.common.ApiResponse;
import ssafy.m09.dto.response.VideoStreamingResponse;
import ssafy.m09.service.VideoStreamingService;

@RestController
@RequestMapping("/streaming")
@RequiredArgsConstructor
public class MemberVideoStreamingController {

    private final VideoStreamingService videoStreamingService;

    @GetMapping
    public ApiResponse<VideoStreamingResponse> getStreamingUrl() {
        VideoStreamingResponse response = videoStreamingService.getStreamingUrl();
        return ApiResponse.success(response, "Streaming URL retrieved successfully");
    }
}
