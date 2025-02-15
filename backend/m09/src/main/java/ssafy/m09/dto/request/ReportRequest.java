package ssafy.m09.dto.request;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Getter;
import lombok.Setter;
import ssafy.m09.domain.en.ToolCategory;

@Getter
@Setter
public class ReportRequest {
    private int taskId;
    private String content;
    @JsonProperty("isCompleted")
    private boolean isCompleted;
    @JsonProperty("isReport")
    private boolean isReport;
}
