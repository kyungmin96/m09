package ssafy.m09.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import ssafy.m09.domain.Notice;

public interface NoticeRepository extends JpaRepository<Notice, Integer> {
}
