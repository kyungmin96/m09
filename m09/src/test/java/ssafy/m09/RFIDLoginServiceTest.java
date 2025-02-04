package ssafy.m09;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import ssafy.m09.domain.RFID;
import ssafy.m09.domain.User;
import ssafy.m09.repository.RFIDRepository;
import ssafy.m09.service.RFIDLoginService;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class RFIDLoginServiceTest {

    @Mock
    private RFIDRepository rfidRepository; // 가짜 객체(Mock)

    @InjectMocks
    private RFIDLoginService rfidLoginService; // 실제 서비스

    private User testUser;
    private RFID testRFID;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);

        // 테스트 유저 생성
        testUser = User.builder()
                .id(1)
                .username("testUser")
                .name("Test User")
                .password("password123")
                .is_enabled(true)
                .build();

        // 테스트 RFID 카드 생성
        testRFID = RFID.builder()
                .id(1)
                .cardKey("123456789ABC")
                .user(testUser)
                .build();
    }

    @Test
    void testLoginWithValidRFID() {
        // 가짜 데이터 설정: `findByCardKey("123456789ABC")` 호출 시 `testRFID` 반환
        when(rfidRepository.findByCardKey("123456789ABC")).thenReturn(Optional.of(testRFID));

        // RFID 로그인 서비스 실행
        Optional<User> result = rfidLoginService.loginWithRFID("123456789ABC");

        // 결과 검증
        assertTrue(result.isPresent());
        assertEquals(testUser.getUsername(), result.get().getUsername());

        // `findByCardKey()` 메서드가 한 번 호출되었는지 확인
        verify(rfidRepository, times(1)).findByCardKey("123456789ABC");
    }

    @Test
    void testLoginWithInvalidRFID() {
        // 가짜 데이터 설정: 존재하지 않는 RFID 카드 키에 대해 `Optional.empty()` 반환
        when(rfidRepository.findByCardKey("INVALID_KEY")).thenReturn(Optional.empty());

        // RFID 로그인 서비스 실행
        Optional<User> result = rfidLoginService.loginWithRFID("INVALID_KEY");

        // 결과 검증
        assertFalse(result.isPresent());

        // `findByCardKey()` 메서드가 한 번 호출되었는지 확인
        verify(rfidRepository, times(1)).findByCardKey("INVALID_KEY");
    }
}
