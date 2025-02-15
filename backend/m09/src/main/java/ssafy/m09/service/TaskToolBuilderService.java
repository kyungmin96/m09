package ssafy.m09.service;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import ssafy.m09.domain.PDFFile;
import ssafy.m09.domain.TaskToolBuilder;
import ssafy.m09.dto.common.ApiResponse;
import ssafy.m09.dto.request.TaskRequest;
import ssafy.m09.repository.PDFRepository;
import ssafy.m09.repository.TaskToolBuilderRepository;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class TaskToolBuilderService {
    private final TaskToolBuilderRepository taskToolBuilderRepository;
    private final PDFRepository pdfRepository;

    @Transactional
    public ApiResponse<TaskToolBuilder> createTaskToolBuilder(TaskRequest request) {
        if (request.getTitle() == null || request.getTitle().isEmpty()) {
            return ApiResponse.error(HttpStatus.NO_CONTENT, "제목은 필수 입력 항목입니다.");
        }
        if (request.getContent() == null || request.getContent().isEmpty()) {
            return ApiResponse.error(HttpStatus.NO_CONTENT, "내용은 필수 입력 항목입니다.");
        }

        TaskToolBuilder ttb = TaskToolBuilder.builder()
                .title(request.getTitle())
                .content(request.getContent())
                .build();

        TaskToolBuilder savedTaskToolBuilder = taskToolBuilderRepository.save(ttb);
        return ApiResponse.success(savedTaskToolBuilder, "TaskToolBuilder 생성 성공");
    }


    public ApiResponse<TaskToolBuilder> getTaskToolBuilderById(int id) {
        return taskToolBuilderRepository.findById(id)
                .map(taskToolBuilder -> ApiResponse.success(taskToolBuilder, "TaskToolBuilder 조회 성공"))
                .orElse(ApiResponse.error(HttpStatus.NOT_FOUND, "TaskToolBuilder를 찾을 수 없습니다."));
    }

    public ApiResponse<List<TaskToolBuilder>> getAllTaskToolBuilder() {
        List<TaskToolBuilder> taskToolBuilders = taskToolBuilderRepository.findAll();
        return ApiResponse.success(taskToolBuilders, "전체 TaskToolBuilder 조회 성공");
    }

    @Transactional
    public ApiResponse<TaskToolBuilder> updateTaskToolBuilder(int id, TaskRequest request) {
        return taskToolBuilderRepository.findById(id)
                .map(ttb -> {
                    ttb.setTitle(Optional.ofNullable(request.getTitle()).orElse(ttb.getTitle()));
                    ttb.setContent(Optional.ofNullable(request.getContent()).orElse(ttb.getContent()));
                    TaskToolBuilder updatedTaskToolBuilder = taskToolBuilderRepository.save(ttb);
                    return ApiResponse.success(updatedTaskToolBuilder, "TaskToolBuilder 수정 성공");
                })
                .orElse(ApiResponse.error(HttpStatus.NOT_FOUND, "TaskToolBuilder를 찾을 수 없습니다."));
    }

    // DTO 안썼음
    @Transactional
    public ApiResponse<TaskToolBuilder> updatePDFForTaskToolBuilder(int taskToolBuilderId, int pdfId) {
        Optional<TaskToolBuilder> ttbOptional = taskToolBuilderRepository.findById(taskToolBuilderId);
        if (ttbOptional.isEmpty()) {
            return ApiResponse.error(HttpStatus.NOT_FOUND, "해당 TaskToolBuilder를 찾을 수 없습니다.");
        }

        Optional<PDFFile> pdfOptional = pdfRepository.findById(pdfId);
        if (pdfOptional.isEmpty()) {
            return ApiResponse.error(HttpStatus.NOT_FOUND, "해당 PDF 파일을 찾을 수 없습니다.");
        }

        TaskToolBuilder taskToolBuilder = ttbOptional.get();
        taskToolBuilder.setPdfFile(pdfOptional.get());  // PDF 연결
        TaskToolBuilder updatedTTB = taskToolBuilderRepository.save(taskToolBuilder);

        return ApiResponse.success(updatedTTB, "TaskToolBuilder에 PDF 연결 성공");
    }


    @Transactional
    public ApiResponse<String> deleteTaskToolBuilder(int id) {
        if (taskToolBuilderRepository.existsById(id)) {
            taskToolBuilderRepository.deleteById(id);
            return ApiResponse.success(null, "TaskToolBuilder 삭제 성공");
        }
        return ApiResponse.error(HttpStatus.NOT_FOUND, "TaskToolBuilder를 찾을 수 없습니다.");
    }
}
