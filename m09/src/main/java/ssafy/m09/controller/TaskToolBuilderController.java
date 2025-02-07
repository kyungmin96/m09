package ssafy.m09.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import ssafy.m09.domain.TaskToolBuilder;
import ssafy.m09.dto.request.TaskRequest;
import ssafy.m09.service.TaskToolBuilderService;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/taskbuilders")
@RequiredArgsConstructor
public class TaskToolBuilderController {
    private final TaskToolBuilderService taskToolBuilderService;

    // RESTful 한게 어떻게 에러 메시지를 보내는건지 보류
    // token 추가하기

    // Create
    @PostMapping
    public ResponseEntity<TaskToolBuilder> createTaskToolBuilder(@RequestBody TaskRequest taskRequest) {
        TaskToolBuilder ttb = taskToolBuilderService.createTaskToolBuilder(taskRequest);
        return ResponseEntity.ok(ttb);
    }
    // Get All
    @GetMapping
    public ResponseEntity<List<TaskToolBuilder>> getAllTaskToolBuilders() {
        return ResponseEntity.ok(taskToolBuilderService.getAllTaskToolBuilder());
    }

    // Get single
    @GetMapping("/{id}")
    public Optional<TaskToolBuilder> getSingleTaskToolBuilder(@PathVariable("id") int id) {
        return taskToolBuilderService.getTaskToolBuilderById(id);
    }

    // Update single
    @PutMapping("/{id}")
    public ResponseEntity<?> updateTaskToolBuilder(@PathVariable("id") int id, @RequestBody TaskRequest taskRequest) {
        taskToolBuilderService.updateTaskToolBuilder(id, taskRequest);
        return ResponseEntity.ok().build();
    }

    // Delete single
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteTaskToolBuilder(@PathVariable("id") int id) {
        boolean success = taskToolBuilderService.deleteTaskToolBuilder(id);
        if (success) {
            return ResponseEntity.ok().build();
        }else {
            return ResponseEntity.notFound().build();
        }
    }
}
