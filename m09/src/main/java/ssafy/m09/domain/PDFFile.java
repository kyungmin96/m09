package ssafy.m09.domain;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "pdf_files")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PDFFile {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @Column(nullable = false)
    private String fileName;

    @Column(nullable = false)
    private String filePath;

    private String fileDescription;

    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    @PrePersist
    public void prePersist() {
        createdAt = LocalDateTime.now();
    }
    @PreUpdate
    protected void onUpdate() {this.updatedAt = LocalDateTime.now();}
}
