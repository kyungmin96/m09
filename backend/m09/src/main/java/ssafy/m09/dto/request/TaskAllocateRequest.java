package ssafy.m09.dto.request;

import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Setter
@Getter
public class TaskAllocateRequest {
    private int taskId;
    private List<String> employeeIds;
}
