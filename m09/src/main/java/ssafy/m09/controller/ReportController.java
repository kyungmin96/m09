package ssafy.m09.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import ssafy.m09.dto.common.ApiResponse;
import ssafy.m09.dto.request.ReportRequest;
import ssafy.m09.service.ReportService;

@RestController
@RequestMapping("/reports")
@RequiredArgsConstructor
public class ReportController {
    private final ReportService reportService;

    // 보고서 등록
    @PostMapping
    public ApiResponse<?> createReport(@RequestBody ReportRequest request) {
        return reportService.createReport(request);
    }

    // taskId로 보고서 생성
    @PostMapping("/task/{taskId}")
    public ApiResponse<?> createReportByTaskId(@PathVariable int taskId, @RequestBody ReportRequest request) {
        return reportService.createReportByTaskId(taskId, request);
    }

    // 특정 보고서 조회
    @GetMapping("/{id}")
    public ApiResponse<?> getReportById(@PathVariable int id) {
        return reportService.getReportById(id);
    }

    // 작업별 보고서 목록 조회
    @GetMapping("/task/{taskId}")
    public ApiResponse<?> getReportsByTaskId(@PathVariable int taskId) {
        return reportService.getReportsByTaskId(taskId);
    }

    // 보고서 수정
    @PutMapping("/{id}")
    public ApiResponse<?> updateReport(@PathVariable int id, @RequestBody ReportRequest request) {
        return reportService.updateReport(id, request);
    }

    // 보고서 삭제
    @DeleteMapping("/{id}")
    public ApiResponse<?> deleteReport(@PathVariable int id) {
        return reportService.deleteReport(id);
    }
}
