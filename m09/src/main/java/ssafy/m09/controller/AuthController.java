package ssafy.m09.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import ssafy.m09.domain.User;
import ssafy.m09.dto.UserLoginRequest;
import ssafy.m09.dto.UserLoginResponse;
import ssafy.m09.security.JwtTokenProvider;
import ssafy.m09.service.AuthService;
import ssafy.m09.service.UserService;

import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {
    private final AuthService authService;
    private final JwtTokenProvider jwtTokenProvider;
    private final UserService userService;

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

    @GetMapping("/me")
    public ResponseEntity<?> me(@RequestHeader("Authorization") String token){
        String jwtToken = token.replace("Bearer ", "");
        if(authService.isTokenBlacklisted(jwtToken)){
            return ResponseEntity.status(401).body("Token is blacklisted");
        }

        String username = jwtTokenProvider.getUsername(jwtToken);
        Optional<User> userOptional = userService.getUserByUsername(username);

        return userOptional
                .map(user-> ResponseEntity.ok(user))
                .orElseGet(() -> ResponseEntity.status(404).build());
    }
}
