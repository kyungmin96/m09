package ssafy.m09.domain;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "tasks_tools_builder")
@Getter
@Setter
@NoArgsConstructor @AllArgsConstructor
@Builder
public class TaskToolBuilder {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @Column(nullable = false)
    private String title;

    @Lob
    @Column(nullable = false)
    private String content;
}
