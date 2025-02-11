//package ssafy.m09.controller.task;
//
//import lombok.RequiredArgsConstructor;
//import org.springframework.security.access.prepost.PreAuthorize;
//import org.springframework.web.bind.annotation.*;
//import ssafy.m09.dto.common.ApiResponse;
//import ssafy.m09.dto.request.TaskRequest;
//import ssafy.m09.service.TaskService;
//
//@RestController
//@RequestMapping("/manager/tasks")
//@RequiredArgsConstructor
//public class ManagerTaskController {
//    private final TaskService taskService;
//
//    @PreAuthorize("hasRole('MANAGER')")
//    @PostMapping("/posts")
//    public ApiResponse<?> createTask(@RequestHeader("Authorization") String token, @RequestBody TaskRequest taskRequest) {
//        return taskService.createTask(taskRequest);
//    }
//
//    @PreAuthorize("hasRole('MANAGER')")
//    @PutMapping("/posts/{id}")
//    public ApiResponse<?> updateTask(@RequestHeader("Authorization") String token, @PathVariable int id, @RequestBody TaskRequest request) {
//        return taskService.updateTask(id, request);
//    }
//
//    @PreAuthorize("hasRole('MANAGER')")
//    @DeleteMapping("/posts/{id}")
//    public ApiResponse<?> deleteTask(@RequestHeader("Authorization") String token, @PathVariable int id) {
//        return taskService.deleteTaskById(id);
//    }
//}
