package ssafy.m09.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import ssafy.m09.domain.Tool;

import java.util.Collection;

public interface ToolRepository extends JpaRepository<Tool, Integer> {
    Collection<Object> findByName(String toolName);
}
