package ssafy.m09.controller.manager;

import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import ssafy.m09.dto.common.ApiResponse;
import ssafy.m09.dto.request.VehicleUsageLogRequest;
import ssafy.m09.service.VehicleUsageLogService;

@RestController
@RequestMapping("/manager/vehicle-usage-logs")
@RequiredArgsConstructor
public class ManagerVehicleUsageLogController {
    private final VehicleUsageLogService vehicleUsageLogService;

    @PreAuthorize("hasRole('MANAGER')")
    @GetMapping
    public ApiResponse<?> getAllLogs() {
        return vehicleUsageLogService.getAllLogs();
    }

    @PreAuthorize("hasRole('MANAGER')")
    @GetMapping("/{id}")
    public ApiResponse<?> getLogById(@PathVariable int id) {
        return vehicleUsageLogService.getLogById(id);
    }

    @PreAuthorize("hasRole('MANAGER')")
    @DeleteMapping("/{id}")
    public ApiResponse<?> deleteLog(@PathVariable int id) {
        return vehicleUsageLogService.deleteLog(id);
    }
}
