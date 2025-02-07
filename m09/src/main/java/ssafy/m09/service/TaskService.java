package ssafy.m09.service;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import ssafy.m09.domain.Task;
import ssafy.m09.domain.en.TaskStatus;
import ssafy.m09.dto.TaskRequest;
import ssafy.m09.repository.TaskRepository;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class TaskService {
    private final TaskRepository taskRepository;

    @Transactional
    public Task createTask(TaskRequest request) {
        //
        Task task = Task.builder()
                .title(request.getTitle())
                .content(request.getContent())
//                .comment(request.getComment())
                .location(request.getLocation())
//                .assignedUser(request.getAssignedUser())
//                .vehicle(request.getVehicle())
                .scheduledStartTime(request.getScheduledStartTime())
                .scheduledEndTime(request.getScheduledEndTime())
//                .startTime(request.getStartTime())
//                .endTime(request.getEndTime())
                .taskState(TaskStatus.START)
                .build();

        return taskRepository.save(task);
    }

    public Optional<Task> getTaskById(int id) {
        return taskRepository.findById(id);
    }

    public List<Task> getAllTasks() {
        return taskRepository.findAll();
    }

    @Transactional
    public Optional<Task> updateTask(int id, TaskRequest request) {
        return taskRepository.findById(id).map(task -> {
            task.setTitle(Optional.ofNullable(request.getTitle()).orElse(task.getTitle()));
            task.setContent(Optional.ofNullable(request.getContent()).orElse(task.getContent()));
            task.setComment(Optional.ofNullable(request.getComment()).orElse(task.getComment()));
            task.setLocation(Optional.ofNullable(request.getLocation()).orElse(task.getLocation()));
            task.setAssignedUser(Optional.ofNullable(request.getAssignedUser()).orElse(task.getAssignedUser()));
            task.setVehicle(Optional.ofNullable(request.getVehicle()).orElse(task.getVehicle()));
            task.setScheduledStartTime(Optional.ofNullable(request.getScheduledStartTime()).orElse(task.getScheduledStartTime()));
            task.setScheduledEndTime(Optional.ofNullable(request.getScheduledEndTime()).orElse(task.getScheduledEndTime()));
            task.setStartTime(Optional.ofNullable(request.getStartTime()).orElse(task.getStartTime()));
            task.setEndTime(Optional.ofNullable(request.getEndTime()).orElse(task.getEndTime()));
            task.setTaskState(Optional.ofNullable(request.getTaskState()).orElse(task.getTaskState()));

            return taskRepository.save(task);
        });
    }

    @Transactional
    public boolean deleteTaskById(int id) {
        if (taskRepository.existsById(id)) {
            taskRepository.deleteById(id);
            return true;
        }
        return false;
    }
}
