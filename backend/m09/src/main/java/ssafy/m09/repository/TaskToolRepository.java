package ssafy.m09.repository;


import org.springframework.data.jpa.repository.JpaRepository;
import ssafy.m09.domain.Task;
import ssafy.m09.domain.TaskTool;
import ssafy.m09.domain.Tool;

import java.util.List;
import java.util.Optional;

public interface TaskToolRepository extends JpaRepository<TaskTool, Integer> {
    List<TaskTool> findByTaskId(int id);

    Optional<TaskTool> findByTaskAndTool(Task task, Tool tool);
}
