package ssafy.m09.dto.response;

import lombok.AllArgsConstructor;
import lombok.Getter;
import ssafy.m09.domain.User;

@Getter
@AllArgsConstructor
public class UserLoginResponse {
    private String token;
    private User user;
}
