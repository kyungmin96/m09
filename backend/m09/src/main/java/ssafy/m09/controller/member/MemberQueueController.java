package ssafy.m09.controller.member;

import org.json.JSONObject;
import org.springframework.web.bind.annotation.*;
import ssafy.m09.domain.WebSocketManager;
import ssafy.m09.dto.common.ApiResponse;
import ssafy.m09.domain.QueueManager;

@RestController
@RequestMapping("/queue")
public class MemberQueueController {
    private final QueueManager queueManager;
    private final WebSocketManager webSocketManager;

    public MemberQueueController(QueueManager queueManager, WebSocketManager webSocketManager) {
        this.queueManager = queueManager;
        this.webSocketManager = webSocketManager;
    }

    @PostMapping("/rfid")
    public ApiResponse<?> add2RFID(@RequestBody String data) {
        String url = "/rfid";
        return queueManager.add2Queue(url, data);
    }

    @PostMapping("/helmet")
    public ApiResponse<?> add2Helmet(@RequestBody String data) {
        String url = "/helmet";
        return queueManager.add2Queue(url, data);
    }

    @PostMapping("/tool")
    public ApiResponse<?> add2Tool(@RequestBody String data) {
        JSONObject json = new JSONObject(data);
        String url = "/tool";
        return queueManager.add2Queue(url, json.toString());
    }
}
