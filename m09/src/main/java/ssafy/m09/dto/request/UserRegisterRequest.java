package ssafy.m09.dto.request;

import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;
import ssafy.m09.domain.RFID;
import ssafy.m09.domain.User;
import ssafy.m09.domain.en.AuthorityPosition;

@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class UserRegisterRequest {
    private String name;
    private String password;
    private String cardKey;
    private AuthorityPosition position; // 추가

    // 생성자에 position 추가
    public UserRegisterRequest(String password, String name, String cardKey, AuthorityPosition position) {
        this.name = name;
        this.password = password;
        this.cardKey = cardKey;
        this.position = position;
    }

    public User toUser() {
        return User.builder()
                .name(this.name)
                .password(this.password)
                .position(this.position) // 추가
                .build();
    }

    public RFID toRFID(User user) {
        return RFID.builder()
                .user(user)
                .cardKey(this.cardKey != null ? this.cardKey : "")
                .build();
    }
}
