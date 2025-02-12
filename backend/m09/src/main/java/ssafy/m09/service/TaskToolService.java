package ssafy.m09.service;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import ssafy.m09.domain.Task;
import ssafy.m09.domain.TaskTool;
import ssafy.m09.domain.Tool;
import ssafy.m09.dto.request.TaskToolRequest;
import ssafy.m09.repository.TaskRepository;
import ssafy.m09.repository.TaskToolRepository;
import ssafy.m09.repository.ToolRepository;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class TaskToolService {
    private final TaskToolRepository taskToolRepository;
    private final TaskRepository taskRepository;
    private final ToolRepository toolRepository;

    @Transactional
    public TaskTool createTaskTool(TaskToolRequest request) {
        Task task = taskRepository.findById(request.getTaskId())
                .orElseThrow(() -> new IllegalArgumentException("Task not found"));
        Tool tool = toolRepository.findById(request.getToolId())
                .orElseThrow(() -> new IllegalArgumentException("Tool not found"));

        TaskTool taskTool = TaskTool.builder()
                .task(task)
                .tool(tool)
                .build();

        return taskToolRepository.save(taskTool);
    }

    public Optional<TaskTool> getTaskToolById(int id){return taskToolRepository.findById(id);}

    public List<TaskTool> getAllTaskTool(){return taskToolRepository.findAll();}

    @Transactional
    public Optional<TaskTool> updateTaskTool(int id, TaskToolRequest request) {
        Task task = taskRepository.findById(request.getTaskId())
                .orElseThrow(() -> new IllegalArgumentException("Task not found"));
        Tool tool = toolRepository.findById(request.getToolId())
                .orElseThrow(() -> new IllegalArgumentException("Tool not found"));

        return taskToolRepository.findById(id).map(taskTool->{
            taskTool.setTask(task);
            taskTool.setTool(tool);

            return taskToolRepository.save(taskTool);
        });
    }

    @Transactional
    public boolean deleteTaskToolById(int id) {
        if(taskToolRepository.existsById(id)){
            taskToolRepository.deleteById(id);
            return true;
        }
        return false;
    }
}
