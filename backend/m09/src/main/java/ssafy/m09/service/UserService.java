package ssafy.m09.service;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import ssafy.m09.domain.User;
import ssafy.m09.dto.common.ApiResponse;
import ssafy.m09.repository.UserRepository;

import java.util.List;

@Service
@RequiredArgsConstructor
public class UserService {
    private final UserRepository userRepository;

    // member 작업자들 전체 조회
    public ApiResponse<List<User>> getAllMembers() {
        List<User> members = userRepository.findAllByPosition("ROLE_MEMBER");

        if (members.isEmpty()) {
            return ApiResponse.error(HttpStatus.NOT_FOUND, "ROLE_MEMBER 권한을 가진 사용자가 없습니다.");
        }

        return ApiResponse.success(members, "ROLE_MEMBER 사용자 조회 성공");
    }
}
