package ssafy.m09.dto.request;

import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.List;

@Getter
@NoArgsConstructor
public class DetectionStartRequest {
    private List<String> name;
}
