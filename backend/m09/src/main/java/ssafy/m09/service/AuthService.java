package ssafy.m09.service;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import ssafy.m09.domain.RFID;
import ssafy.m09.domain.User;
import ssafy.m09.dto.common.ApiResponse;
import ssafy.m09.dto.request.UserLoginRequest;
import ssafy.m09.dto.request.UserRegisterRequest;
import ssafy.m09.dto.response.UserLoginResponse;
import ssafy.m09.global.error.ErrorCode;
import ssafy.m09.repository.RFIDRepository;
import ssafy.m09.repository.UserRepository;
import ssafy.m09.security.JwtTokenProvider;

import java.util.*;

@Service
@RequiredArgsConstructor
public class AuthService {
    private final UserRepository userRepository;
    private final JwtTokenProvider jwtTokenProvider;
    private final RFIDRepository rfidRepository;
    private final PasswordEncoder passwordEncoder;
    private final Random random = new Random();
    private final Set<String> blacklist = new HashSet<>();

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
        }while(userRepository.existsByEmployeeId(employeeId));
        return employeeId;
    }

    public ApiResponse<UserLoginResponse> login(UserLoginRequest request) {
        Optional<User> userOptional = userRepository.findByEmployeeId(request.getEmployeeId());
        if(userOptional.isEmpty()){
            return ApiResponse.error(HttpStatus.NOT_FOUND, ErrorCode.USER_NOT_FOUND.getMessage(), ErrorCode.USER_NOT_FOUND.getCode());
        }

        User user = userOptional.get();
        // Changed from direct comparison to using passwordEncoder.matches()
        if(!passwordEncoder.matches(request.getPassword(), user.getPassword())){
            return ApiResponse.error(HttpStatus.UNAUTHORIZED, ErrorCode.INVALID_PASSWORD.getMessage(), ErrorCode.INVALID_PASSWORD.getCode());
        }

        String token = jwtTokenProvider.generateToken(user);

        UserLoginResponse userLoginResponse = new UserLoginResponse(token, user);
        return ApiResponse.success(userLoginResponse, "로그인 성공");
    }

    @Transactional
    public ApiResponse<User> registerUser(UserRegisterRequest request) {
        // 비밀번호 인코딩
        String encodedPassword = passwordEncoder.encode(request.getPassword());

        if(userRepository.existsByEmployeeId(request.toUser().getEmployeeId())){
            return ApiResponse.error(HttpStatus.CONFLICT, ErrorCode.USER_ALREADY_EXISTS.getMessage(), ErrorCode.USER_ALREADY_EXISTS.getCode());
        }
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

        return ApiResponse.success(user, "사용자 등록 성공");
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
        userRepository.save(user);

        return user;
    }

    // 직원 ID로 사용자 조회
    public ApiResponse<User> getUserByToken(String token) {
        String employeeId = jwtTokenProvider.getEmployeeId(token);  // 토큰에서 employeeId 추출

        if (isTokenBlacklisted(token)) {
            return ApiResponse.error(HttpStatus.BAD_REQUEST, ErrorCode.TOKEN_EXPIRED.getMessage(), ErrorCode.TOKEN_EXPIRED.getCode());
        }
        Optional<User> userOptional = userRepository.findByEmployeeId(employeeId);
        return userOptional.map(user -> ApiResponse.success(user, "사용자 조회 성공")).orElseGet(() -> ApiResponse.error(HttpStatus.NOT_FOUND, ErrorCode.USER_NOT_FOUND.getMessage(), ErrorCode.USER_NOT_FOUND.getCode()));
    }

    public ApiResponse<User> getUserByEmployeeId(String employeeId){
        Optional<User> userOptional = userRepository.findByEmployeeId(employeeId);
        return userOptional.map(user -> ApiResponse.success(user, "사용자 조회 성공")).orElseGet(() -> ApiResponse.error(HttpStatus.NOT_FOUND, ErrorCode.USER_NOT_FOUND.getMessage(), ErrorCode.USER_NOT_FOUND.getCode()));
    }

    // 로그아웃 = 블랙리스트에 토큰 추가
    public void logout(String token) {
        blacklist.add(token);
    }

    public boolean isTokenBlacklisted(String token) {
        return blacklist.contains(token);
    }
}
