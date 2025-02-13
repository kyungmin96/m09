package ssafy.m09.dto.response;

import lombok.Getter;
import lombok.NoArgsConstructor;
import java.util.Map;

@Getter
@NoArgsConstructor
public class DetectionCheckResponse {
    private Map<String, Boolean> data;

    public boolean isAllDetected() {
        return data.values().stream().allMatch(value -> value);
    }

    public boolean hasNewDetection(DetectionCheckResponse previousResponse) {
        if (previousResponse == null) return false;

        for (Map.Entry<String, Boolean> entry : data.entrySet()) {
            String tool = entry.getKey();
            Boolean currentValue = entry.getValue();
            Boolean previousValue = previousResponse.getData().get(tool);

            if (Boolean.TRUE.equals(currentValue) && Boolean.FALSE.equals(previousValue)) {
                return true;
            }
        }
        return false;
    }
}
