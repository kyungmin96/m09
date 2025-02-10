package ssafy.m09.domain.en;

import org.springframework.security.core.GrantedAuthority;

public enum UserRole implements GrantedAuthority {
    ROLE_ADMIN("관리자", "최상위 관리자 권한"),
    ROLE_MANAGER("매니저", "관리자 권한"),
    ROLE_MEMBER("일반 사용자", "기본 사용자 권한");

    private final String displayName;
    private final String description;

    UserRole(String displayName, String description) {
        this.displayName = displayName;
        this.description = description;
    }

    @Override
    public String getAuthority() {
        return name(); // Spring Security는 name()을 권한 문자열로 사용
    }

    public String getDisplayName() {
        return displayName;
    }

    public String getDescription() {
        return description;
    }
}
