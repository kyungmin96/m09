package ssafy.m09.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import ssafy.m09.domain.Task;

public interface TaskRepository extends JpaRepository<Task, Integer> {
}
