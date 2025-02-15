package ssafy.m09.config;

import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;
import ssafy.m09.domain.Task;
import ssafy.m09.domain.TaskTool;
import ssafy.m09.domain.Tool;
import ssafy.m09.domain.User;
import ssafy.m09.domain.en.TaskStatus;
import ssafy.m09.domain.en.ToolCategory;
import ssafy.m09.domain.en.UserRole;
import ssafy.m09.repository.TaskRepository;
import ssafy.m09.repository.TaskToolRepository;
import ssafy.m09.repository.ToolRepository;
import ssafy.m09.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final ToolRepository toolRepository;
    private final TaskRepository taskRepository;
    private final TaskToolRepository taskToolRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        initializeUsers();
        initializeTools();
        initializeTasks();
        initializeTaskTools();
    }

    private void initializeUsers() {
        if (userRepository.findByEmployeeId("1111111").isEmpty()) {
            User user = User.builder()
                    .employeeId("1111111")
                    .password(passwordEncoder.encode("123456")) // 비밀번호 암호화
                    .name("Test")
                    .isEnabled(true)
                    .createdAt(LocalDateTime.now())
                    .position(UserRole.ROLE_MANAGER)  // 권한 추가 (예시)
                    .build();
            userRepository.save(user);
            System.out.println("✅ 초기 사용자 데이터 삽입 완료: 1111111");
        }

        if (userRepository.findByEmployeeId("2222222").isEmpty()) {
            User user = User.builder()
                    .employeeId("2222222")
                    .password(passwordEncoder.encode("123456")) // 비밀번호 암호화
                    .name("Test2")
                    .isEnabled(true)
                    .createdAt(LocalDateTime.now())
                    .position(UserRole.ROLE_MEMBER)  // 권한 추가 (예시)
                    .build();
            userRepository.save(user);
            System.out.println("✅ 초기 사용자 데이터 삽입 완료: 2222222");
        }

        if (userRepository.findByEmployeeId("3333333").isEmpty()) {
            User user = User.builder()
                    .employeeId("3333333")
                    .password(passwordEncoder.encode("123456")) // 비밀번호 암호화
                    .name("Test3")
                    .isEnabled(true)
                    .createdAt(LocalDateTime.now())
                    .position(UserRole.ROLE_MEMBER)  // 권한 추가 (예시)
                    .build();
            userRepository.save(user);
            System.out.println("✅ 초기 사용자 데이터 삽입 완료: 3333333");
        }

        if (userRepository.findByEmployeeId("4444444").isEmpty()) {
            User user = User.builder()
                    .employeeId("4444444")
                    .password(passwordEncoder.encode("123456")) // 비밀번호 암호화
                    .name("Test4")
                    .isEnabled(true)
                    .createdAt(LocalDateTime.now())
                    .position(UserRole.ROLE_MEMBER)  // 권한 추가 (예시)
                    .build();
            userRepository.save(user);
            System.out.println("✅ 초기 사용자 데이터 삽입 완료: 4444444");
        }
    }

    private void initializeTools() {
        List<String> toolNames = List.of(
                "드라이버", "망치", "스패너", "펜치", "니퍼", "전동드릴", "톱", "육각렌치", "수평기", "테이프 메저",
                "볼트", "너트", "와셔", "타이랩", "전선커넥터", "케이블타이", "고무망치", "절단기", "글루건", "인두기"
        );

        toolNames.forEach(toolName -> {
            if (toolRepository.findByName(toolName).isEmpty()) {
                Tool tool = Tool.builder()
                        .name(toolName)
                        .category(toolName.contains("볼트") || toolName.contains("너트") || toolName.contains("와셔") || toolName.contains("케이블타이") || toolName.contains("타이랩")
                        || toolName.contains("전선커넥터") ? ToolCategory.CONSUMABLE : ToolCategory.TOOLS)
                        .quantity(10)  // 초기 수량은 10개로 설정
                        .build();
                toolRepository.save(tool);
                System.out.println("✅ 초기 Tool 데이터 삽입 완료: " + toolName);
            }
        });
    }

    private void initializeTasks() {
        String fixedEmployeeId = "1111111";  // 고정된 employeeId 사용

        Optional<User> userOptional = userRepository.findByEmployeeId(fixedEmployeeId);
        if (userOptional.isEmpty()) {
            System.out.println("⚠️ 초기 Task 생성 실패: 사용자(" + fixedEmployeeId + ")를 찾을 수 없습니다.");
            return;
        }

        User user = userOptional.get();

        // Task 목록
        Task[] tasks = new Task[]{
                Task.builder()
                        .title("maintenance airplane 30days")
                        .content("detach missile")
                        .location("number 2 garage")
                        .assignedUser(user)
                        .scheduledStartTime(LocalDateTime.of(2025, 2, 9, 5, 0))
                        .scheduledEndTime(LocalDateTime.of(2025, 2, 9, 5, 10))
                        .taskState(TaskStatus.START)
                        .build(),

                Task.builder()
                        .title("engine oil check")
                        .content("check engine oil pressure")
                        .location("number 1 garage")
                        .assignedUser(user)
                        .scheduledStartTime(LocalDateTime.of(2025, 2, 10, 8, 30))
                        .scheduledEndTime(LocalDateTime.of(2025, 2, 10, 9, 0))
                        .taskState(TaskStatus.START)
                        .build(),

                Task.builder()
                        .title("fuel system inspection")
                        .content("inspect and refuel fuel tank")
                        .location("fuel station")
                        .assignedUser(user)
                        .scheduledStartTime(LocalDateTime.of(2025, 2, 11, 14, 0))
                        .scheduledEndTime(LocalDateTime.of(2025, 2, 11, 15, 0))
                        .taskState(TaskStatus.START)
                        .build()
        };

        for (Task task : tasks) {
            if (taskRepository.findByTitle(task.getTitle()).isEmpty()) {
                taskRepository.save(task);
                System.out.println("✅ 초기 Task 데이터 삽입 완료: " + task.getTitle());
            }
        }
    }

    private void initializeTaskTools() {
        List<Task> tasks = taskRepository.findAll();
        List<Tool> tools = toolRepository.findAll();

        if (tasks.isEmpty() || tools.isEmpty()) {
            System.out.println("🚨 Task 또는 Tool 데이터가 부족합니다. 먼저 Task와 Tool을 생성하세요.");
            return;
        }

        // Task에 도구 연결 예시 (각 작업에 4~5개의 도구를 랜덤으로 연결)
        for (int i = 0; i < tasks.size(); i++) {
            Task task = tasks.get(i);

            // 같은 도구가 중복으로 등록되지 않도록 랜덤하게 몇 개만 선택
            int startIndex = (i * 4) % tools.size();
            int endIndex = Math.min(startIndex + 4, tools.size());

            for (int j = startIndex; j < endIndex; j++) {
                Tool tool = tools.get(j);

                // 이미 TaskTool에 등록되어 있으면 건너뜀
                Optional<TaskTool> existingTaskTool = taskToolRepository.findByTaskAndTool(task, tool);
                if (existingTaskTool.isPresent()) continue;

                TaskTool taskTool = TaskTool.builder()
                        .task(task)
                        .tool(tool)
                        .build();
                taskToolRepository.save(taskTool);
                System.out.println("✅ TaskTool 생성 완료: Task(" + task.getTitle() + ") - Tool(" + tool.getName() + ")");
            }
        }
    }
}
