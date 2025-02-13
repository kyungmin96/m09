package ssafy.m09.dto.request;

import lombok.Getter;
import lombok.Setter;
import ssafy.m09.domain.en.TaskStatus;
import ssafy.m09.domain.User;
import ssafy.m09.domain.Vehicle;

import java.time.LocalDateTime;

@Getter
@Setter
public class TaskRequest {
    private String title;
    private String content;
    private String comment;
    private String location;
    private String employeeId;
    private Vehicle vehicle;
    private LocalDateTime scheduledStartTime;
    private LocalDateTime scheduledEndTime;
    private LocalDateTime startTime;
    private LocalDateTime endTime;
    private TaskStatus taskState;
    private LocalDateTime updatedAt;
}
