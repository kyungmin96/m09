package ssafy.m09.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import ssafy.m09.domain.VehicleUsageLog;

public interface VehicleUsageLogRepository extends JpaRepository<VehicleUsageLog, Integer> {
}
