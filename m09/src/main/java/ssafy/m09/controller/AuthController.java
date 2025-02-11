package ssafy.m09.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import ssafy.m09.domain.User;
import ssafy.m09.dto.common.ApiResponse;
import ssafy.m09.dto.request.UserLoginRequest;
import ssafy.m09.dto.response.UserLoginResponse;
import ssafy.m09.dto.request.UserRegisterRequest;
import ssafy.m09.security.JwtTokenProvider;
import ssafy.m09.service.AuthService;

import java.util.Optional;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {
    private final AuthService authService;
    private final JwtTokenProvider jwtTokenProvider;

    @PostMapping("/login")
    public ApiResponse<?> login(@RequestBody UserLoginRequest request) {
        return authService.login(request);
    }

    @PreAuthorize("hasRole('MEMBER')")
    @PostMapping("/logout")
    public ApiResponse<?> logout(@RequestHeader("Authorization") String token) {
        authService.logout(token.replace("Bearer ", ""));
        return ApiResponse.success(null, "로그아웃 성공");
    }

    @PostMapping("/register")
    public ApiResponse<?> register(@RequestBody UserRegisterRequest request) {
        return authService.registerUser(request);
    }

    @GetMapping("/me")
    public ApiResponse<?> me(@RequestHeader("Authorization") String token) {
        String jwtToken = token.replace("Bearer ", "");

        return authService.getUserByToken(jwtToken);
    }
}
