package ssafy.m09.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class VideoStreamingResponse {
    private String streamingUrl;  // FastAPI 서버에서 반환하는 스트리밍 URL
}
