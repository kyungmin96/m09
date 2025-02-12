package ssafy.m09.service;

import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import ssafy.m09.domain.PDFFile;
import ssafy.m09.dto.common.ApiResponse;
import ssafy.m09.dto.response.PDFFileResponse;
import ssafy.m09.repository.PDFRepository;

import java.io.IOException;
import java.net.MalformedURLException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PDFService {
    private final PDFRepository pdfRepository;
    private static final String UPLOAD_DIR = "/uploads/pdf_files/";
    // C://uploads/pdf_files/
    @Transactional
    public ApiResponse<PDFFileResponse> uploadPDF(MultipartFile file, String fileDescription) {
        if (file.isEmpty() || !file.getContentType().equals("application/pdf")) {
            return ApiResponse.error(HttpStatus.BAD_REQUEST, "PDF 파일만 업로드할 수 있습니다.");
        }

        try {
            String fileName = UUID.randomUUID() + "_" + file.getOriginalFilename();
            Path filePath = Paths.get(UPLOAD_DIR + fileName);
            Files.createDirectories(filePath.getParent());
            Files.write(filePath, file.getBytes());

            PDFFile pdfFile = PDFFile.builder()
                    .fileName(fileName)
                    .filePath(filePath.toString())
                    .fileDescription(fileDescription)
                    .build();

            PDFFile savedFile = pdfRepository.save(pdfFile);

            PDFFileResponse response = PDFFileResponse.builder()
                    .id(savedFile.getId())
                    .fileName(savedFile.getFileName())
                    .filePath(savedFile.getFilePath())
                    .fileDescription(savedFile.getFileDescription())
                    .build();

            return ApiResponse.success(response, "파일 업로드 성공");
        } catch (IOException e) {
            return ApiResponse.error(HttpStatus.INTERNAL_SERVER_ERROR, "파일 업로드 중 오류가 발생했습니다.");
        }
    }

    public ApiResponse<List<PDFFileResponse>> getAllPDFs() {
        List<PDFFileResponse> responseList = pdfRepository.findAll().stream().map(file ->
                PDFFileResponse.builder()
                        .id(file.getId())
                        .fileName(file.getFileName())
                        .filePath(file.getFilePath())
                        .fileDescription(file.getFileDescription())
                        .build()
        ).collect(Collectors.toList());

        return ApiResponse.success(responseList, "전체 PDF 조회 성공");
    }

    public ApiResponse<PDFFileResponse> getPDFById(int id) {
        Optional<PDFFile> pdfFileOptional = pdfRepository.findById(id);
        return pdfFileOptional.map(file -> ApiResponse.success(
                PDFFileResponse.builder()
                        .id(file.getId())
                        .fileName(file.getFileName())
                        .filePath(file.getFilePath())
                        .fileDescription(file.getFileDescription())
                        .build(),
                "PDF 조회 성공"
        )).orElse(ApiResponse.error(HttpStatus.NOT_FOUND, "PDF 파일을 찾을 수 없습니다."));
    }

    public ApiResponse<Resource> getPDFPreview(int id) {
        Optional<PDFFile> pdfFileOptional = pdfRepository.findById(id);
        if (pdfFileOptional.isEmpty()) {
            return ApiResponse.error(HttpStatus.NOT_FOUND, "PDF 파일을 찾을 수 없습니다.");
        }

        PDFFile pdfFile = pdfFileOptional.get();
        Path filePath = Paths.get(pdfFile.getFilePath());

        try {
            UrlResource resource = new UrlResource(filePath.toUri());
            if (!resource.exists()) {
                return ApiResponse.error(HttpStatus.NOT_FOUND, "PDF 파일이 존재하지 않습니다.");
            }

            return ApiResponse.success((Resource) resource, "PDF 미리보기 성공");
        } catch (MalformedURLException e) {
            return ApiResponse.error(HttpStatus.INTERNAL_SERVER_ERROR, "파일 경로가 잘못되었습니다.");
        }
    }
}
