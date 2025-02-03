package ssafy.m09.domain;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "tasks")
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
@Builder
public class Task {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @Column(nullable = false)
    private String title;

    @Lob
    private String content;

    @Column(columnDefinition = "JSON")
    private String tags;

    @Column(nullable = false)
    private String location;

    @ManyToOne
    @JoinColumn(name="assigned_user")
    private User assignedUser;

    @ManyToOne
    @JoinColumn(name="vehicle_id")
    private Vehicle vehicle;

    private LocalDateTime scheduled_start_time;
    private LocalDateTime scheduled_end_time;
    private LocalDateTime start_time;
    private LocalDateTime end_time;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TaskStatus is_completed;

    @Column(nullable = false, updatable = false)
    private LocalDateTime created_at = LocalDateTime.now();
    private LocalDateTime updated_at;
}

enum TaskStatus {
    START, PENDING, COMPLETED, FAILED
}