package ssafy.m09.repository;


import org.springframework.data.jpa.repository.JpaRepository;
import ssafy.m09.domain.TaskTools;

public interface TaskToolsRepository extends JpaRepository<TaskTools, Integer> {
}
