package ssafy.m09.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import ssafy.m09.domain.User;
import ssafy.m09.domain.en.UserRole;

import java.util.List;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Integer> {
    Optional<User> findByEmployeeId(String employeeId);
    boolean existsByEmployeeId(String employeeId);
    List<User> findAllByPosition(UserRole position);
}
