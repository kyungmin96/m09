package ssafy.m09.controller._legacy;

import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import ssafy.m09.dto.common.ApiResponse;
import ssafy.m09.dto.request.TaskRequest;
import ssafy.m09.service.TaskService;

@RestController
@RequestMapping("/tasks")
@RequiredArgsConstructor
public class TaskController {
    private final TaskService taskService;

    @PreAuthorize("hasRole('MANAGER')")
    @PostMapping("/posts")
    public ApiResponse<?> createTask(@RequestHeader("Authorization") String token, @RequestBody TaskRequest taskRequest) {
        return taskService.createTask(taskRequest);
    }

    @PreAuthorize("hasRole('MEMBER')")
    @GetMapping("/posts")
    public ApiResponse<?> getAllTasks(@RequestHeader("Authorization") String token) {
        return taskService.getAllTasks();
    }

    @PreAuthorize("hasRole('MEMBER')")
    @GetMapping("/posts/{id}")
    public ApiResponse<?> getSingleTaskById(@RequestHeader("Authorization") String token, @PathVariable int id) {
        return taskService.getTaskById(id);
    }

    @PreAuthorize("hasRole('MEMBER')")
    @GetMapping("/posts/in-process")
    public ApiResponse<?> getInProcessTasks(@RequestHeader("Authorization") String token) {
        return taskService.getInProcessTasks();
    }

    @PreAuthorize("hasRole('MANAGER')")
    @PutMapping("/posts/{id}")
    public ApiResponse<?> updateTask(@RequestHeader("Authorization") String token, @PathVariable int id, @RequestBody TaskRequest request) {
        return taskService.updateTask(id, request);
    }

    @PreAuthorize("hasRole('MANAGER')")
    @DeleteMapping("/posts/{id}")
    public ApiResponse<?> deleteTask(@RequestHeader("Authorization") String token, @PathVariable int id) {
        return taskService.deleteTaskById(id);
    }
}
