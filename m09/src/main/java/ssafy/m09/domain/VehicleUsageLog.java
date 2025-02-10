package ssafy.m09.domain;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "vehicle_usage_logs")
@Getter
@Setter
@NoArgsConstructor @AllArgsConstructor
@Builder
public class VehicleUsageLog {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @ManyToOne
    @JoinColumn(name="user_id")
    private User user;

    @ManyToOne
    @JoinColumn(name = "task_id")
    private Task task;

    @ManyToOne
    @JoinColumn(name="vehicle_id")
    private Vehicle vehicle;

    // data type 수정 필요
    @Column(updatable = false)
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    @PrePersist
    public void prePersist() {
        createdAt = LocalDateTime.now();
    }
    @PreUpdate
    protected void onUpdate() {this.updatedAt = LocalDateTime.now();}
}
