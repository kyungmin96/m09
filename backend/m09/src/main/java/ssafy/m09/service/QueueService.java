package ssafy.m09.service;

import org.json.JSONException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import ssafy.m09.domain.QueueManager;
import ssafy.m09.domain.RFID;
import ssafy.m09.domain.WebSocketManager;
import org.json.JSONObject;
import ssafy.m09.repository.RFIDRepository;

import java.util.Optional;
import java.util.Queue;

@Service
public class QueueService {
    private final QueueManager queueManager;
    private final WebSocketManager webSocketManager;
    private final RFIDRepository rfidRepository;

    @Autowired
    public QueueService(QueueManager queueManager, WebSocketManager webSocketManager, RFIDRepository rfidRepository) {
        this.queueManager = queueManager;
        this.webSocketManager = webSocketManager;
        this.rfidRepository = rfidRepository;
//        System.out.println("QueueService created!!");
        startProcessing();
    }

    private void startProcessing() {
        new Thread(() -> {
//            System.out.println("QueueService started!!");
            while (true) {
                for (int i = 0; i < queueManager.getQueues().size(); i++) {
                    Queue<String> queue = queueManager.getQueues().get(i);
                    String data = queue.poll();

                    if (data != null) {
                        System.out.println("Queue Data: " +data);
                        processQueueData(i, data);
                    }
                }

                try {
                    Thread.sleep(500); // 0.5초 대기 (CPU 부하 방지)
                } catch (InterruptedException e) {
                    Thread.currentThread().interrupt();
                }
            }
        }).start();
    }

    private void processQueueData(int queueIndex, String data) {
        System.out.println("큐 " + queueIndex + "에서 데이터 처리 중: " + data);
        // 여기서 원하는 데이터 처리 로직 추가
        try {
            JSONObject jsonObject = new JSONObject(data);

            if (jsonObject.has("helmet")) {
                boolean helmetDetected = jsonObject.getBoolean("helmet");
                if (helmetDetected) {
                    System.out.println("헬멧 감지!");
                    webSocketManager.sendMessageToAll("ok");
                } else {
                    System.out.println("헬멧 미착용!");
                    webSocketManager.sendMessageToAll("failed");
                }
            } else if (jsonObject.has("UID")) {
                String uid = jsonObject.getString("UID");
                System.out.println("Key: " + uid);
                Optional<RFID> rfidOptional = rfidRepository.findByCardKey(uid);

                if (rfidOptional.isEmpty()) {
                    System.out.println("RFID 감지 실패");
                    webSocketManager.sendMessageToAll("failed");
                } else {
                    System.out.println("RFID 태그 감지!");
                    webSocketManager.sendMessageToAll("ok");
                }
            } else{
                boolean allToolsDetected = true;
                for (String key : jsonObject.keySet()) {
                    boolean toolDetected = jsonObject.getBoolean(key);
                    if (!toolDetected) {
                        allToolsDetected = false;
                    }
                }
                if (allToolsDetected) {
                    System.out.println("모든 공구 감지 완료!");
                } else {
                    System.out.println("공구 감지 진행 중: " + jsonObject);
                }
                webSocketManager.sendMessageToAll(jsonObject.toString());

            }

        } catch (JSONException e) {
            System.out.println("JSON 파싱 오류: " + e.getMessage());
        }
    }
}
