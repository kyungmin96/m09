package ssafy.m09.dto.response;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Builder
public class PDFFileResponse {
    private int id;
    private String fileName;
    private String filePath;
    private String fileDescription;
}
