package ssafy.m09.service;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import ssafy.m09.domain.Task;
import ssafy.m09.domain.TaskToolBuilder;
import ssafy.m09.domain.User;
import ssafy.m09.domain.en.TaskStatus;
import ssafy.m09.dto.common.ApiResponse;
import ssafy.m09.dto.request.TaskRequest;
import ssafy.m09.global.error.ErrorCode;
import ssafy.m09.repository.TaskRepository;
import ssafy.m09.repository.TaskToolBuilderRepository;
import ssafy.m09.repository.UserRepository;
import ssafy.m09.security.JwtTokenProvider;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class TaskService {
    private final TaskRepository taskRepository;
    private final UserRepository userRepository;
    private final TaskToolBuilderRepository taskToolBuilderRepository;
    private final JwtTokenProvider jwtTokenProvider;
    // 초기 필수: 제목, 내용, 위치, 담당자, 예정 시작/끝 시간, 기본 START enum
    // 서비스 로직에서 이후 user page에서 추가 코멘트, 사용 차량, 작업 시작/끝 시간 추가됨

    @Transactional
    public ApiResponse<Task> createTask(TaskRequest request) {
        // 필수 필드 검증
        if (request.getTitle() == null || request.getTitle().isEmpty()) {
            return ApiResponse.error(HttpStatus.BAD_REQUEST, "제목이 비어있습니다.");
        }
        if (request.getContent() == null || request.getContent().isEmpty()) {
            return ApiResponse.error(HttpStatus.BAD_REQUEST, "작업 내용이 비어있습니다.");
        }
        if (request.getLocation() == null || request.getLocation().isEmpty()) {
            return ApiResponse.error(HttpStatus.BAD_REQUEST, "작업 위치가 비어있습니다.");
        }
        if (request.getEmployeeId() == null) {
            return ApiResponse.error(HttpStatus.BAD_REQUEST, "담당 작업자가 비어있습니다.");
        }
        if (request.getScheduledStartTime() == null || request.getScheduledEndTime() == null) {
            return ApiResponse.error(HttpStatus.BAD_REQUEST, "작업 예정 시간이 비어있습니다.");
        }

        Optional<User> userOptional = userRepository.findByEmployeeId(request.getEmployeeId());
        if (userOptional.isEmpty()) {
            return ApiResponse.error(HttpStatus.NOT_FOUND, "해당 사용자를 찾을 수 없습니다.");
        }

        // Task 생성
        Task.TaskBuilder taskBuilder = Task.builder()
                .title(request.getTitle())
                .content(request.getContent())
                .location(request.getLocation())
                .assignedUser(userOptional.get())
                .scheduledStartTime(request.getScheduledStartTime())
                .scheduledEndTime(request.getScheduledEndTime())
                .taskState(TaskStatus.START);

        // taskToolBuilderId가 있을 경우만 연결
        if (request.getTaskToolBuilderId() > 0) {
            Optional<TaskToolBuilder> ttbOptional = taskToolBuilderRepository.findById(request.getTaskToolBuilderId());
            ttbOptional.ifPresent(taskBuilder::taskToolBuilder);
        }

        Task savedTask = taskRepository.save(taskBuilder.build());
        return ApiResponse.success(savedTask, "작업 생성 성공");
    }
    public ApiResponse<Task> getTaskById(int id) {
        return taskRepository.findById(id)
                .map(task -> ApiResponse.success(task, "작업 조회 성공"))
                .orElse(ApiResponse.error(HttpStatus.NOT_FOUND, "해당 작업을 찾을 수 없습니다."));
    }

    public ApiResponse<List<Task>> getAllTasks() {
        List<Task> tasks = taskRepository.findAll();
        return ApiResponse.success(tasks, "작업 목록 조회 성공");
    }

    public ApiResponse<List<Task>> getInProcessTasks(String token) {
        LocalDateTime now = LocalDateTime.now();

        // JWT에서 employeeId 추출
        String employeeId = jwtTokenProvider.getEmployeeId(token);
        if (employeeId == null) {
            return ApiResponse.error(HttpStatus.UNAUTHORIZED, "유효하지 않은 토큰입니다.");
        }

        // 데이터베이스에서 사용자 확인
        Optional<User> userOptional = userRepository.findByEmployeeId(employeeId);
        if (userOptional.isEmpty()) {
            return ApiResponse.error(HttpStatus.NOT_FOUND, "해당 사용자(User)를 찾을 수 없습니다.");
        }

        User user = userOptional.get();

        // 현재 시간 이전이며, 상태가 START 또는 PENDING이고, 해당 유저가 할당된 Task 조회
        List<Task> tasks = taskRepository.findByScheduledStartTimeBeforeAndTaskStateInAndAssignedUser(
                now,
                List.of(TaskStatus.START, TaskStatus.PENDING),
                user
        );

        if (tasks.isEmpty()) {
            return ApiResponse.error(HttpStatus.NOT_FOUND, "조회된 작업이 없습니다.");
        }

        return ApiResponse.success(tasks, "진행 중인 작업 조회 성공");
    }


    // 업데이트는 모든 필드 업데이트 가능하게 열어둠
    @Transactional
    public ApiResponse<Task> updateTask(int id, TaskRequest request) {
        Optional<Task> taskOptional = taskRepository.findById(id);
        if (taskOptional.isEmpty()) {
            return ApiResponse.error(HttpStatus.NO_CONTENT, ErrorCode.INVALID_INPUT_VALUE.getMessage(), ErrorCode.INVALID_INPUT_VALUE.getCode());
        }

        Optional<User> userOptional = userRepository.findByEmployeeId(request.getEmployeeId());
        if (userOptional.isEmpty()) {
            return ApiResponse.error(HttpStatus.NOT_FOUND, "해당 사용자를 찾을 수 없습니다.");
        }

        Task task = taskOptional.get();

        task.setTitle(Optional.ofNullable(request.getTitle()).orElse(task.getTitle()));
        task.setContent(Optional.ofNullable(request.getContent()).orElse(task.getContent()));
        task.setComment(Optional.ofNullable(request.getComment()).orElse(task.getComment()));
        task.setLocation(Optional.ofNullable(request.getLocation()).orElse(task.getLocation()));
        task.setAssignedUser(userOptional.orElse(task.getAssignedUser()));
        task.setVehicle(Optional.ofNullable(request.getVehicle()).orElse(task.getVehicle()));
        task.setScheduledStartTime(Optional.ofNullable(request.getScheduledStartTime()).orElse(task.getScheduledStartTime()));
        task.setScheduledEndTime(Optional.ofNullable(request.getScheduledEndTime()).orElse(task.getScheduledEndTime()));
        task.setStartTime(Optional.ofNullable(request.getStartTime()).orElse(task.getStartTime()));
        task.setEndTime(Optional.ofNullable(request.getEndTime()).orElse(task.getEndTime()));
        task.setTaskState(Optional.ofNullable(request.getTaskState()).orElse(task.getTaskState()));

        Task updatedTask = taskRepository.save(task);
        return ApiResponse.success(updatedTask, "작업 수정 성공");
    }

    @Transactional
    public ApiResponse<Task> updateTaskStatusById(int id, TaskRequest request) {
        Optional<Task> taskOptional = taskRepository.findById(id);
        if (taskOptional.isEmpty()) {
            return ApiResponse.error(HttpStatus.NO_CONTENT, ErrorCode.INVALID_INPUT_VALUE.getMessage(), ErrorCode.INVALID_INPUT_VALUE.getCode());
        }

        Task task = taskOptional.get();
        task.setTaskState(Optional.ofNullable(request.getTaskState()).orElse(request.getTaskState()));

        return ApiResponse.success(null, "작업 상태 변경 성공");
    }

    @Transactional
    public ApiResponse<String> deleteTaskById(int id) {
        if (taskRepository.existsById(id)) {
            taskRepository.deleteById(id);
            return ApiResponse.success(null, "작업 삭제 성공");
        }
        return ApiResponse.error(HttpStatus.NOT_FOUND, "해당 작업을 찾을 수 없습니다.");
    }
}
