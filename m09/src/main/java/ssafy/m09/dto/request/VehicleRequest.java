package ssafy.m09.dto.request;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class VehicleRequest {
    private String name;
    private boolean isUsing; // 사용 가능 여부
    private boolean isCharging; // 충전 여부
}
