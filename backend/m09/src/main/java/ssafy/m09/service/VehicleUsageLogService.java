package ssafy.m09.service;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import ssafy.m09.domain.Task;
import ssafy.m09.domain.User;
import ssafy.m09.domain.Vehicle;
import ssafy.m09.domain.VehicleUsageLog;
import ssafy.m09.dto.common.ApiResponse;
import ssafy.m09.dto.request.VehicleUsageLogRequest;
import ssafy.m09.repository.TaskRepository;
import ssafy.m09.repository.UserRepository;
import ssafy.m09.repository.VehicleRepository;
import ssafy.m09.repository.VehicleUsageLogRepository;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class VehicleUsageLogService {
    private final VehicleUsageLogRepository vehicleUsageLogRepository;
    private final UserRepository userRepository;
    private final TaskRepository taskRepository;
    private final VehicleRepository vehicleRepository;

    @Transactional
    public ApiResponse<VehicleUsageLog> createVehicleUsageLog(VehicleUsageLogRequest request) {
        Optional<User> userOptional = userRepository.findById(request.getUserId());
        if (userOptional.isEmpty()) {
            return ApiResponse.error(HttpStatus.NOT_FOUND, "해당 사용자를 찾을 수 없습니다.");
        }

        Optional<Task> taskOptional = taskRepository.findById(request.getTaskId());
        if (taskOptional.isEmpty()) {
            return ApiResponse.error(HttpStatus.NOT_FOUND, "해당 작업을 찾을 수 없습니다.");
        }


        VehicleUsageLog log = VehicleUsageLog.builder()
                .user(userOptional.get())
                .task(taskOptional.get())
                .build();

        VehicleUsageLog savedLog = vehicleUsageLogRepository.save(log);
        return ApiResponse.success(savedLog, "Vehicle Usage Log 생성 성공");
    }

    public ApiResponse<List<VehicleUsageLog>> getAllLogs() {
        List<VehicleUsageLog> logs = vehicleUsageLogRepository.findAll();
        return ApiResponse.success(logs, "전체 Vehicle Usage Log 조회 성공");
    }

    public ApiResponse<VehicleUsageLog> getLogById(int id) {
        return vehicleUsageLogRepository.findById(id)
                .map(log -> ApiResponse.success(log, "Vehicle Usage Log 조회 성공"))
                .orElse(ApiResponse.error(HttpStatus.NOT_FOUND, "Vehicle Usage Log를 찾을 수 없습니다."));
    }

    @Transactional
    public ApiResponse<String> deleteLog(int id) {
        if (vehicleUsageLogRepository.existsById(id)) {
            vehicleUsageLogRepository.deleteById(id);
            return ApiResponse.success(null, "Vehicle Usage Log 삭제 성공");
        }
        return ApiResponse.error(HttpStatus.NOT_FOUND, "Vehicle Usage Log를 찾을 수 없습니다.");
    }
}
