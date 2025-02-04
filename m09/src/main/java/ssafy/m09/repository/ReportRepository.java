package ssafy.m09.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import ssafy.m09.domain.Report;

public interface ReportRepository extends JpaRepository<Report, Integer> {
}
