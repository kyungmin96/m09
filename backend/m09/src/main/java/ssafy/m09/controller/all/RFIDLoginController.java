package ssafy.m09.controller.all;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import ssafy.m09.dto.common.ApiResponse;
import ssafy.m09.dto.request.RFIDLoginRequest;
import ssafy.m09.service.RFIDLoginService;

@RestController
@RequestMapping("/all/rfid")
@RequiredArgsConstructor
public class RFIDLoginController {
    private final RFIDLoginService rfidLoginService;

    @PostMapping("/login")
    public ApiResponse<?> loginWithRFID(@RequestBody RFIDLoginRequest request) {
        return rfidLoginService.loginWithRFID(request);
    }
}
