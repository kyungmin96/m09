package ssafy.m09.dto.request;

import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;
import ssafy.m09.domain.RFID;
import ssafy.m09.domain.User;

@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class UserRegisterRequest {
    private String password;
    private String name;

    private String cardKey;

    public UserRegisterRequest(String password, String name, String cardKey) {
        this.password = password;
        this.name = name;
        this.cardKey = cardKey;
    }

    public User toUser() {
        return User.builder()
                .password(this.password)
                .name(this.name)
                .build();
    }

    public RFID toRFID(User user) {
        System.out.println("cardKey value: " + this.cardKey);
        return RFID.builder()
                .user(user)
                .cardKey(this.cardKey)
                .build();
    }
}