package ssafy.m09.domain;

import jakarta.persistence.*;

@Entity
@Table(name = "vehicles")
public class Vehicle {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    private String name;
    private String location;
    private int manager_id;
    boolean is_available;
    // data type 수정 필요
    private String created_at;
    private String updated_at;
}
