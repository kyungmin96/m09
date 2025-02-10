package ssafy.m09.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import ssafy.m09.dto.request.RFIDLoginRequest;
import ssafy.m09.service.RFIDLoginService;

@RestController
@RequestMapping("/api/rfid")
@RequiredArgsConstructor
public class RFIDLoginController {

    private final RFIDLoginService rfidLoginService;

    @PostMapping("/login")
    public ResponseEntity<String> login(@RequestBody RFIDLoginRequest request) {
        if (request.getUid() == null || request.getUid().trim().isEmpty()) {
            return ResponseEntity.badRequest().body("Invalid UID received.");
        }
        System.out.println(request.getUid());
        System.out.println(rfidLoginService.loginWithRFID(request.getUid()));
        return ResponseEntity.ok("Login Success: " + request.getUid());
    }
}
