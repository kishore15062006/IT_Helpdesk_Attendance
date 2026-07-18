package com.example.demo.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "leave_requests")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class LeaveRequest {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String employeeName;
    private String employeeEmail;
    private String fromDate; // YYYY-MM-DD
    private String toDate; // YYYY-MM-DD
    private String leaveType; // "Casual", "Sick", "Earned"
    
    @Column(length = 1000)
    private String reason;
    
    private String status; // "PENDING", "APPROVED", "REJECTED"
    
    @Column(length = 1000)
    private String adminComment;
    
    private String appliedAt;
}
