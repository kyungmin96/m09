package ssafy.m09.service;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import ssafy.m09.domain.RFID;
import ssafy.m09.domain.User;
import ssafy.m09.dto.common.ApiResponse;
import ssafy.m09.dto.request.UserLoginRequest;
import ssafy.m09.dto.request.UserRegisterRequest;
import ssafy.m09.global.error.ErrorCode;
import ssafy.m09.repository.RFIDRepository;
import ssafy.m09.repository.UserRepository;
import ssafy.m09.security.JwtTokenProvider;

import java.util.HashSet;
import java.util.Optional;
import java.util.Random;
import java.util.Set;

@Service
@RequiredArgsConstructor
public class AuthService {
    private final UserRepository userRepository;
    private final JwtTokenProvider jwtTokenProvider;
    private final RFIDRepository rfidRepository;
    private final Random random = new Random();
    private final Set<String> blacklist = new HashSet<>();

    private String generateRandomId(){
        int randomNum = 1000000 + random.nextInt(9000000);
        return String.valueOf(randomNum);
    }

    public String generateEmployeeId(){
        String employeeId = generateRandomId();
        do{
            employeeId = generateRandomId();
        }while(userRepository.existsByEmployeeId(employeeId));
        return employeeId;
    }

    public ApiResponse<String> login(UserLoginRequest request)
    {
        Optional<User> userOptional = userRepository.findByEmployeeId(request.getEmployeeId());
        if(userOptional.isEmpty()){
            return ApiResponse.error(HttpStatus.NOT_FOUND, ErrorCode.USER_NOT_FOUND.getMessage(), ErrorCode.USER_NOT_FOUND.getCode());
        }

        User user = userOptional.get();
        if(!user.getPassword().equals(request.getPassword())){
            return ApiResponse.error(HttpStatus.UNAUTHORIZED, ErrorCode.INVALID_PASSWORD.getMessage(), ErrorCode.INVALID_PASSWORD.getCode());
        }

        String token = jwtTokenProvider.generateToken((user.getEmployeeId()));
        return ApiResponse.success(token, "로그인 성공");
    }

    @Transactional
    public ApiResponse<String> registerUser(UserRegisterRequest request)
    {
        if(userRepository.existsByEmployeeId(request.toUser().getEmployeeId())){
            return ApiResponse.error(HttpStatus.CONFLICT, ErrorCode.USER_ALREADY_EXISTS.getMessage(), ErrorCode.USER_ALREADY_EXISTS.getCode());
        }
        User user = User.builder()
                .employeeId(generateEmployeeId())
                .password(request.getPassword())
                .name(request.getName())
                .isEnabled(true)
                .build();
        userRepository.save(user);

        RFID rfid = RFID.builder()
                .user(user)
                .cardKey(request.getCardKey() != null ? request.getCardKey() : "")
                .build();
        rfidRepository.save(rfid);

        return ApiResponse.success(null, "사용자 등록 성공");
    }

    @Transactional
    public User registerTempUser(UserRegisterRequest request)
    {
        User user = User.builder()
                .employeeId(generateEmployeeId())
                .password(request.getPassword())
                .name(request.getName())
                .isEnabled(true)
                .build();
        userRepository.save(user);

        return user;
    }

    public ApiResponse<User> getUserByToken(String token) {
        String employeeId = jwtTokenProvider.getEmployeeId(token);  // 토큰에서 employeeId 추출

        if(isTokenBlacklisted(token)){
            return ApiResponse.error(HttpStatus.BAD_REQUEST, ErrorCode.TOKEN_EXPIRED.getMessage(), ErrorCode.TOKEN_EXPIRED.getCode());
        }

        Optional<User> userOptional = userRepository.findByEmployeeId(employeeId);
        if (userOptional.isEmpty()) {
            return ApiResponse.error(HttpStatus.NOT_FOUND, ErrorCode.USER_NOT_FOUND.getMessage(), ErrorCode.USER_NOT_FOUND.getCode());
        }
        return ApiResponse.success(userOptional.get(), "사용자 조회 성공");
    }

    public ApiResponse<User> getUserByEmployeeId(String employeeId){
        Optional<User> userOptional = userRepository.findByEmployeeId(employeeId);
        if(userOptional.isEmpty()){
            return ApiResponse.error(HttpStatus.NOT_FOUND, ErrorCode.USER_NOT_FOUND.getMessage(), ErrorCode.USER_NOT_FOUND.getCode());
        }
        return ApiResponse.success(userOptional.get(), "사용자 조회 성공");
    }

    // 로그아웃 = 블랙리스트에 토큰 추가
    public void logout(String token) {
        blacklist.add(token);
    }

    public boolean isTokenBlacklisted(String token) {
        return blacklist.contains(token);
    }
}
