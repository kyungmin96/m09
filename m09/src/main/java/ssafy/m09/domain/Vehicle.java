package ssafy.m09.domain;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "vehicles")
@Getter
@Setter
@NoArgsConstructor @AllArgsConstructor
@Builder
public class Vehicle {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @Column(nullable = false)
    private String name;

    // 보류
    private String location;

    private int batteryChargeRate;

    @ManyToOne
    @JoinColumn(name="manager_id", nullable = false)
    private User manger;

    private boolean isAvailable;

    @Column(updatable = false)
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        this.isAvailable = true;
        this.createdAt = LocalDateTime.now();
    }
}
