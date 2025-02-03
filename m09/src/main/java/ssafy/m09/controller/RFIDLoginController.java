package ssafy.m09.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import ssafy.m09.domain.User;
import ssafy.m09.dto.RFIDLoginRequest;
import ssafy.m09.service.RFIDLoginService;

import java.util.Optional;

@RestController
@RequestMapping("/api/rfid")
@RequiredArgsConstructor
public class RFIDLoginController {

    private final RFIDLoginService rfidLoginService;

    @PostMapping("/login")
    public ResponseEntity<?> loginWithRFID(@RequestBody RFIDLoginRequest request) {
        String cardKey = request.getUid(); // JSON에서 UID 값을 추출
        Optional<User> user = rfidLoginService.loginWithRFID(cardKey);

        if (user.isPresent()) {
            return ResponseEntity.ok(user.get());
        } else {
            return ResponseEntity.status(401).body("Invalid RFID card");
        }
    }
}
