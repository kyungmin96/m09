package ssafy.m09.controller.manager;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import ssafy.m09.domain.TaskTool;
import ssafy.m09.dto.common.ApiResponse;
import ssafy.m09.dto.request.TaskToolRequest;
import ssafy.m09.service.TaskToolService;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/mangager/tasktools")
public class ManagerTaskToolController {
    private final TaskToolService taskToolService;

    // Create TaskTool
    @PostMapping
    public ApiResponse<TaskTool> createTaskTool(@RequestBody TaskToolRequest request) {
        return taskToolService.createTaskTool(request);
    }

    // Get TaskTool by ID
    @GetMapping("/{id}")
    public ApiResponse<TaskTool> getTaskToolById(@PathVariable int id) {
        return taskToolService.getTaskToolById(id);
    }

    // Get all TaskTools
    @GetMapping
    public ApiResponse<List<TaskTool>> getAllTaskTools() {
        return taskToolService.getAllTaskTool();
    }

    // Update TaskTool
    @PutMapping("/{id}")
    public ApiResponse<TaskTool> updateTaskTool(@PathVariable int id, @RequestBody TaskToolRequest request) {
        return taskToolService.updateTaskTool(id, request);
    }

    // Delete TaskTool
    @DeleteMapping("/{id}")
    public ApiResponse<String> deleteTaskTool(@PathVariable int id) {
        return taskToolService.deleteTaskToolById(id);
    }
}
