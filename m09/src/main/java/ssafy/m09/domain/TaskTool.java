package ssafy.m09.domain;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "tasks_tools")
@Getter
@Setter
@NoArgsConstructor @AllArgsConstructor
@Builder
public class TaskTool {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @ManyToOne
    @JoinColumn(name="task_id")
    private Task task;

    @ManyToOne
    @JoinColumn(name= "tool_id")
    private Tool tool;
}
