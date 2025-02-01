package ssafy.m09.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import ssafy.m09.domain.Companions;

public interface CompanionsRepository extends JpaRepository<Companions, Integer> {
}
