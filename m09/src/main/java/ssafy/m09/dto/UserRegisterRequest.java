package ssafy.m09.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UserRegisterRequest {
    private String password;
    private String name;
    private String cardKey;
}
