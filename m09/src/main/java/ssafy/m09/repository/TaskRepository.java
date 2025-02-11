package ssafy.m09.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import ssafy.m09.domain.Task;
import ssafy.m09.domain.en.TaskStatus;

import java.time.LocalDateTime;
import java.util.List;

public interface TaskRepository extends JpaRepository<Task, Integer> {
    List<Task> findByAssignedUserId(int employeeId);

    Task getTaskById(int id);

    List<Task> findByStartTimeBeforeAndTaskStateIn(LocalDateTime now, List<TaskStatus> start);
}
