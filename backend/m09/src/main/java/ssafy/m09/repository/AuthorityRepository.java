package ssafy.m09.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import ssafy.m09.domain.Authority;

import java.util.List;

public interface AuthorityRepository extends JpaRepository<Authority, Integer> {
}
