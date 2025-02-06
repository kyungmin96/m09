package ssafy.m09.service;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import ssafy.m09.domain.RFID;
import ssafy.m09.domain.User;
import ssafy.m09.dto.UserLoginRequest;
import ssafy.m09.dto.UserRegisterRequest;
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

    public Optional<String> login(UserLoginRequest request)
    {
        Optional<User> userOptional = userRepository.findByEmployeeId(request.getEmployeeId());

        if(userOptional.isPresent()){
            User user = userOptional.get();

            if(user.getPassword().equals(request.getPassword())){
                String token = jwtTokenProvider.generateToken(user.getEmployeeId());
                return Optional.of(token);
            }
        }
        return Optional.empty();
    }

    @Transactional
    public void registerUser(UserRegisterRequest request)
    {
        User user = User.builder()
                .employeeId(generateEmployeeId())
                .password(request.getPassword())
                .name(request.getName())
                .isEnabled(true)
                .build();
        userRepository.save(user);

        RFID rfid = RFID.builder()
                .user(user)
                .cardKey(request.getCardKey())
                .build();
        rfidRepository.save(rfid);
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

    public Optional<User> getUserByEmployeeId(String employeeId){
        return userRepository.findByEmployeeId(employeeId);
    }
    public void logout(String token) {
        blacklist.add(token);
    }

    public boolean isTokenBlacklisted(String token) {
        return blacklist.contains(token);
    }
}
