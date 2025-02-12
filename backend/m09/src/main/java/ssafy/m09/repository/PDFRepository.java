package ssafy.m09.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import ssafy.m09.domain.PDFFile;

public interface PDFRepository extends JpaRepository<PDFFile, Integer> {
}
