package ssafy.m09.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import ssafy.m09.domain.Report;
import ssafy.m09.domain.en.TaskStatus;

import java.util.List;

public interface ReportRepository extends JpaRepository<Report, Integer> {
    List<Report> findAllByTaskId(int taskId);
    List<Report> findByTaskTaskStateInAndIsCompletedFalseAndIsReportTrue(List<TaskStatus> completed);
}
