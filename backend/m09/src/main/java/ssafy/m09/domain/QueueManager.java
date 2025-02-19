package ssafy.m09.domain;

import lombok.Getter;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import ssafy.m09.dto.common.ApiResponse;

import java.util.*;
import java.util.concurrent.ConcurrentLinkedQueue;

@Component
public class QueueManager {
    @Getter
    public final List<Queue<String>> queues = new ArrayList<>();
    private final Map<String, Integer> url2index = new HashMap<>();

    public QueueManager() {
        for(int i=0; i<3; i++){
            queues.add(new ConcurrentLinkedQueue<>());
        }

        url2index.put("/rfid", 0);
        url2index.put("/helmet", 1);
        url2index.put("/tool", 2);
    }

    public ApiResponse<String> add2Queue(String url, String data){
        Integer index = url2index.get(url);
//        System.out.println("도착한 데이터: " +data);
        if(index != null){
            queues.get(index).offer(data);
            System.out.println("index: " + index + ", data: " + data);
            return ApiResponse.success("OK","msg 저장 완료");
        }else{
            return ApiResponse.error(HttpStatus.BAD_REQUEST,"msg 저장 실패");
        }
    }

    public Queue<String> getQueue(String url){
        Integer index = url2index.get(url);
        return index != null ? queues.get(index) : null;
    }
}
