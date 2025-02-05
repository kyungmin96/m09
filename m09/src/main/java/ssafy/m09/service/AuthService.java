package ssafy.m09.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import ssafy.m09.domain.User;
import ssafy.m09.dto.UserLoginRequest;
import ssafy.m09.repository.UserRepository;
import ssafy.m09.security.JwtTokenProvider;

import java.util.HashSet;
import java.util.Optional;
import java.util.Set;

@Service
@RequiredArgsConstructor
public class AuthService {
    private final UserRepository userRepository;
    private final JwtTokenProvider jwtTokenProvider;
    private final Set<String> blacklist = new HashSet<>();

    public Optional<String> login(UserLoginRequest request)
    {
        Optional<User> userOptional = userRepository.findByUsername(request.getUsername());

        if(userOptional.isPresent()){
            User user = userOptional.get();

            if(user.getPassword().equals(request.getPassword())){
                String token = jwtTokenProvider.generateToken(user.getUsername());
                return Optional.of(token);
            }
        }
        return Optional.empty();
    }

    public void logout(String token) {
        blacklist.add(token);
    }

    public boolean isTokenBlacklisted(String token) {
        return blacklist.contains(token);
    }
}
