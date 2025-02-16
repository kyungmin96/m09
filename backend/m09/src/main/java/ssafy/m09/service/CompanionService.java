package ssafy.m09.service;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import ssafy.m09.domain.Companion;
import ssafy.m09.domain.Task;
import ssafy.m09.domain.TaskTool;
import ssafy.m09.domain.User;
import ssafy.m09.dto.common.ApiResponse;
import ssafy.m09.dto.request.CompanionRequest;
import ssafy.m09.dto.request.TaskAllocateRequest;
import ssafy.m09.repository.CompanionRepository;
import ssafy.m09.repository.TaskRepository;
import ssafy.m09.repository.TaskToolRepository;
import ssafy.m09.repository.UserRepository;

import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CompanionService {
    private final CompanionRepository companionRepository;
    private final TaskRepository taskRepository;
    private final UserRepository userRepository;
    private final TaskToolRepository taskToolRepository;

    @Transactional
    public ApiResponse<Companion> createCompanion(CompanionRequest request) {
        Optional<Task> taskOptional = taskRepository.findById(request.getTaskId());
        if (taskOptional.isEmpty()) {
            return ApiResponse.error(HttpStatus.NOT_FOUND, "해당 작업을 찾을 수 없습니다.");
        }

        Optional<User> userOptional = userRepository.findById(request.getUserId());
        if (userOptional.isEmpty()) {
            return ApiResponse.error(HttpStatus.NOT_FOUND, "해당 사용자를 찾을 수 없습니다.");
        }

        Companion companion = Companion.builder()
                .task(taskOptional.get())
                .user(userOptional.get())
                .build();

        Companion savedCompanion = companionRepository.save(companion);
        return ApiResponse.success(savedCompanion, "Companion 등록 성공");
    }

    @Transactional
    public ApiResponse<Map<String, Object>> addCompanionWithStart(List<TaskAllocateRequest> requests) {
        Set<String> uniqueToolNames = new HashSet<>();  // 중복 제거된 Tool 이름을 저장할 Set

        for (TaskAllocateRequest request : requests) {
            Optional<Task> taskOptional = taskRepository.findById(request.getTaskId());
            if (taskOptional.isEmpty()) {
                return ApiResponse.error(HttpStatus.NOT_FOUND, "Task ID " + request.getTaskId() + "에 해당하는 작업을 찾을 수 없습니다.");
            }

            Task task = taskOptional.get();
            task.setStartTime(LocalDateTime.now());
            taskRepository.save(task);

            for (String employeeId : request.getEmployeeIds()) {
                Optional<User> userOptional = userRepository.findByEmployeeId(employeeId);
                if (userOptional.isEmpty()) {
                    return ApiResponse.error(HttpStatus.NOT_FOUND, "Employee ID " + employeeId + "에 해당하는 사용자를 찾을 수 없습니다.");
                }

                User user = userOptional.get();

                // isEnabled 값을 false로 변경
//                user.setEnabled(false);
//                userRepository.save(user);  // 변경된 User 저장

                // Companion 생성 및 저장
                Companion companion = Companion.builder()
                        .task(task)
                        .user(user)
                        .build();
                companionRepository.save(companion);
            }

            // Task에 연결된 Tool 목록 조회 및 중복 제거
            List<TaskTool> taskTools = taskToolRepository.findByTaskId(task.getId());
            uniqueToolNames.addAll(taskTools.stream()
                    .map(taskTool -> taskTool.getTool().getName())  // Tool 이름 추출
                    .collect(Collectors.toSet()));  // 중복 제거를 위해 Set 사용
        }

        // 결과 반환
        Map<String, Object> responseData = new HashMap<>();
        responseData.put("uniqueTools", uniqueToolNames);
        return ApiResponse.success(responseData, "Companions 생성 및 중복 제거된 Tool 목록 조회 성공");
    }



    public ApiResponse<Companion> getCompanionById(int id) {
        return companionRepository.findById(id)
                .map(companion -> ApiResponse.success(companion, "Companion 조회 성공"))
                .orElse(ApiResponse.error(HttpStatus.NOT_FOUND, "Companion을 찾을 수 없습니다."));
    }

    public ApiResponse<List<Companion>> getCompanionsByTaskId(int taskId) {
        List<Companion> companions = companionRepository.findAllByTaskId(taskId);
        if (companions.isEmpty()) {
            return ApiResponse.error(HttpStatus.NOT_FOUND, "해당 작업에 참여한 Companion이 없습니다.");
        }
        return ApiResponse.success(companions, "작업에 참여한 Companion 조회 성공");
    }

    public ApiResponse<List<Companion>> getCompanionsByUserId(int userId) {
        List<Companion> companions = companionRepository.findAllByUserId(userId);
        if (companions.isEmpty()) {
            return ApiResponse.error(HttpStatus.NOT_FOUND, "해당 사용자가 참여한 Companion이 없습니다.");
        }
        return ApiResponse.success(companions, "사용자가 참여한 Companion 조회 성공");
    }

    @Transactional
    public ApiResponse<String> deleteCompanion(int id) {
        if (companionRepository.existsById(id)) {
            companionRepository.deleteById(id);
            return ApiResponse.success(null, "Companion 관계 정보 삭제 성공");
        }
        return ApiResponse.error(HttpStatus.NOT_FOUND, "Companion 관계 정보를 찾을 수 없습니다.");
    }
}
