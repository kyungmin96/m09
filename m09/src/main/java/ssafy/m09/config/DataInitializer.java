package ssafy.m09.config;

import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;
import ssafy.m09.domain.RFID;
import ssafy.m09.domain.User;
import ssafy.m09.repository.RFIDRepository;
import ssafy.m09.repository.UserRepository;

import java.time.LocalDateTime;

@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final RFIDRepository rfidRepository;

    @Override
    public void run(String... args) {
        // 이미 존재하는 유저인지 확인
        if (userRepository.findByUsername("testuser").isEmpty()) {
            User user = User.builder()
                    .username("testuser")
                    .password("password123") // 실제 사용 시 비밀번호 암호화 필요
                    .name("Test User")
                    .is_enabled(true)
                    .created_at(LocalDateTime.now())
                    .build();
            userRepository.save(user);

            RFID rfid = RFID.builder()
                    .user(user)
                    .cardKey("0xd30x470xc20xbd") // RFID 카드 키 설정
                    .created_at(LocalDateTime.now())
                    .build();
            rfidRepository.save(rfid);

            System.out.println("✅ 초기 데이터 삽입 완료: testuser, RFID(0xd30x470xc20xbd)");
        }
    }
}
