package ssafy.m09.controller.manager;

import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import ssafy.m09.dto.common.ApiResponse;
import ssafy.m09.dto.request.TaskRequest;
import ssafy.m09.service.TaskToolBuilderService;

@RestController
@RequestMapping("/manager/taskbuilders")
@RequiredArgsConstructor
public class ManagerTaskToolBuilderController {
    private final TaskToolBuilderService taskToolBuilderService;

    @PostMapping
    public ApiResponse<?> createTaskToolBuilder(@RequestBody TaskRequest taskRequest) {
        return taskToolBuilderService.createTaskToolBuilder(taskRequest);
    }

    @PutMapping("/{id}")
    public ApiResponse<?> updateTaskToolBuilder(@PathVariable("id") int id, @RequestBody TaskRequest taskRequest) {
        return taskToolBuilderService.updateTaskToolBuilder(id, taskRequest);
    }

    @PutMapping("/{taskToolBuilderId}/pdf/{pdfId}")
    public ApiResponse<?> updatePDFForTaskToolBuilder(
            @PathVariable int taskToolBuilderId,
            @PathVariable int pdfId) {
        return taskToolBuilderService.updatePDFForTaskToolBuilder(taskToolBuilderId, pdfId);
    }

    @DeleteMapping("/{id}")
    public ApiResponse<?> deleteTaskToolBuilder(@PathVariable("id") int id) {
        return taskToolBuilderService.deleteTaskToolBuilder(id);
    }
}
