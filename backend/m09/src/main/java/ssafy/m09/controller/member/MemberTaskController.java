package ssafy.m09.controller.member;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;
import ssafy.m09.dto.common.ApiResponse;
import ssafy.m09.dto.request.TaskEndRequest;
import ssafy.m09.service.TaskService;

import java.util.List;

@Slf4j
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
        log.info("Request received for in-process tasks");
        log.info("Authorization header: {}", token);
        return taskService.getInProcessTasks(token);
    }

    @GetMapping("/posts/today")
    public ApiResponse<?> getTodaySelectedTasks(@RequestHeader("Authorization") String token)
    {
        return taskService.getTodaySelectedTasks(token);
    }

    @PostMapping("/update-end")
    public ApiResponse<String> updateEndTask(@RequestBody List<TaskEndRequest> requests) {
        return taskService.updateEndTask(requests);
    }
}
