package ssafy.m09.service;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import ssafy.m09.domain.Task;
import ssafy.m09.domain.TaskTool;
import ssafy.m09.domain.Tool;
import ssafy.m09.dto.common.ApiResponse;
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
    public ApiResponse<TaskTool> createTaskTool(TaskToolRequest request) {
        Optional<Task> taskOptional = taskRepository.findById(request.getTaskId());
        if (taskOptional.isEmpty()) {
            return ApiResponse.error(HttpStatus.NOT_FOUND, "해당 작업(Task)을 찾을 수 없습니다.");
        }

        Optional<Tool> toolOptional = toolRepository.findById(request.getToolId());
        if (toolOptional.isEmpty()) {
            return ApiResponse.error(HttpStatus.NOT_FOUND, "해당 도구(Tool)를 찾을 수 없습니다.");
        }

        TaskTool taskTool = TaskTool.builder()
                .task(taskOptional.get())
                .tool(toolOptional.get())
                .build();

        TaskTool savedTaskTool = taskToolRepository.save(taskTool);
        return ApiResponse.success(savedTaskTool, "TaskTool 생성 성공");
    }

    public ApiResponse<TaskTool> getTaskToolById(int id) {
        Optional<TaskTool> taskToolOptional = taskToolRepository.findById(id);
        return taskToolOptional
                .map(taskTool -> ApiResponse.success(taskTool, "TaskTool 조회 성공"))
                .orElse(ApiResponse.error(HttpStatus.NOT_FOUND, "해당 TaskTool을 찾을 수 없습니다."));
    }

    public ApiResponse<List<TaskTool>> getAllTaskTool() {
        List<TaskTool> taskTools = taskToolRepository.findAll();
        if (taskTools.isEmpty()) {
            return ApiResponse.error(HttpStatus.NOT_FOUND, "TaskTool이 존재하지 않습니다.");
        }
        return ApiResponse.success(taskTools, "전체 TaskTool 조회 성공");
    }


    @Transactional
    public ApiResponse<TaskTool> updateTaskTool(int id, TaskToolRequest request) {
        Optional<TaskTool> taskToolOptional = taskToolRepository.findById(id);
        if (taskToolOptional.isEmpty()) {
            return ApiResponse.error(HttpStatus.NOT_FOUND, "해당 TaskTool을 찾을 수 없습니다.");
        }

        Optional<Task> taskOptional = taskRepository.findById(request.getTaskId());
        if (taskOptional.isEmpty()) {
            return ApiResponse.error(HttpStatus.NOT_FOUND, "해당 작업(Task)을 찾을 수 없습니다.");
        }

        Optional<Tool> toolOptional = toolRepository.findById(request.getToolId());
        if (toolOptional.isEmpty()) {
            return ApiResponse.error(HttpStatus.NOT_FOUND, "해당 도구(Tool)를 찾을 수 없습니다.");
        }

        TaskTool taskTool = taskToolOptional.get();
        taskTool.setTask(taskOptional.get());
        taskTool.setTool(toolOptional.get());

        TaskTool updatedTaskTool = taskToolRepository.save(taskTool);
        return ApiResponse.success(updatedTaskTool, "TaskTool 수정 성공");
    }

    @Transactional
    public ApiResponse<String> deleteTaskToolById(int id) {
        if (taskToolRepository.existsById(id)) {
            taskToolRepository.deleteById(id);
            return ApiResponse.success(null, "TaskTool 삭제 성공");
        }
        return ApiResponse.error(HttpStatus.NOT_FOUND, "해당 TaskTool을 찾을 수 없습니다.");
    }
}
