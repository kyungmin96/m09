package ssafy.m09.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import ssafy.m09.domain.Task;
import ssafy.m09.dto.TaskRequest;
import ssafy.m09.service.TaskService;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/tasks")
@RequiredArgsConstructor
public class TaskController {
    private final TaskService taskService;

    @PostMapping
    public ResponseEntity<Task> createTask(@RequestHeader("Authorization") String token, @RequestBody TaskRequest taskRequest)
    {
        Task task = taskService.createTask(taskRequest);
        return ResponseEntity.ok(task);
    }

    @PostMapping("/{id}")
    public ResponseEntity<?> getTaskById(@RequestHeader("Authorization") String token, @PathVariable int id)
    {
        Optional<Task> task = taskService.getTaskById(id);
        return task.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @GetMapping()
    public ResponseEntity<List<Task>> getAllTasks(@RequestHeader("Authorization") String token){
        return ResponseEntity.ok(taskService.getAllTasks());
    }

    @GetMapping("/{id}")
    public Optional<Task> getSingleTaskById(@RequestHeader("Authorization") String token, @PathVariable int id){
        return taskService.getTaskById(id);
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateTask(@RequestHeader("Authorization") String token, @PathVariable int id, @RequestBody TaskRequest request)
    {
        Optional<Task> task = taskService.updateTask(id, request);
        return task.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteTask(@RequestHeader("Authorization") String token, @PathVariable int id)
    {
        boolean isDeleted = taskService.deleteTask(id);
        if(isDeleted){
            return ResponseEntity.ok().build();
        }
        else{
            return ResponseEntity.notFound().build();
        }
    }
}
