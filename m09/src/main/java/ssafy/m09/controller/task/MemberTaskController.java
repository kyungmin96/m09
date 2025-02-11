//package ssafy.m09.controller.task;
//
//import lombok.RequiredArgsConstructor;
//import org.springframework.security.access.prepost.PreAuthorize;
//import org.springframework.web.bind.annotation.*;
//import ssafy.m09.dto.common.ApiResponse;
//import ssafy.m09.dto.request.TaskRequest;
//import ssafy.m09.service.TaskService;
//
//// 멤버 작업 컨트롤러
//@RestController
//@RequestMapping("/member/tasks")
//@RequiredArgsConstructor
//public class MemberTaskController {
//    private final TaskService taskService;
//
//    @PreAuthorize("hasRole('MEMBER')")
//    @GetMapping("/posts")
//    public ApiResponse<?> getAllTasks(@RequestHeader("Authorization") String token) {
//        return taskService.getAllTasks();
//    }
//
//    @PreAuthorize("hasRole('MEMBER')")
//    @GetMapping("/posts/{id}")
//    public ApiResponse<?> getSingleTaskById(@RequestHeader("Authorization") String token, @PathVariable int id) {
//        return taskService.getTaskById(id);
//    }
//}
