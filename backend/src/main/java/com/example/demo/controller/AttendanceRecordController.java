package com.example.demo.controller;

import com.example.demo.model.AttendanceRecord;
import com.example.demo.repository.AttendanceRecordRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/attendance")
public class AttendanceRecordController {

    @Autowired
    private AttendanceRecordRepository attendanceRecordRepository;

    @GetMapping
    public ResponseEntity<List<AttendanceRecord>> getAllRecords() {
        return ResponseEntity.ok(attendanceRecordRepository.findAll());
    }

    @GetMapping("/user/{username}")
    public ResponseEntity<List<AttendanceRecord>> getUserRecords(@PathVariable String username) {
        return ResponseEntity.ok(attendanceRecordRepository.findByName(username));
    }

    @PostMapping("/check-in")
    public ResponseEntity<?> checkIn(@RequestBody AttendanceRecord recordReq) {
        // Calculate status (Present or Late)
        String checkInTimeStr = recordReq.getCheckIn(); // format: "HH:mm"
        String shiftType = recordReq.getShift();
        String status = "Present";
        String shiftStartTime = "09:00";
        
        if ("Evening".equalsIgnoreCase(shiftType)) {
            shiftStartTime = "14:00";
        } else if ("Night".equalsIgnoreCase(shiftType)) {
            shiftStartTime = "22:00";
        }

        if (checkInTimeStr != null && checkInTimeStr.compareTo(shiftStartTime) > 0) {
            status = "Late";
        }

        AttendanceRecord record = new AttendanceRecord();
        record.setName(recordReq.getName());
        record.setShift(recordReq.getShift());
        record.setCheckIn(recordReq.getCheckIn());
        record.setCheckOut(null);
        record.setWorkingHours(null);
        record.setStatus(status);
        record.setDate(recordReq.getDate());

        AttendanceRecord saved = attendanceRecordRepository.save(record);
        return ResponseEntity.ok(saved);
    }

    @PostMapping("/check-out")
    public ResponseEntity<?> checkOut(@RequestBody CheckoutRequest request) {
        Optional<AttendanceRecord> recordOpt = attendanceRecordRepository.findById(request.getId());
        if (!recordOpt.isPresent()) {
            return ResponseEntity.notFound().build();
        }

        AttendanceRecord record = recordOpt.get();
        String checkOutTime = request.getTime(); // format: "HH:mm"
        record.setCheckOut(checkOutTime);

        // Compute working hours and final status
        try {
            String[] checkInParts = record.getCheckIn().split(":");
            String[] checkOutParts = checkOutTime.split(":");
            int inH = Integer.parseInt(checkInParts[0]);
            int inM = Integer.parseInt(checkInParts[1]);
            int outH = Integer.parseInt(checkOutParts[0]);
            int outM = Integer.parseInt(checkOutParts[1]);

            int inMinutes = inH * 60 + inM;
            int outMinutes = outH * 60 + outM;

            if (outMinutes < inMinutes) {
                outMinutes += 24 * 60; // overnight shift
            }

            int diff = outMinutes - inMinutes;
            int hours = diff / 60;
            int minutes = diff % 60;

            record.setWorkingHours(hours + "h " + minutes + "m");

            String baseStatus;
            if (hours >= 8) {
                baseStatus = "Full Day";
            } else if (hours >= 4) {
                baseStatus = "Half Day";
            } else {
                baseStatus = "Absent";
            }

            if ("Late".equalsIgnoreCase(record.getStatus()) && !"Absent".equals(baseStatus)) {
                record.setStatus("Late (" + baseStatus + ")");
            } else {
                record.setStatus(baseStatus);
            }
        } catch (Exception e) {
            record.setStatus("Present");
            record.setWorkingHours("—");
        }

        AttendanceRecord saved = attendanceRecordRepository.save(record);
        return ResponseEntity.ok(saved);
    }

    @DeleteMapping("/clear")
    public ResponseEntity<?> clearRecords() {
        attendanceRecordRepository.deleteAll();
        return ResponseEntity.ok().build();
    }

    public static class CheckoutRequest {
        private Long id;
        private String time;

        public Long getId() {
            return id;
        }

        public void setId(Long id) {
            this.id = id;
        }

        public String getTime() {
            return time;
        }

        public void setTime(String time) {
            this.time = time;
        }
    }
}
