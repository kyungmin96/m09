package ssafy.m09.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import ssafy.m09.domain.User;
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
    public ResponseEntity<?> login(@RequestBody UserLoginRequest request)
    {
        Optional<String> token = authService.login(request);

        if(token.isPresent()){
            return ResponseEntity.ok(new UserLoginResponse(token.get()));
        }else {
            return ResponseEntity.status(401).body("Invalid Login information!!!");
        }
    }

    @PostMapping("/logout")
    public ResponseEntity<?> logout(@RequestHeader("Authorization") String token) {
        authService.logout(token.replace("Bearer ", ""));
        return ResponseEntity.ok().build();
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody UserRegisterRequest request) {
        // User로 받으면 보안 취약점 생길 수 있음, DTO로 받은 다음 쓰는게 낫다
        try{
            authService.registerUser(request);
            return ResponseEntity.ok("User registered successfully!!!");
        }catch (Exception e){
            return ResponseEntity.status(500).body("ERR during registeration: " + e.getMessage());
        }
    }

    @GetMapping("/me")
    public ResponseEntity<?> me(@RequestHeader("Authorization") String token){
        String jwtToken = token.replace("Bearer ", "");
        if(authService.isTokenBlacklisted(jwtToken)){
            return ResponseEntity.status(401).body("Token is blacklisted");
        }

        String employeeId = jwtTokenProvider.getUsername(jwtToken);
        Optional<User> userOptional = authService.getUserByEmployeeId(employeeId);

        return userOptional
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.status(404).build());
    }
}
