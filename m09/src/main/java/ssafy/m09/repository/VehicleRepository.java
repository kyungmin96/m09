package ssafy.m09.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import ssafy.m09.domain.Vehicle;

public interface VehicleRepository extends JpaRepository<Vehicle, Integer> {
    
}
