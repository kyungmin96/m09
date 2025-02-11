package ssafy.m09.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import ssafy.m09.domain.Tool;
import ssafy.m09.dto.common.ApiResponse;
import ssafy.m09.dto.request.ToolRequest;
import ssafy.m09.service.ToolService;

import java.util.List;
import java.util.Optional;

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
