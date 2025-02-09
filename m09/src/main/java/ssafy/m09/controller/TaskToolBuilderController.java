package ssafy.m09.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
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

    @PostMapping
    public ApiResponse<?> createTaskToolBuilder(@RequestBody TaskRequest taskRequest) {
        return taskToolBuilderService.createTaskToolBuilder(taskRequest);
    }

    @GetMapping
    public ApiResponse<?> getAllTaskToolBuilders() {
        return taskToolBuilderService.getAllTaskToolBuilder();
    }

    @GetMapping("/{id}")
    public ApiResponse<?> getSingleTaskToolBuilder(@PathVariable("id") int id) {
        return taskToolBuilderService.getTaskToolBuilderById(id);
    }

    @PutMapping("/{id}")
    public ApiResponse<?> updateTaskToolBuilder(@PathVariable("id") int id, @RequestBody TaskRequest taskRequest) {
        return taskToolBuilderService.updateTaskToolBuilder(id, taskRequest);
    }

    @DeleteMapping("/{id}")
    public ApiResponse<?> deleteTaskToolBuilder(@PathVariable("id") int id) {
        return taskToolBuilderService.deleteTaskToolBuilder(id);
    }
}
