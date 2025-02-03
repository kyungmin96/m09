package ssafy.m09.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import ssafy.m09.domain.RFID;
import ssafy.m09.domain.User;
import ssafy.m09.repository.RFIDRepository;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class RFIDLoginService {
    private final RFIDRepository rfidRepository;

    public Optional<User> loginWithRFID(String cardKey)
    {
        Optional<RFID> rfid = rfidRepository.findByCardKey(cardKey);
        return rfid.map(RFID::getUser);
    }
}
