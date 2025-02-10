package ssafy.m09.dto.common;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;
import ssafy.m09.domain.en.AuthorityPosition;

@Getter
@Setter
@Builder
public class UserDto {
    private String employeeId;
    private String name;
    private AuthorityPosition position;
    private boolean isEnabled;
}
