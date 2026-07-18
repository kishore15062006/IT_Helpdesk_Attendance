package com.example.demo.model;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.List;

@Entity
@Table(name = "shifts")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Shift {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private String type; // "day", "night", "rotating", etc.
    private String start; // time string e.g. "09:00"
    private String end; // time string e.g. "17:00"

    @JsonProperty("break")
    @Column(name = "break_duration")
    private String breakDuration; // e.g. "1 hour"

    private int gracePeriod; // in minutes
    private String department;
    private String location;
    private String weekendPolicy;

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "shift_employees", joinColumns = @JoinColumn(name = "shift_id"))
    @Column(name = "employee_id")
    private List<Long> employees; // list of user ids assigned to this shift
}
