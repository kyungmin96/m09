package ssafy.m09.controller.member;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import ssafy.m09.dto.common.ApiResponse;
import ssafy.m09.service.UserService;

@RestController
@RequestMapping("/member/users")
@RequiredArgsConstructor
public class MemberUserController {
    private final UserService userService;

    @GetMapping("/members")
    public ApiResponse<?> getAllMembers() {
        return userService.getAllMemberEmployeeIdsAndNames();
    }
}
