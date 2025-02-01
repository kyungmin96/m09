package ssafy.m09.domain;

import jakarta.persistence.*;

@Entity
@Table(name = "vehicle_usage_logs")
public class VehicleUsageLog {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    private int vehicle_id;
    private int user_id;
    // data type 수정 필요
    private String updated_at;
    private String created_at;
}
