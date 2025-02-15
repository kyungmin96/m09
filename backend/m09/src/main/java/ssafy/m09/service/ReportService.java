package ssafy.m09.service;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import ssafy.m09.domain.Report;
import ssafy.m09.domain.Task;
import ssafy.m09.domain.en.TaskStatus;
import ssafy.m09.dto.common.ApiResponse;
import ssafy.m09.dto.request.ReportRequest;
import ssafy.m09.repository.ReportRepository;
import ssafy.m09.repository.TaskRepository;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class ReportService {
    private final ReportRepository reportRepository;
    private final TaskRepository taskRepository;

    @Transactional
    public ApiResponse<Report> createReport(ReportRequest request) {
        Optional<Task> taskOptional = taskRepository.findById(request.getTaskId());
        if (taskOptional.isEmpty()) {
            return ApiResponse.error(HttpStatus.NOT_FOUND, "해당 작업(Task)을 찾을 수 없습니다.");
        }

        Report report = Report.builder()
                .task(taskOptional.get())
                .content(request.getContent())
                .isReport(request.isReport())
                .isCompleted(false)
                .build();

        Report savedReport = reportRepository.save(report);
        return ApiResponse.success(savedReport, "보고서 생성 성공");
    }

    @Transactional
    public ApiResponse<Report> createReportByTaskId(int taskId, ReportRequest request) {
        Optional<Task> taskOptional = taskRepository.findById(taskId);
        if (taskOptional.isEmpty()) {
            return ApiResponse.error(HttpStatus.NOT_FOUND, "해당 작업(Task)을 찾을 수 없습니다.");
        }

        if (request.getContent() == null || request.getContent().isEmpty()) {
            return ApiResponse.error(HttpStatus.NOT_FOUND, "보고 내용은 필수 입력 항목입니다.");
        }

        Report report = Report.builder()
                .task(taskOptional.get())
                .content(request.getContent())
                .isReport(request.isReport())
                .isCompleted(false)
                .build();

        Report savedReport = reportRepository.save(report);
        return ApiResponse.success(savedReport, "taskId로 보고서 생성 성공");
    }

    // 특정 보고서 조회
    public ApiResponse<Report> getReportById(int id) {
        return reportRepository.findById(id)
                .map(report -> ApiResponse.success(report, "보고서 조회 성공"))
                .orElse(ApiResponse.error(HttpStatus.NOT_FOUND, "보고서를 찾을 수 없습니다."));
    }

    // 작업별 보고서 목록 조회
    public ApiResponse<List<Report>> getReportsByTaskId(int taskId) {
        List<Report> reports = reportRepository.findAllByTaskId(taskId);
        if (reports.isEmpty()) {
            return ApiResponse.error(HttpStatus.NOT_FOUND, "해당 작업에 대한 보고서가 없습니다.");
        }
        return ApiResponse.success(reports, "작업에 대한 보고서 목록 조회 성공");
    }

    @Transactional
    public ApiResponse<List<Report>> getReportsForAllCompletedOrDelayedTasks() {
        // COMPLETED 또는 DELAYED 상태의 모든 Task에 해당하는 보고서 조회
        List<Report> reports = reportRepository.findByTaskTaskStateInAndIsCompletedFalseAndIsReportTrue(
                List.of(TaskStatus.COMPLETED, TaskStatus.DELAYED)
        );

        if (reports.isEmpty()) {
            return ApiResponse.error(HttpStatus.NOT_FOUND, "조건에 맞는 보고서가 없습니다.");
        }

        return ApiResponse.success(reports, "조건에 맞는 보고서 전체 조회 성공");
    }

    @Transactional
    public ApiResponse<Report> updateIsCompleted(int reportId) {
        Optional<Report> reportOptional = reportRepository.findById(reportId);
        if (reportOptional.isEmpty()) {
            return ApiResponse.error(HttpStatus.NOT_FOUND, "해당 보고서를 찾을 수 없습니다.");
        }

        Report report = reportOptional.get();
        report.setCompleted(true);  // isCompleted 상태만 업데이트
        Report updatedReport = reportRepository.save(report);

        return ApiResponse.success(updatedReport, "isCompleted 상태가 성공적으로 업데이트되었습니다.");
    }

    // 보고서 수정
    @Transactional
    public ApiResponse<Report> updateReport(int id, ReportRequest request) {
        return reportRepository.findById(id)
                .map(report -> {
                    report.setContent(request.getContent());
                    report.setCompleted(request.isCompleted());
                    report.setReport(request.isReport());
                    Report updatedReport = reportRepository.save(report);
                    return ApiResponse.success(updatedReport, "보고서 수정 성공");
                })
                .orElse(ApiResponse.error(HttpStatus.NOT_FOUND, "보고서를 찾을 수 없습니다."));
    }

    // 보고서 삭제
    @Transactional
    public ApiResponse<String> deleteReport(int id) {
        if (reportRepository.existsById(id)) {
            reportRepository.deleteById(id);
            return ApiResponse.success(null, "보고서 삭제 성공");
        }
        return ApiResponse.error(HttpStatus.NOT_FOUND, "보고서를 찾을 수 없습니다.");
    }
}
