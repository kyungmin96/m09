package ssafy.m09.service;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import ssafy.m09.domain.RFID;
import ssafy.m09.domain.User;
import ssafy.m09.dto.common.ApiResponse;
import ssafy.m09.dto.request.RFIDLoginRequest;
import ssafy.m09.global.error.ErrorCode;
import ssafy.m09.repository.RFIDRepository;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class RFIDLoginService {
    private final RFIDRepository rfidRepository;

    public ApiResponse<User> loginWithRFID(RFIDLoginRequest request)
    {
        String cardKey = request.getUid();

        if (cardKey == null || cardKey.isEmpty()) {
            return ApiResponse.error(HttpStatus.BAD_REQUEST, "카드 키가 비어 있습니다.");
        }
        System.out.println("카드 키: " + cardKey);
        Optional<RFID> rfidOptional = rfidRepository.findByCardKey(cardKey);

        if (rfidOptional.isEmpty()) {
            return ApiResponse.error(HttpStatus.NOT_FOUND, ErrorCode.RESOURCE_NOT_FOUND.getMessage(), "RFID_NOT_FOUND");
        }

        User user = rfidOptional.get().getUser();
        return ApiResponse.success(user, "RFID 로그인 성공");
    }
}
