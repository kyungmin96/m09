package ssafy.m09.controller.manager;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import ssafy.m09.dto.common.ApiResponse;
import ssafy.m09.dto.request.CompanionRequest;
import ssafy.m09.service.CompanionService;

@RestController
@RequestMapping("/manager/companions")
@RequiredArgsConstructor
public class ManagerCompanionController {
    private final CompanionService companionService;

    @PostMapping
    public ApiResponse<?> addCompanion(@RequestBody CompanionRequest request) {
        return companionService.createCompanion(request);
    }

    @GetMapping("/task/{taskId}")
    public ApiResponse<?> getCompanionsByTaskId(@PathVariable int taskId) {
        return companionService.getCompanionsByTaskId(taskId);
    }

    @DeleteMapping("/{id}")
    public ApiResponse<?> deleteCompanion(@PathVariable int id) {
        return companionService.deleteCompanion(id);
    }
}
