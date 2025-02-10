package ssafy.m09.service;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import ssafy.m09.domain.Companion;
import ssafy.m09.domain.Task;
import ssafy.m09.domain.User;
import ssafy.m09.dto.common.ApiResponse;
import ssafy.m09.dto.request.CompanionRequest;
import ssafy.m09.repository.CompanionRepository;
import ssafy.m09.repository.TaskRepository;
import ssafy.m09.repository.UserRepository;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class CompanionService {
    private final CompanionRepository companionRepository;
    private final TaskRepository taskRepository;
    private final UserRepository userRepository;

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
