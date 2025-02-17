package ssafy.m09.dto.response;

import lombok.*;
import ssafy.m09.domain.Companion;
import ssafy.m09.domain.Task;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TodayTaskResponse {
    private int taskId;
    private String taskName;
    private List<String> employeeIds;
    private List<String> names;
}
