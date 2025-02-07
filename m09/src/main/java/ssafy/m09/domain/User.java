package ssafy.m09.domain;

import jakarta.persistence.*;
import lombok.*;
import ssafy.m09.domain.en.AuthorityPosition;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "users")
@Getter
@Setter
@NoArgsConstructor @AllArgsConstructor
@Builder
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @Column(unique = true, nullable = false)
    private String employeeId;

    @Column(nullable = false)
    private String password;

    @Column(nullable = false)
    private String name;

    // data type 수정 필요
    private String profileImage;

    @Builder.Default
    private boolean isEnabled = true;

    @Column(updatable = false)
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    @Enumerated(EnumType.STRING)
    @Column(unique = true)
    private AuthorityPosition position;

    @PrePersist
    public void prePersist() {
        createdAt = LocalDateTime.now();
    }

    @PreUpdate
    public void preUpdate() {
        updatedAt = LocalDateTime.now();
    }
}
