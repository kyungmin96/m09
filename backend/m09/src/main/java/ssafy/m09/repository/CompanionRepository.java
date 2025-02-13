package ssafy.m09.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import ssafy.m09.domain.Companion;

import java.util.List;

public interface CompanionRepository extends JpaRepository<Companion, Integer> {
    List<Companion> findAllByTaskId(int taskId);  // taskId로 Companion 조회
    List<Companion> findAllByUserId(int userId);  // userId로 Companion 조회
}
