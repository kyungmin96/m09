package ssafy.m09.dto.request;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class VideoFrame {
    private boolean isUserCheck; // 복장 입었는지
    private String frame;
    private long timestamp;
}
