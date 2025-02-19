package ssafy.m09.dto.request;

import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.Map;

@Getter
@NoArgsConstructor
public class DetectionStartRequest {
    private List<String> name;
//    private Map<String, Boolean> tools;
}
