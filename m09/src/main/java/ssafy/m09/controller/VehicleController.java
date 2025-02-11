package ssafy.m09.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import ssafy.m09.dto.common.ApiResponse;
import ssafy.m09.dto.request.VehicleRequest;
import ssafy.m09.service.VehicleService;

@RestController
@RequestMapping("/vehicles")
@RequiredArgsConstructor
public class VehicleController {
    private final VehicleService vehicleService;

    @PreAuthorize("hasRole('MANAGER')")
    @PostMapping
    public ApiResponse<?> createVehicle(@RequestBody VehicleRequest request) {
        return vehicleService.createVehicle(request);
    }

    @PreAuthorize("hasRole('MANAGER')")
    @GetMapping
    public ApiResponse<?> getVehicles() {
        return vehicleService.getVehicles();
    }

    @PreAuthorize("hasRole('MEMBER')")
    @GetMapping("/name")
    public ApiResponse<?> getVehicleByName(@RequestBody VehicleRequest request) {
        return vehicleService.getVehicleByName(request);
    }

    @PreAuthorize("hasRole('MANAGER')")
    @DeleteMapping("/name")
    public ApiResponse<?> deleteVehicle(@RequestBody VehicleRequest request) {
        return vehicleService.deleteVehicleByName(request);
    }
}
