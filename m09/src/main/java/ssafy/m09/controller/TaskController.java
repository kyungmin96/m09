package ssafy.m09.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import ssafy.m09.domain.Task;
import ssafy.m09.dto.common.ApiResponse;
import ssafy.m09.dto.request.TaskRequest;
import ssafy.m09.service.TaskService;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/tasks")
@RequiredArgsConstructor
public class TaskController {
    private final TaskService taskService;

    @PostMapping("/posts")
    public ApiResponse<?> createTask(@RequestHeader("Authorization") String token, @RequestBody TaskRequest taskRequest) {
        return taskService.createTask(taskRequest);
    }

    @GetMapping("/posts")
    public ApiResponse<?> getAllTasks(@RequestHeader("Authorization") String token) {
        return taskService.getAllTasks();
    }

    @GetMapping("/posts/{id}")
    public ApiResponse<?> getSingleTaskById(@RequestHeader("Authorization") String token, @PathVariable int id) {
        return taskService.getTaskById(id);
    }

    @PutMapping("/posts/{id}")
    public ApiResponse<?> updateTask(@RequestHeader("Authorization") String token, @PathVariable int id, @RequestBody TaskRequest request) {
        return taskService.updateTask(id, request);
    }

    @DeleteMapping("/posts/{id}")
    public ApiResponse<?> deleteTask(@RequestHeader("Authorization") String token, @PathVariable int id) {
        return taskService.deleteTaskById(id);
    }
}
