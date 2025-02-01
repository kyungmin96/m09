package ssafy.m09.domain;

import jakarta.persistence.*;

@Entity
@Table(name = "user_authorities")
public class UserAuthority {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    private int authority_id;
}
