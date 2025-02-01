package ssafy.m09.domain;

import jakarta.persistence.*;

@Entity
@Table(name = "task_tools")
public class TaskTools {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    private int task_id;
    private int tool_id;
    private int quantity;
}