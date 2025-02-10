package ssafy.m09.dto.request;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class VehicleUsageLogRequest {
    private int userId;
    private int taskId;
}
