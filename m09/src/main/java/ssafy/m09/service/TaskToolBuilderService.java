package ssafy.m09.service;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import ssafy.m09.domain.TaskToolBuilder;
import ssafy.m09.dto.TaskRequest;
import ssafy.m09.repository.TaskToolBuilderRepository;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class TaskToolBuilderService {
    private final TaskToolBuilderRepository taskToolBuilderRepository;

    // TaskRequest DTO 사용
    @Transactional
    public TaskToolBuilder createTaskToolBuilder(TaskRequest request) {
        TaskToolBuilder ttb = TaskToolBuilder.builder()
                .title(request.getTitle())
                .content(request.getContent())
                .build();
        return taskToolBuilderRepository.save(ttb);
    }

    public Optional<TaskToolBuilder> getTaskToolBuilderById(int id){ return taskToolBuilderRepository.findById(id); }

    public List<TaskToolBuilder> getAllTaskToolBuilder(){ return taskToolBuilderRepository.findAll(); }

    @Transactional
    public Optional<TaskToolBuilder> updateTaskToolBuilder(int id, TaskRequest request) {
        return taskToolBuilderRepository.findById(id).map(ttb->{
            ttb.setTitle(request.getTitle());
            ttb.setContent(request.getContent());

            return taskToolBuilderRepository.save(ttb);
        });
    }

    @Transactional
    public boolean deleteTaskToolBuilder(int id) {
        if(taskToolBuilderRepository.existsById(id)) {
            taskToolBuilderRepository.deleteById(id);
            return true;
        }
        return false;
    }
}
