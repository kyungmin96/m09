package ssafy.m09.dto.request;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UserLoginRequest {
    private String employeeId;
    private String password;
}
