package ssafy.m09.domain;

import jakarta.persistence.*;
import lombok.*;

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

    @Column(nullable = false)
    private boolean isEnabled = true;

    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    private LocalDateTime updatedAt;

    @ManyToMany(fetch=FetchType.EAGER)
    @JoinTable(name="user_authorities", joinColumns = @JoinColumn(name="user_id"),
    inverseJoinColumns = @JoinColumn(name="authority_id"))
    private Set<Authority> authorities = new HashSet<>();
}
