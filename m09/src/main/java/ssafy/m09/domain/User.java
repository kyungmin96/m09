package ssafy.m09.domain;

import jakarta.persistence.*;

@Entity
@Table(name = "users")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    private String username;
    private String password;
    private String name;

    // data type 수정 필요
    private String profile_image;
    private String created_at;
    private String updated_at;
}
