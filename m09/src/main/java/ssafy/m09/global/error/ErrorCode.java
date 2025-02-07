package ssafy.m09.global.error;

import lombok.Getter;
import org.springframework.http.HttpStatus;

@Getter
public enum ErrorCode {
    // 공통 시스템 에러
    INTERNAL_SERVER_ERROR("S001", "서버 내부 오류가 발생했습니다.", HttpStatus.INTERNAL_SERVER_ERROR),
    BAD_REQUEST("S002", "잘못된 요청입니다.", HttpStatus.BAD_REQUEST),
    UNAUTHORIZED("S003", "인증되지 않은 사용자입니다.", HttpStatus.UNAUTHORIZED),
    FORBIDDEN("S004", "접근 권한이 없습니다.", HttpStatus.FORBIDDEN),

    // 사용자(User) 관련 에러
    USER_NOT_FOUND("U001", "사용자를 찾을 수 없습니다.", HttpStatus.NOT_FOUND),
    USER_ALREADY_EXISTS("U002", "이미 존재하는 사용자입니다.", HttpStatus.CONFLICT),
    INVALID_PASSWORD("U003", "잘못된 비밀번호입니다.", HttpStatus.UNAUTHORIZED),
    INVALID_USERNAME("U004", "유효하지 않은 사용자 이름입니다.", HttpStatus.BAD_REQUEST),

    // 인증(Authentication) 관련 에러
    INVALID_TOKEN("A001", "유효하지 않은 토큰입니다.", HttpStatus.UNAUTHORIZED),
    TOKEN_EXPIRED("A002", "만료된 토큰입니다.", HttpStatus.UNAUTHORIZED),
    INSUFFICIENT_PERMISSION("A003", "권한이 부족합니다.", HttpStatus.FORBIDDEN),

    // 데이터 검증 에러
    VALIDATION_ERROR("V001", "데이터 검증에 실패했습니다.", HttpStatus.BAD_REQUEST),
    INVALID_INPUT_VALUE("V002", "잘못된 입력값입니다.", HttpStatus.BAD_REQUEST),

    // 리소스 관련 에러
    RESOURCE_NOT_FOUND("R001", "요청한 리소스를 찾을 수 없습니다.", HttpStatus.NOT_FOUND),
    RESOURCE_ALREADY_EXISTS("R002", "이미 존재하는 리소스입니다.", HttpStatus.CONFLICT),

    // 외부 서비스 관련 에러
    EXTERNAL_SERVICE_ERROR("E001", "외부 서비스 호출에 실패했습니다.", HttpStatus.INTERNAL_SERVER_ERROR);

    private final String code;
    private final String message;
    private final HttpStatus httpStatus;

    ErrorCode(String code, String message, HttpStatus httpStatus) {
        this.code = code;
        this.message = message;
        this.httpStatus = httpStatus;
    }

    // 선택적으로 에러 코드로 ErrorCode 찾는 메서드 추가 가능
    public static ErrorCode findByCode(String code) {
        for (ErrorCode errorCode : values()) {
            if (errorCode.code.equals(code)) {
                return errorCode;
            }
        }
        return INTERNAL_SERVER_ERROR;
    }
}
