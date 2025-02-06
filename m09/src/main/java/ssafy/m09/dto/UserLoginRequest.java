package ssafy.m09.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UserLoginRequest {
    private String employeeId;
    private String password;
}
