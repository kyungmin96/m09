package ssafy.m09.controller.member;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import ssafy.m09.dto.common.ApiResponse;
import ssafy.m09.service.ToolService;

@RestController
@RequestMapping("/member/tools")
@RequiredArgsConstructor
public class MemberToolController {
    private final ToolService toolService;

    @GetMapping("/{id}")
    public ApiResponse<?> getToolById(@PathVariable int id) {
        return toolService.getToolById(id);
    }

    @GetMapping
    public ApiResponse<?> getAllTools() {
        return toolService.getAllTools();
    }
}
