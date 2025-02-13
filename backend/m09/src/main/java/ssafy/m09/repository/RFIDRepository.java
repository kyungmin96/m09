package ssafy.m09.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import ssafy.m09.domain.RFID;

import java.util.Optional;

public interface RFIDRepository extends JpaRepository<RFID, Integer> {
    Optional<RFID> findByCardKey(String cardKey);
}
