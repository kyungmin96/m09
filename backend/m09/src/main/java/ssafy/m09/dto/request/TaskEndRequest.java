package ssafy.m09.dto.request;

import lombok.Getter;
import lombok.Setter;
import ssafy.m09.domain.en.TaskStatus;

@Getter
@Setter
public class TaskEndRequest {
    private int taskId;
    private TaskStatus taskStatus;
}
