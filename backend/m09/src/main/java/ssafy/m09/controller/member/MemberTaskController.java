package ssafy.m09.controller.member;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import ssafy.m09.dto.common.ApiResponse;
import ssafy.m09.service.TaskService;

@RestController
@RequestMapping("/member/tasks")
@RequiredArgsConstructor
public class MemberTaskController {
    private final TaskService taskService;

    @GetMapping("/posts")
    public ApiResponse<?> getAllTasks(@RequestHeader("Authorization") String token) {
        return taskService.getAllTasks();
    }

    @GetMapping("/posts/{id}")
    public ApiResponse<?> getTaskById(@RequestHeader("Authorization") String token, @PathVariable int id) {
        return taskService.getTaskById(id);
    }

    @GetMapping("/posts/in-process")
    public ApiResponse<?> getInProcessTasks(@RequestHeader("Authorization") String token) {
        return taskService.getInProcessTasks(token);
    }
}
