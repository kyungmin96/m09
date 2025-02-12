package ssafy.m09.controller._legacy;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import ssafy.m09.dto.common.ApiResponse;
import ssafy.m09.dto.request.RFIDLoginRequest;
import ssafy.m09.service.RFIDLoginService;

@RestController
@RequestMapping("/rfid")
@RequiredArgsConstructor
public class RFIDLoginController {

    private final RFIDLoginService rfidLoginService;

    // 토큰 포함해야함 추후 작업 예정
    @PostMapping("/login")
    public ApiResponse<?> loginWithRFID(@RequestBody RFIDLoginRequest request) {
        return rfidLoginService.loginWithRFID(request);
    }
}
