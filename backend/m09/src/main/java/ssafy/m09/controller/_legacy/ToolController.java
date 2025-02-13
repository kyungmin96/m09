package ssafy.m09.controller._legacy;

import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import ssafy.m09.dto.common.ApiResponse;
import ssafy.m09.dto.request.ToolRequest;
import ssafy.m09.service.ToolService;

@RestController
@RequestMapping("/tools")
@RequiredArgsConstructor
public class ToolController {
    private final ToolService toolService;

    @PreAuthorize("hasRole('MANAGER')")
    @PostMapping
    public ApiResponse<?> createTool(@RequestBody ToolRequest request) {
        return toolService.createTool(request);
    }

    @PreAuthorize("hasRole('MEMBER')")
    @GetMapping("/{id}")
    public ApiResponse<?> getToolById(@PathVariable int id) {
        return toolService.getToolById(id);
    }

    @PreAuthorize("hasRole('MEMBER')")
    @GetMapping
    public ApiResponse<?> getAllTools() {
        return toolService.getAllTools();
    }

    @PreAuthorize("hasRole('MANAGER')")
    @PutMapping("/{id}")
    public ApiResponse<?> updateToolById(@PathVariable int id, @RequestBody ToolRequest request) {
        return toolService.updateTool(id, request);
    }
}
