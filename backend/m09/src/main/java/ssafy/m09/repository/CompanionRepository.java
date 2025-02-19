package ssafy.m09.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import ssafy.m09.domain.Companion;
import ssafy.m09.domain.Task;
import ssafy.m09.domain.User;

import java.util.List;

public interface CompanionRepository extends JpaRepository<Companion, Integer> {
    List<Companion> findAllByTaskId(int taskId);  // taskId로 Companion 조회
    List<Companion> findAllByUserId(int userId);  // userId로 Companion 조회
    boolean existsByTaskAndUser(Task task, User user);  // ✅ Task와 User가 이미 존재하는지 확인
}
