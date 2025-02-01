package ssafy.m09.domain;

import jakarta.persistence.*;

@Entity
@Table(name = "tasks")
public class Task {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;
    private String title;
    private String content;
    // Json type
    private String tags;

    private int assigned_user_id;
    private String location;
    private int vehicle_id;

    private String scheduled_start_time;
    private String scheduled_end_time;

    private String start_time;
    private String end_time;
    boolean is_completed;

    private String created_at;
    private String updated_at;
}
