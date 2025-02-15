package ssafy.m09.service;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import ssafy.m09.domain.User;
import ssafy.m09.domain.en.UserRole;
import ssafy.m09.dto.common.ApiResponse;
import ssafy.m09.repository.UserRepository;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UserService {
    private final UserRepository userRepository;

    // member 작업자들 전체 조회
    public ApiResponse<Map<String, List<String>>> getAllMemberEmployeeIdsAndNames() {
        List<User> members = userRepository.findAllByPositionAndIsEnabled(UserRole.ROLE_MEMBER, true);

        if (members.isEmpty()) {
            return ApiResponse.error(HttpStatus.NOT_FOUND, "ROLE_MEMBER 권한을 가진 사용자가 없습니다.");
        }

        // employeeId와 name을 각각의 List로 추출
        List<String> employeeIds = members.stream()
                .map(User::getEmployeeId)
                .collect(Collectors.toList());

        List<String> names = members.stream()
                .map(User::getName)
                .collect(Collectors.toList());

        // Map으로 반환 데이터 구성
        Map<String, List<String>> responseData = new HashMap<>();
        responseData.put("employeeIds", employeeIds);
        responseData.put("names", names);

        return ApiResponse.success(responseData, "ROLE_MEMBER 사용자 employeeId 및 name 조회 성공");
    }

}
