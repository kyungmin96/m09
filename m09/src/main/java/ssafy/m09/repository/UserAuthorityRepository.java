package ssafy.m09.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import ssafy.m09.domain.UserAuthority;

public interface UserAuthorityRepository extends JpaRepository<UserAuthority, Integer> {
}
