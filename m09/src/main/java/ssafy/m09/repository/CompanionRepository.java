package ssafy.m09.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import ssafy.m09.domain.Companion;

public interface CompanionRepository extends JpaRepository<Companion, Integer> {
}
