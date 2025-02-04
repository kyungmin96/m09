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
    @JoinColumn(name="vehicle_id")
    private Vehicle vehicle;

    @ManyToOne
    @JoinColumn(name="user_id")
    private User user;

    // data type 수정 필요
    @Column(nullable = false, updatable = false)
    private LocalDateTime created_at = LocalDateTime.now();

    private LocalDateTime updated_at;
}
