package ssafy.m09.controller.member;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import ssafy.m09.dto.common.ApiResponse;
import ssafy.m09.dto.request.VehicleRequest;
import ssafy.m09.service.VehicleService;

@RestController
@RequestMapping("/member/vehicles")
@RequiredArgsConstructor
public class MemberVehicleController {
    private final VehicleService vehicleService;

    @GetMapping("/name")
    public ApiResponse<?> getVehicleByName(@RequestBody VehicleRequest request) {
        return vehicleService.getVehicleByName(request);
    }
}
