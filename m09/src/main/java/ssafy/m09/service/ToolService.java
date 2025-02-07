package ssafy.m09.service;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import ssafy.m09.domain.Tool;
import ssafy.m09.dto.ToolRequest;
import ssafy.m09.repository.ToolRepository;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class ToolService {
    private final ToolRepository toolRepository;

    @Transactional
    public Tool createTool(ToolRequest request) {
        Tool tool = Tool.builder()
                .name(request.getToolName())
                .category(request.getCategory())
                .quantity(request.getQuantity())
                .build();

        return toolRepository.save(tool);
    }

    public Optional<Tool> getToolById(int id){return toolRepository.findById(id);}

    public List<Tool> getAllTools(){return toolRepository.findAll();}

    @Transactional
    public Optional<Tool> updateTool(int id, ToolRequest request) {
        return toolRepository.findById(id).map(tool->{
            tool.setName(request.getToolName());
            tool.setCategory(request.getCategory());
            tool.setQuantity(request.getQuantity());

            return toolRepository.save(tool);
        });
    }
}
