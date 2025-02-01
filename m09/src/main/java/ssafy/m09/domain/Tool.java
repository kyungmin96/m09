package ssafy.m09.domain;

import jakarta.persistence.*;

@Entity
@Table(name = "tools")
public class Tool {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    private String name;
    private String category;
    private int quantity;
    private String created_at;
    private String updated_at;
}
