package ssafy.m09.service;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import ssafy.m09.domain.Tool;
import ssafy.m09.dto.common.ApiResponse;
import ssafy.m09.dto.request.ToolRequest;
import ssafy.m09.repository.ToolRepository;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class ToolService {
    private final ToolRepository toolRepository;

    @Transactional
    public ApiResponse<Tool> createTool(ToolRequest request) {
        if (request.getToolName() == null || request.getToolName().isEmpty()) {
            return ApiResponse.error(HttpStatus.NOT_ACCEPTABLE, "도구 이름은 필수 입력 항목입니다.");
        }
        if (request.getCategory() == null) {
            return ApiResponse.error(HttpStatus.NOT_ACCEPTABLE, "공구인지 소모품인지 입력하세요.");
        }

        if (request.getQuantity() < 0) {
            return ApiResponse.error(HttpStatus.NOT_ACCEPTABLE, "수량은 0 이상이어야 합니다.");
        }

        Tool tool = Tool.builder()
                .name(request.getToolName())
                .category(request.getCategory())
                .quantity(request.getQuantity())
                .build();

        Tool savedTool = toolRepository.save(tool);
        return ApiResponse.success(savedTool, "Tool 생성 성공");
    }


    public ApiResponse<Tool> getToolById(int id) {
        return toolRepository.findById(id)
                .map(tool -> ApiResponse.success(tool, "Tool 조회 성공"))
                .orElse(ApiResponse.error(HttpStatus.NOT_FOUND, "Tool을 찾을 수 없습니다."));
    }

    public ApiResponse<List<Tool>> getAllTools() {
        List<Tool> tools = toolRepository.findAll();
        return ApiResponse.success(tools, "전체 Tool 조회 성공");
    }

    // 폼에 비어있으면 db에 있는거 그대로 유지
    @Transactional
    public ApiResponse<Tool> updateTool(int id, ToolRequest request) {
        return toolRepository.findById(id)
                .map(tool -> {
                    tool.setName(Optional.ofNullable(request.getToolName()).orElse(tool.getName()));
                    tool.setCategory(Optional.ofNullable(request.getCategory()).orElse(tool.getCategory()));
                    tool.setQuantity(Optional.of(request.getQuantity()).orElse(tool.getQuantity()));

                    Tool updatedTool = toolRepository.save(tool);
                    return ApiResponse.success(updatedTool, "Tool 수정 성공");
                })
                .orElse(ApiResponse.error(HttpStatus.NOT_FOUND, "Tool을 찾을 수 없습니다."));
    }
}
