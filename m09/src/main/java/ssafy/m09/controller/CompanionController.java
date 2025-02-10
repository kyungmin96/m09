package ssafy.m09.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import ssafy.m09.dto.common.ApiResponse;
import ssafy.m09.dto.request.CompanionRequest;
import ssafy.m09.service.CompanionService;

@RestController
@RequestMapping("/companions")
@RequiredArgsConstructor
public class CompanionController {
    private final CompanionService companionService;

    // Companion 등록
    @PostMapping
    public ApiResponse<?> addCompanion(@RequestBody CompanionRequest request) {
        return companionService.createCompanion(request);
    }

    // 특정 Companion 조회
    @GetMapping("/{id}")
    public ApiResponse<?> getCompanionById(@PathVariable int id) {
        return companionService.getCompanionById(id);
    }

    // taskId로 Companion 조회
    @GetMapping("/task/{taskId}")
    public ApiResponse<?> getCompanionsByTaskId(@PathVariable int taskId) {
        return companionService.getCompanionsByTaskId(taskId);
    }

    // userId로 Companion 조회
    @GetMapping("/user/{userId}")
    public ApiResponse<?> getCompanionsByUserId(@PathVariable int userId) {
        return companionService.getCompanionsByUserId(userId);
    }

    // Companion 삭제
    @DeleteMapping("/{id}")
    public ApiResponse<?> deleteCompanion(@PathVariable int id) {
        return companionService.deleteCompanion(id);
    }
}
