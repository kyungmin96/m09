package ssafy.m09.domain;

import jakarta.persistence.*;

@Entity
@Table(name = "reports")
public class Report {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    private int task_id;
    private String content;
    private String created_at;
    private String updated_at;
}
