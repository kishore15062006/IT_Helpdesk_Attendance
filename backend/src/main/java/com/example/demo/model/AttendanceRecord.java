package com.example.demo.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "attendance_records")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class AttendanceRecord {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name; // Username of employee
    private String shift; // "Morning", "Evening", "Night"
    private String checkIn; // e.g. "09:15"
    private String checkOut; // e.g. "17:30"
    private String workingHours; // e.g. "8h 15m"
    private String status; // "Present", "Late", "Absent", "Leave", "Full Day", "Half Day", etc.
    private String date; // ISO timestamp string or simple date string
}
