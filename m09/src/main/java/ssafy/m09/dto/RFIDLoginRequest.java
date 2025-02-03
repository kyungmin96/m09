package ssafy.m09.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class RFIDLoginRequest {
    @JsonProperty("UID")
    private String uid;
}
