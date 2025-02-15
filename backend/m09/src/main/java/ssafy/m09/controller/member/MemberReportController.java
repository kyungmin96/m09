package ssafy.m09.controller.member;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import ssafy.m09.dto.common.ApiResponse;
import ssafy.m09.dto.request.ReportRequest;
import ssafy.m09.service.ReportService;

@RestController
@RequestMapping("/member/reports")
@RequiredArgsConstructor
public class MemberReportController {
    private final ReportService reportService;

    @PostMapping
    public ApiResponse<?> createReport(@RequestBody ReportRequest request) {
        return reportService.createReport(request);
    }

    @PostMapping("/task/{taskId}")
    public ApiResponse<?> createReportByTaskId(@PathVariable int taskId, @RequestBody ReportRequest request) {
        return reportService.createReportByTaskId(taskId, request);
    }

    @GetMapping("/{id}")
    public ApiResponse<?> getReportById(@PathVariable int id) {
        return reportService.getReportById(id);
    }

    @GetMapping("/task/{taskId}")
    public ApiResponse<?> getReportsByTaskId(@PathVariable int taskId) {
        return reportService.getReportsByTaskId(taskId);
    }
    @GetMapping("/completed")
    public ApiResponse<?> getReportsForCompletedTasks() {
        return reportService.getReportsForAllCompletedOrDelayedTasks();
    }

    @PutMapping("{id}/is-completed")
    public ApiResponse<?> updateIsCompleted(@PathVariable int id) {
        return reportService.updateIsCompleted(id);
    }

    @PutMapping("/{id}")
    public ApiResponse<?> updateReport(@PathVariable int id, @RequestBody ReportRequest request) {
        return reportService.updateReport(id, request);
    }
}
