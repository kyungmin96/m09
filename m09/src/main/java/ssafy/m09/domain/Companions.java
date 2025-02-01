package ssafy.m09.domain;

import jakarta.persistence.*;

@Entity
@Table(name = "companions")
public class Companions {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    // Json type
    private String users;
    private int task_id;
}
