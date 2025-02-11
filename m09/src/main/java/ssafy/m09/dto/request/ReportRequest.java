package ssafy.m09.dto.request;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ReportRequest {
    private int taskId;
    private String content;
}
