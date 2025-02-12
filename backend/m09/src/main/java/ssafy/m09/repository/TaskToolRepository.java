package ssafy.m09.repository;


import org.springframework.data.jpa.repository.JpaRepository;
import ssafy.m09.domain.TaskTool;

public interface TaskToolRepository extends JpaRepository<TaskTool, Integer> {
}
