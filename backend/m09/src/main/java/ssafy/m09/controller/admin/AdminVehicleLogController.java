package ssafy.m09.controller.admin;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import ssafy.m09.dto.common.ApiResponse;
import ssafy.m09.dto.request.VehicleUsageLogRequest;
import ssafy.m09.service.VehicleUsageLogService;

@RestController
@RequestMapping("/admin/vehicle-logs")
@RequiredArgsConstructor
public class AdminVehicleLogController {
    private final VehicleUsageLogService vehicleUsageLogService;

    @PostMapping
    public ApiResponse<?> createLog(@RequestBody VehicleUsageLogRequest request) {
        return vehicleUsageLogService.createVehicleUsageLog(request);
    }
}
