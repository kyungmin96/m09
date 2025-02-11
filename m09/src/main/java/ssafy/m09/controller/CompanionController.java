package ssafy.m09.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import ssafy.m09.dto.common.ApiResponse;
import ssafy.m09.dto.request.CompanionRequest;
import ssafy.m09.service.CompanionService;

@RestController
@RequestMapping("/companions")
@RequiredArgsConstructor
public class CompanionController {
    private final CompanionService companionService;

    @PreAuthorize("hasRole('MANAGER')")
    @PostMapping
    public ApiResponse<?> addCompanion(@RequestBody CompanionRequest request) {
        return companionService.createCompanion(request);
    }

    @PreAuthorize("hasRole('MANAGER')")
    @GetMapping("/{id}")
    public ApiResponse<?> getCompanionById(@PathVariable int id) {
        return companionService.getCompanionById(id);
    }

    @PreAuthorize("hasRole('MEMBER')")
    @GetMapping("/task/{taskId}")
    public ApiResponse<?> getCompanionsByTaskId(@PathVariable int taskId) {
        return companionService.getCompanionsByTaskId(taskId);
    }

    @PreAuthorize("hasRole('MEMBER')")
    @GetMapping("/user/{userId}")
    public ApiResponse<?> getCompanionsByUserId(@PathVariable int userId) {
        return companionService.getCompanionsByUserId(userId);
    }

    @PreAuthorize("hasRole('MANAGER')")
    @DeleteMapping("/{id}")
    public ApiResponse<?> deleteCompanion(@PathVariable int id) {
        return companionService.deleteCompanion(id);
    }
}
