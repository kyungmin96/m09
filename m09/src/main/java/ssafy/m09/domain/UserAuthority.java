package ssafy.m09.domain;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "user_authorities", uniqueConstraints = { @UniqueConstraint(columnNames = { "user_id", "authority_id" }) })
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserAuthority {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne
    @JoinColumn(name = "authority_id", nullable = false)
    private Authority authority;
}

