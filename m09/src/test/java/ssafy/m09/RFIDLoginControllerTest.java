package ssafy.m09;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.test.context.junit.jupiter.SpringExtension;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.http.MediaType;
import ssafy.m09.controller.RFIDLoginController;
import ssafy.m09.domain.User;
import ssafy.m09.service.RFIDLoginService;

import java.util.Optional;

import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@ExtendWith(SpringExtension.class)
@WebMvcTest(RFIDLoginController.class)
class RFIDLoginControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean // 🔹 RFIDLoginService를 MockBean으로 등록
    private RFIDLoginService rfidLoginService;

    @Test
    void testLoginWithValidRFID() throws Exception {
        // 테스트 유저 생성
        User testUser = User.builder()
                .id(1)
                .username("testUser")
                .name("Test User")
                .is_enabled(true)
                .build();

        // Mock 동작 설정: RFID가 존재할 때
        when(rfidLoginService.loginWithRFID("123456789ABC")).thenReturn(Optional.of(testUser));

        // RFID 로그인 API 테스트
        mockMvc.perform(post("/api/rfid/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"UID\": \"123456789ABC\"}"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.username").value("testUser"));

        // `rfidLoginService.loginWithRFID()` 메서드가 1번 호출되었는지 검증
        verify(rfidLoginService, times(1)).loginWithRFID("123456789ABC");
    }

    @Test
    void testLoginWithInvalidRFID() throws Exception {
        // Mock 동작 설정: RFID가 존재하지 않을 때
        when(rfidLoginService.loginWithRFID("INVALID_KEY")).thenReturn(Optional.empty());

        // RFID 로그인 API 테스트
        mockMvc.perform(post("/api/rfid/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"UID\": \"INVALID_KEY\"}"))
                .andExpect(status().isUnauthorized())
                .andExpect(content().string("Invalid RFID card"));

        // `rfidLoginService.loginWithRFID()` 메서드가 1번 호출되었는지 검증
        verify(rfidLoginService, times(1)).loginWithRFID("INVALID_KEY");
    }
}
