package com.example.demo.controller;

import com.example.demo.model.LeaveRequest;
import com.example.demo.repository.LeaveRequestRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/leaves")
public class LeaveRequestController {

    @Autowired
    private LeaveRequestRepository leaveRequestRepository;

    @GetMapping
    public ResponseEntity<List<LeaveRequest>> getAllLeaves() {
        return ResponseEntity.ok(leaveRequestRepository.findAll());
    }

    @GetMapping("/user/{email}")
    public ResponseEntity<List<LeaveRequest>> getUserLeaves(@PathVariable String email) {
        return ResponseEntity.ok(leaveRequestRepository.findByEmployeeEmail(email));
    }

    @PostMapping("/apply")
    public ResponseEntity<?> applyLeave(@RequestBody LeaveRequest leaveReq) {
        leaveReq.setStatus("PENDING");
        leaveReq.setAdminComment("");
        LeaveRequest saved = leaveRequestRepository.save(leaveReq);
        return ResponseEntity.ok(saved);
    }

    @PutMapping("/update-status/{id}")
    public ResponseEntity<?> updateStatus(@PathVariable Long id, @RequestBody LeaveStatusUpdateRequest req) {
        Optional<LeaveRequest> leaveOpt = leaveRequestRepository.findById(id);
        if (leaveOpt.isPresent()) {
            LeaveRequest leave = leaveOpt.get();
            leave.setStatus(req.getStatus());
            leave.setAdminComment(req.getComment());
            LeaveRequest updated = leaveRequestRepository.save(leave);
            return ResponseEntity.ok(updated);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    public static class LeaveStatusUpdateRequest {
        private String status;
        private String comment;

        public String getStatus() {
            return status;
        }

        public void setStatus(String status) {
            this.status = status;
        }

        public String getComment() {
            return comment;
        }

        public void setComment(String comment) {
            this.comment = comment;
        }
    }
}
