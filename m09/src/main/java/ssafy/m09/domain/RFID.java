package ssafy.m09.domain;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name= "rfid", uniqueConstraints = {@UniqueConstraint(columnNames= "card_key")})
@Getter
@Setter
@NoArgsConstructor @AllArgsConstructor
@Builder
public class RFID {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @OneToOne
    @JoinColumn(name="user_id", nullable = false)
    private User user;

    @Column(name="card_key", unique = true, nullable = false)
    private String cardKey;

    @Column(nullable = false, updatable = false)
    private LocalDateTime created_at = LocalDateTime.now();

    private LocalDateTime updated_at;
}
