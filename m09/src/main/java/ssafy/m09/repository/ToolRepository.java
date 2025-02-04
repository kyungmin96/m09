package ssafy.m09.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import ssafy.m09.domain.Tool;

public interface ToolRepository extends JpaRepository<Tool, Integer> {
}
