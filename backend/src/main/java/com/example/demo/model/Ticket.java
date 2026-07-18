package com.example.demo.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "tickets")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Ticket {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String raisedBy; // email of employee
    private String username;
    private String issueType; // "Attendance Issue", "Leave Issue", etc.
    private String priority; // "Low", "Medium", "High"
    
    @Column(length = 2000)
    private String description;
    
    private String status; // "Open", "In Progress", "Resolved"
    
    @Column(length = 2000)
    private String adminComment;
    
    private String createdAt;
    private boolean adminHidden;
}
