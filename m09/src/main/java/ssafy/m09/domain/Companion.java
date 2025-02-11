package ssafy.m09.domain;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "companions")
@Setter
@Getter
@NoArgsConstructor @AllArgsConstructor
@Builder
public class Companion {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @ManyToOne
    @JoinColumn(name ="user_id")
    private User user;

    @ManyToOne
    @JoinColumn(name ="task_id")
    private Task task;
}
