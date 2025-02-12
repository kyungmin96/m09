package ssafy.m09.dto.request;

import lombok.Getter;
import lombok.Setter;
import ssafy.m09.domain.en.ToolCategory;

@Getter
@Setter
public class ReportRequest {
    private int taskId;
    private String content;
    private boolean isCompleted;
    private boolean isReport;
}
