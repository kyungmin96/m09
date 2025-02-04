package ssafy.m09.dto;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonProperty;

public class RFIDLoginRequest {

    private String uid;

    // 기본 생성자 (필수)
    public RFIDLoginRequest() {}

    // JSON 매핑을 위한 생성자
    @JsonCreator
    public RFIDLoginRequest(@JsonProperty("UID") String uid) {
        this.uid = uid;
    }

    public String getUid() {
        return uid;
    }

    public void setUid(String uid) {
        this.uid = uid;
    }
}
