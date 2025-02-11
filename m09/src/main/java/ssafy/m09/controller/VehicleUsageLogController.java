package ssafy.m09.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import ssafy.m09.dto.common.ApiResponse;
import ssafy.m09.dto.request.VehicleUsageLogRequest;
import ssafy.m09.service.VehicleUsageLogService;

@RestController
@RequestMapping("/vehicle-usage-logs")
@RequiredArgsConstructor
public class VehicleUsageLogController {
    private final VehicleUsageLogService vehicleUsageLogService;

    @PostMapping
    public ApiResponse<?> createLog(@RequestBody VehicleUsageLogRequest request) {
        return vehicleUsageLogService.createVehicleUsageLog(request);
    }

    @GetMapping
    public ApiResponse<?> getAllLogs() {
        return vehicleUsageLogService.getAllLogs();
    }

    @GetMapping("/{id}")
    public ApiResponse<?> getLogById(@PathVariable int id) {
        return vehicleUsageLogService.getLogById(id);
    }

    @DeleteMapping("/{id}")
    public ApiResponse<?> deleteLog(@PathVariable int id) {
        return vehicleUsageLogService.deleteLog(id);
    }
}
