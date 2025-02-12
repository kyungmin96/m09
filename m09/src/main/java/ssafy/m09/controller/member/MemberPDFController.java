package ssafy.m09.controller.member;

import lombok.RequiredArgsConstructor;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import ssafy.m09.dto.common.ApiResponse;
import ssafy.m09.dto.response.PDFFileResponse;
import ssafy.m09.service.PDFService;

import java.util.List;

@RestController
@RequestMapping("/pdf")
@RequiredArgsConstructor
public class MemberPDFController {
    private final PDFService pdfService;

    @PostMapping("/upload")
    public ApiResponse<PDFFileResponse> uploadPDF(@RequestParam("file") MultipartFile file,
                                                  @RequestParam("description") String fileDescription) {
        // file: file, description: 설명
        return pdfService.uploadPDF(file, fileDescription);
    }

    @GetMapping
    public ApiResponse<List<PDFFileResponse>> getAllPDFs() {
        return pdfService.getAllPDFs();
    }

    @GetMapping("/{id}")
    public ApiResponse<PDFFileResponse> getPDFById(@PathVariable int id) {
        return pdfService.getPDFById(id);
    }

    @GetMapping("/preview/{id}")
    public ApiResponse<Resource> previewPDF(@PathVariable int id) {
        return pdfService.getPDFPreview(id);
    }
}
