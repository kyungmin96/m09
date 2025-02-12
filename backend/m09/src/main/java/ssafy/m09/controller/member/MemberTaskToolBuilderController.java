package ssafy.m09.controller.member;

import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import ssafy.m09.dto.common.ApiResponse;
import ssafy.m09.service.TaskToolBuilderService;

@RestController
@RequestMapping("/member/taskbuilders")
@RequiredArgsConstructor
public class MemberTaskToolBuilderController {
    private final TaskToolBuilderService taskToolBuilderService;

    @GetMapping
    public ApiResponse<?> getAllTaskToolBuilders() {
        return taskToolBuilderService.getAllTaskToolBuilder();
    }

    @GetMapping("/{id}")
    public ApiResponse<?> getSingleTaskToolBuilder(@PathVariable("id") int id) {
        return taskToolBuilderService.getTaskToolBuilderById(id);
    }
}
