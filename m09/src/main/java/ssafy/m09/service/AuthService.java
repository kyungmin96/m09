package ssafy.m09.service;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import ssafy.m09.domain.RFID;
import ssafy.m09.domain.User;
import ssafy.m09.dto.request.UserLoginRequest;
import ssafy.m09.dto.request.UserRegisterRequest;
import ssafy.m09.repository.RFIDRepository;
import ssafy.m09.repository.UserRepository;
import ssafy.m09.security.JwtTokenProvider;

import java.util.Optional;
import java.util.Random;

@Service
@RequiredArgsConstructor
public class AuthService {
    private final UserRepository userRepository;
    private final JwtTokenProvider jwtTokenProvider;
    private final RFIDRepository rfidRepository;
    private final PasswordEncoder passwordEncoder;
    private final Random random = new Random();

    // 랜덤 직원 ID 생성 메서드
    private String generateRandomId() {
        int randomNum = 1000000 + random.nextInt(9000000);
        return String.valueOf(randomNum);
    }

    // 중복되지 않는 직원 ID 생성
    public String generateEmployeeId() {
        String employeeId;
        do {
            employeeId = generateRandomId();
        } while (userRepository.existsByEmployeeId(employeeId));
        return employeeId;
    }

    // 로그인 메서드 - 비밀번호 인코딩 검증 추가
    public Optional<String> login(UserLoginRequest request) {
        Optional<User> userOptional = userRepository.findByEmployeeId(request.getEmployeeId());

        return userOptional
                .filter(user -> passwordEncoder.matches(request.getPassword(), user.getPassword()))
                .map(user -> {
                    // 토큰 생성 시 User 객체 전달
                    String token = jwtTokenProvider.generateToken(user);
                    return Optional.of(token);
                })
                .orElse(Optional.empty());
    }

    // 사용자 등록 메서드 - 비밀번호 인코딩 추가
    @Transactional
    public void registerUser(UserRegisterRequest request) {
        // 비밀번호 인코딩
        String encodedPassword = passwordEncoder.encode(request.getPassword());

        User user = User.builder()
                .employeeId(generateEmployeeId())
                .password(encodedPassword)  // 인코딩된 비밀번호 저장
                .name(request.getName())
                .isEnabled(true)
                .position(request.getPosition())  // AuthorityPosition 추가
                .build();
        userRepository.save(user);

        // RFID 생성 (선택적)
        RFID rfid = RFID.builder()
                .user(user)
                .cardKey(request.getCardKey() != null ? request.getCardKey() : "")
                .build();
        rfidRepository.save(rfid);
    }

    // 임시 사용자 등록 (비밀번호 인코딩 포함)
    @Transactional
    public User registerTempUser(UserRegisterRequest request) {
        String encodedPassword = passwordEncoder.encode(request.getPassword());

        User user = User.builder()
                .employeeId(generateEmployeeId())
                .password(encodedPassword)
                .name(request.getName())
                .isEnabled(true)
                .position(request.getPosition())
                .build();

        return userRepository.save(user);
    }

    // 직원 ID로 사용자 조회
    public Optional<User> getUserByEmployeeId(String employeeId) {
        return userRepository.findByEmployeeId(employeeId);
    }
}
