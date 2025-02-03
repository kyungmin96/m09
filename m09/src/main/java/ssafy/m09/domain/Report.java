package ssafy.m09.domain;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "reports")
@Getter
@Setter
@NoArgsConstructor @AllArgsConstructor
@Builder
public class Report {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @ManyToOne
    @JoinColumn(name="task_id")
    private Task task;

    @Lob
    private String content;

    @Column(nullable = false, updatable = false)
    private LocalDateTime created_at = LocalDateTime.now();
    private LocalDateTime updated_at;
}
