package ssafy.m09.service;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import ssafy.m09.domain.Vehicle;
import ssafy.m09.dto.common.ApiResponse;
import ssafy.m09.dto.request.VehicleRequest;
import ssafy.m09.repository.VehicleRepository;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class VehicleService {
    private final VehicleRepository vehicleRepository;

    // 차량 등록
    @Transactional
    public ApiResponse<Vehicle> createVehicle(VehicleRequest request) {
        if(request.getName() == null || request.getName().isEmpty()) {
            return ApiResponse.error(HttpStatus.BAD_REQUEST, "이름을 설정해주세요.");
        }

        if(vehicleRepository.findByName(request.getName()).isPresent()) {
            return ApiResponse.error(HttpStatus.CONFLICT, "이미 존재하는 이름입니다.");
        }
        Vehicle vehicle = Vehicle.builder()
                .name(request.getName())
                .isUsing(false)
                .isCharging(false)
                .build();

        Vehicle savedVehicle = vehicleRepository.save(vehicle);
        return ApiResponse.success(savedVehicle, "Vehicle 생성 성공");
    }

    public ApiResponse<List<Vehicle>> getVehicles() {
        List<Vehicle> vehicles = vehicleRepository.findAll();
        return ApiResponse.success(vehicles,"전체 조회 성공");
    }

    public ApiResponse<Vehicle> getVehicleByName(VehicleRequest request) {
        if(request.getName() == null) {
            return ApiResponse.error(HttpStatus.NOT_FOUND, "자동차 이름이 없습니다.");
        }

        Optional<Vehicle> vehicle = vehicleRepository.findByName(request.getName());
        if(vehicle.isEmpty()) {
            return ApiResponse.error(HttpStatus.NOT_FOUND, "해당 이름의 자동차가 없습니다.");
        }

        return ApiResponse.success(vehicle.get(), "자동차 정보를 찾았습니다.");
    }

    @Transactional
    public ApiResponse<String> deleteVehicleByName(VehicleRequest request) {

        if(request.getName() == null || request.getName().isEmpty()) {
            return ApiResponse.error(HttpStatus.BAD_REQUEST, "이름을 설정해주세요.");
        }

        if(vehicleRepository.findByName(request.getName()).isEmpty()) {
            return ApiResponse.error(HttpStatus.BAD_REQUEST, "없는 이름입니다.");
        }
        vehicleRepository.deleteByName(request.getName());
        return ApiResponse.success(null, "삭제에 성공했습니다.");
    }

}
