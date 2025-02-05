package ssafy.m09.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import ssafy.m09.domain.TaskBuilder;

public interface TaskBuilderRepository extends JpaRepository<TaskBuilder, Integer> {
}
