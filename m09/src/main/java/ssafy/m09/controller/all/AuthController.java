package ssafy.m09.controller.all;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import ssafy.m09.dto.common.ApiResponse;
import ssafy.m09.dto.request.UserLoginRequest;
import ssafy.m09.dto.request.UserRegisterRequest;
import ssafy.m09.service.AuthService;

@RestController
@RequestMapping("/all/auth")
@RequiredArgsConstructor
public class AuthController {
    private final AuthService authService;

    @PostMapping("/login")
    public ApiResponse<?> login(@RequestBody UserLoginRequest request) {
        return authService.login(request);
    }

    @PostMapping("/register")
    public ApiResponse<?> register(@RequestBody UserRegisterRequest request) {
        return authService.registerUser(request);
    }
}
