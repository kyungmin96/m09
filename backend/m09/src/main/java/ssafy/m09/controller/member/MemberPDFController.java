package ssafy.m09.controller.member;

import lombok.RequiredArgsConstructor;
import org.springframework.core.io.Resource;
import org.springframework.web.bind.annotation.*;
import ssafy.m09.dto.common.ApiResponse;
import ssafy.m09.dto.response.PDFFileResponse;
import ssafy.m09.service.PDFService;

import java.util.List;

@RestController
@RequestMapping("/member/pdf")
@RequiredArgsConstructor
public class MemberPDFController {
    private final PDFService pdfService;

    @GetMapping
    public ApiResponse<List<PDFFileResponse>> getAllPDFs() {
        return pdfService.getAllPDFs();
    }

    @GetMapping("/{id}")
    public ApiResponse<PDFFileResponse> getPDFById(@PathVariable int id) {
        return pdfService.getPDFById(id);
    }

    @GetMapping("/tasks/{taskId}")
    public ApiResponse<?> getPDFForTask(@PathVariable int taskId) {
        return pdfService.getPDFByTaskId(taskId);
    }

    @GetMapping("/preview/{id}")
    public ApiResponse<Resource> previewPDF(@PathVariable int id) {
        return pdfService.getPDFPreview(id);
    }
}
