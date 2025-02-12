package ssafy.m09.controller.manager;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import ssafy.m09.dto.common.ApiResponse;
import ssafy.m09.dto.request.ToolRequest;
import ssafy.m09.service.ToolService;

@RestController
@RequestMapping("/manager/tools")
@RequiredArgsConstructor
public class ManagerToolController {
    private final ToolService toolService;

    @PostMapping
    public ApiResponse<?> createTool(@RequestBody ToolRequest request) {
        return toolService.createTool(request);
    }

    @PutMapping("/{id}")
    public ApiResponse<?> updateToolById(@PathVariable int id, @RequestBody ToolRequest request) {
        return toolService.updateTool(id, request);
    }
}
