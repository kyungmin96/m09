package ssafy.m09.domain;

import jakarta.persistence.*;
import lombok.*;
import ssafy.m09.domain.en.ToolCategory;

import java.time.LocalDateTime;

@Entity
@Table(name = "tools")
@Getter
@Setter
@NoArgsConstructor @AllArgsConstructor
@Builder
public class Tool {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @Column(nullable = false)
    private String name;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ToolCategory category;
    private int quantity;

    @Column(updatable = false)
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
    }
    @PreUpdate
    protected void onUpdate() {this.updatedAt = LocalDateTime.now();}
}
