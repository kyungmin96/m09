package ssafy.m09.domain;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "task_tools")
@NoArgsConstructor @AllArgsConstructor
@Builder
public class TaskTools {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @ManyToOne
    @JoinColumn(name="task_id")
    private Task task;

    @ManyToOne
    @JoinColumn(name= "tool_id")
    private Tool tool;

    private Integer quantity;
}