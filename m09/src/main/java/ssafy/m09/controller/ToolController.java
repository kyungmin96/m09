package ssafy.m09.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import ssafy.m09.domain.Tool;
import ssafy.m09.dto.request.ToolRequest;
import ssafy.m09.service.ToolService;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/tools")
@RequiredArgsConstructor
public class ToolController {
    private final ToolService toolService;

    @PostMapping
    public ResponseEntity<Tool> createTool(@RequestBody ToolRequest request){
        Tool tool = toolService.createTool(request);
        return new ResponseEntity<>(tool, HttpStatus.CREATED);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Tool> getToolById(@PathVariable int id){
        Optional<Tool> tool = toolService.getToolById(id);
        return new ResponseEntity<>(tool.orElse(null), HttpStatus.OK);
    }

    @GetMapping
    public ResponseEntity<List<Tool>> getAllTools(){
        List<Tool> tools = toolService.getAllTools();
        return new ResponseEntity<>(tools, HttpStatus.OK);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Tool> updateToolById(@PathVariable int id, @RequestBody ToolRequest request){
        Optional<Tool> updatedTool = toolService.updateTool(id, request);
        return new ResponseEntity<>(updatedTool.orElse(null), HttpStatus.OK);
    }
}
