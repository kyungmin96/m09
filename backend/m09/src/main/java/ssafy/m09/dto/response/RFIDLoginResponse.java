package ssafy.m09.dto.response;

import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
public class RFIDLoginResponse {
    private String uid;  // 감지된 RFID 카드의 UID 값
    private boolean detected;  // 현재 RFID 카드가 감지되었는지 여부

    public RFIDLoginResponse(String uid, boolean detected) {
        this.uid = uid;
        this.detected = detected;
    }

    public RFIDLoginResponse() {}

    // UID가 이전 값과 다른지 확인하는 메서드
    public boolean isNewDetection(RFIDLoginResponse previousResponse) {
        return previousResponse == null || !this.uid.equals(previousResponse.getUid());
    }
}
