package ssafy.m09.controller.member;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import ssafy.m09.dto.common.ApiResponse;
import ssafy.m09.service.AuthService;

@RestController
@RequestMapping("/member/auth")
@RequiredArgsConstructor
public class MemberAuthController {
    private final AuthService authService;

    @PostMapping("/logout")
    public ApiResponse<?> logout(@RequestHeader("Authorization") String token) {
        authService.logout(token.replace("Bearer ", ""));
        return ApiResponse.success(null, "로그아웃 성공");
    }

    @GetMapping("/me")
    public ApiResponse<?> me(@RequestHeader("Authorization") String token) {
        String jwtToken = token.replace("Bearer ", "");
        return authService.getUserByToken(jwtToken);
    }
}
