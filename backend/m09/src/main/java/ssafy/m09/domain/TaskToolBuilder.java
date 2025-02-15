package ssafy.m09.domain;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "tasks_tools_builder")
@Getter
@Setter
@NoArgsConstructor @AllArgsConstructor
@Builder
public class TaskToolBuilder {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @Column(nullable = false)
    private String title;

    @ManyToOne
    @JoinColumn(name = "pdf_file_id")  // TaskToolBuilder가 PDFFile과 연결
    private PDFFile pdfFile;

    @Lob
    @Column(nullable = false)
    private String content;
}
