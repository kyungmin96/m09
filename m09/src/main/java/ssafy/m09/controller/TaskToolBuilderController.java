package ssafy.m09.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import ssafy.m09.domain.TaskToolBuilder;
import ssafy.m09.dto.common.ApiResponse;
import ssafy.m09.dto.request.TaskRequest;
import ssafy.m09.service.TaskToolBuilderService;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/taskbuilders")
@RequiredArgsConstructor
public class TaskToolBuilderController {
    private final TaskToolBuilderService taskToolBuilderService;

    @PreAuthorize("hasRole('MANAGER')")
    @PostMapping
    public ApiResponse<?> createTaskToolBuilder(@RequestBody TaskRequest taskRequest) {
        return taskToolBuilderService.createTaskToolBuilder(taskRequest);
    }

    @PreAuthorize("hasRole('MEMBER')")
    @GetMapping
    public ApiResponse<?> getAllTaskToolBuilders() {
        return taskToolBuilderService.getAllTaskToolBuilder();
    }

    @PreAuthorize("hasRole('MEMBER')")
    @GetMapping("/{id}")
    public ApiResponse<?> getSingleTaskToolBuilder(@PathVariable("id") int id) {
        return taskToolBuilderService.getTaskToolBuilderById(id);
    }

    @PreAuthorize("hasRole('MANAGER')")
    @PutMapping("/{id}")
    public ApiResponse<?> updateTaskToolBuilder(@PathVariable("id") int id, @RequestBody TaskRequest taskRequest) {
        return taskToolBuilderService.updateTaskToolBuilder(id, taskRequest);
    }

    @PreAuthorize("hasRole('MANAGER')")
    @DeleteMapping("/{id}")
    public ApiResponse<?> deleteTaskToolBuilder(@PathVariable("id") int id) {
        return taskToolBuilderService.deleteTaskToolBuilder(id);
    }
}
