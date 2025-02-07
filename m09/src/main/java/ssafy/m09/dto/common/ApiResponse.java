package ssafy.m09.dto.common;

import lombok.Getter;
import lombok.Setter;
import org.springframework.http.HttpStatus;

@Getter
@Setter
public class ApiResponse<T> {
    private HttpStatus status;      // HTTP 상태 코드
    private int statusCode;         // 상태 코드 숫자 값
    private boolean success;        // 요청 성공 여부
    private String message;         // 응답 메시지
    private String errorCode;       // 특정 에러 코드 (옵셔널)
    private T data;                 // 응답 데이터

    // 기본 생성자
    public ApiResponse() {}

    // 성공 응답 생성자
    public static <T> ApiResponse<T> success(T data) {
        ApiResponse<T> response = new ApiResponse<>();
        response.setSuccess(true);
        response.setStatus(HttpStatus.OK);
        response.setStatusCode(HttpStatus.OK.value());
        response.setMessage("Request successful");
        response.setData(data);
        return response;
    }

    // 성공 응답 생성자 (커스텀 메시지)
    public static <T> ApiResponse<T> success(T data, String message) {
        ApiResponse<T> response = success(data);
        response.setMessage(message);
        return response;
    }

    // 에러 응답 생성자
    public static <T> ApiResponse<T> error(HttpStatus status, String message) {
        ApiResponse<T> response = new ApiResponse<>();
        response.setSuccess(false);
        response.setStatus(status);
        response.setStatusCode(status.value());
        response.setMessage(message);
        return response;
    }

    // 에러 응답 생성자 (에러 코드 포함)
    public static <T> ApiResponse<T> error(HttpStatus status, String message, String errorCode) {
        ApiResponse<T> response = error(status, message);
        response.setErrorCode(errorCode);
        return response;
    }
}
