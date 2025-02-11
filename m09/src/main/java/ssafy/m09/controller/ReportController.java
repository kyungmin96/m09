package ssafy.m09.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import ssafy.m09.dto.common.ApiResponse;
import ssafy.m09.dto.request.ReportRequest;
import ssafy.m09.service.ReportService;

@RestController
@RequestMapping("/reports")
@RequiredArgsConstructor
public class ReportController {
    private final ReportService reportService;

    @PreAuthorize("hasRole('MEMBER')")
    @PostMapping
    public ApiResponse<?> createReport(@RequestBody ReportRequest request) {
        return reportService.createReport(request);
    }

    @PreAuthorize("hasRole('MEMBER')")
    @PostMapping("/task/{taskId}")
    public ApiResponse<?> createReportByTaskId(@PathVariable int taskId, @RequestBody ReportRequest request) {
        return reportService.createReportByTaskId(taskId, request);
    }

    @PreAuthorize("hasRole('MEMBER')")
    @GetMapping("/{id}")
    public ApiResponse<?> getReportById(@PathVariable int id) {
        return reportService.getReportById(id);
    }

    @PreAuthorize("hasRole('MEMBER')")
    @GetMapping("/task/{taskId}")
    public ApiResponse<?> getReportsByTaskId(@PathVariable int taskId) {
        return reportService.getReportsByTaskId(taskId);
    }

    @PreAuthorize("hasRole('MANAGER')")
    @DeleteMapping("/{id}")
    public ApiResponse<?> deleteReport(@PathVariable int id) {
        return reportService.deleteReport(id);
    }

    @PreAuthorize("hasRole('MEMBER')")
    @PutMapping("/{id}")
    public ApiResponse<?> updateReport(@PathVariable int id, @RequestBody ReportRequest request) {
        return reportService.updateReport(id, request);
    }
}
