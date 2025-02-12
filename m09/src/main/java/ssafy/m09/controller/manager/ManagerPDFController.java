package ssafy.m09.controller.manager;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;
import ssafy.m09.dto.common.ApiResponse;
import ssafy.m09.dto.response.PDFFileResponse;
import ssafy.m09.service.PDFService;

@RestController
@RequestMapping("/pdf")
@RequiredArgsConstructor
public class ManagerPDFController {
    private final PDFService pdfService;

    @PostMapping("/upload")
    public ApiResponse<PDFFileResponse> uploadPDF(@RequestParam("file") MultipartFile file,
                                                  @RequestParam("description") String fileDescription) {
        // file: file, description: 설명
        return pdfService.uploadPDF(file, fileDescription);
    }
}
