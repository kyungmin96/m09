package ssafy.m09.service;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import ssafy.m09.domain.RFID;
import ssafy.m09.domain.User;
import ssafy.m09.dto.UserRegisterRequest;
import ssafy.m09.repository.RFIDRepository;
import ssafy.m09.repository.UserRepository;

@Service
@RequiredArgsConstructor
public class UserService {
    private final UserRepository userRepository;
    private final RFIDRepository rfidRepository;

    @Transactional
    public User registerUser(UserRegisterRequest request)
    {
        User user = User.builder()
                .username(request.getUsername())
                .password(request.getPassword())
                .name(request.getName())
                .is_enabled(true)
                .build();
        userRepository.save(user);

        RFID rfid = RFID.builder()
                .user(user)
                .cardKey(request.getCardKey())
                .build();
        rfidRepository.save(rfid);

        return user;
    }
}
