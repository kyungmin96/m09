package ssafy.m09.controller.manager;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import ssafy.m09.dto.common.ApiResponse;
import ssafy.m09.dto.request.TaskRequest;
import ssafy.m09.service.TaskService;

@RestController
@RequestMapping("/manager/tasks")
@RequiredArgsConstructor
public class ManagerTaskController {
    private final TaskService taskService;

    @PostMapping("/posts")
    public ApiResponse<?> createTask(@RequestHeader("Authorization") String token, @RequestBody TaskRequest request) {
        return taskService.createTask(request);
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
