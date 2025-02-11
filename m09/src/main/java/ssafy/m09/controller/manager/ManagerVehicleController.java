package ssafy.m09.controller.manager;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import ssafy.m09.dto.common.ApiResponse;
import ssafy.m09.dto.request.VehicleRequest;
import ssafy.m09.service.VehicleService;

@RestController
@RequestMapping("/manager/vehicles")
@RequiredArgsConstructor
public class ManagerVehicleController {
    private final VehicleService vehicleService;

    @PostMapping
    public ApiResponse<?> createVehicle(@RequestBody VehicleRequest request) {
        return vehicleService.createVehicle(request);
    }

    @GetMapping
    public ApiResponse<?> getVehicles() {
        return vehicleService.getVehicles();
    }

    @DeleteMapping("/name")
    public ApiResponse<?> deleteVehicle(@RequestBody VehicleRequest request) {
        return vehicleService.deleteVehicleByName(request);
    }
}
