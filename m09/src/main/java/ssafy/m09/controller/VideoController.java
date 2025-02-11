package ssafy.m09.controller;

import org.springframework.web.bind.annotation.*;
import lombok.RequiredArgsConstructor;
import ssafy.m09.dto.common.ApiResponse;
import ssafy.m09.service.VideoStreamService;

@RestController
@RequestMapping("/video")
@RequiredArgsConstructor
public class VideoController {
    private final VideoStreamService videoStreamService;

    @PostMapping("/send")
    public ApiResponse<String> sendVideo(@RequestParam("frame") String base64Image, @RequestParam("H") boolean isUserCheck) {
        return videoStreamService.sendVideoFrame(base64Image, isUserCheck);
    }
}


