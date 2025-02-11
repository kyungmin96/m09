package ssafy.m09.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import ssafy.m09.dto.common.ApiResponse;
import ssafy.m09.dto.request.VehicleRequest;
import ssafy.m09.service.VehicleService;

@RestController
@RequestMapping("/vehicles")
@RequiredArgsConstructor
public class VehicleController {
    private final VehicleService vehicleService;

    // 차량 등록
    @PostMapping
    public ApiResponse<?> createVehicle(@RequestBody VehicleRequest request) {
        return vehicleService.createVehicle(request);
    }

    // 전체 차량 조회
    @GetMapping
    public ApiResponse<?> getVehicles() {
        return vehicleService.getVehicles();
    }

    // 차량 이름으로 조회
    @GetMapping("/name")
    public ApiResponse<?> getVehicleByName(@RequestBody VehicleRequest request) {
        return vehicleService.getVehicleByName(request);
    }

    // 차량 이름으로 삭제
    @DeleteMapping("/{id}")
    public ApiResponse<?> deleteVehicle(@RequestBody VehicleRequest request) {
        return vehicleService.deleteVehicleByName(request);
    }
}
