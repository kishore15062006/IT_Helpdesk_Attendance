package com.example.demo.controller;

import com.example.demo.model.Shift;
import com.example.demo.repository.ShiftRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/shifts")
public class ShiftController {

    @Autowired
    private ShiftRepository shiftRepository;

    @GetMapping
    public ResponseEntity<List<Shift>> getAllShifts() {
        return ResponseEntity.ok(shiftRepository.findAll());
    }

    @PostMapping("/create")
    public ResponseEntity<?> createShift(@RequestBody Shift shift) {
        Shift saved = shiftRepository.save(shift);
        return ResponseEntity.ok(saved);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteShift(@PathVariable Long id) {
        if (shiftRepository.existsById(id)) {
            shiftRepository.deleteById(id);
            return ResponseEntity.ok().build();
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @PutMapping("/{id}/remove-employee/{empId}")
    public ResponseEntity<?> removeEmployee(@PathVariable Long id, @PathVariable Long empId) {
        Optional<Shift> shiftOpt = shiftRepository.findById(id);
        if (shiftOpt.isPresent()) {
            Shift shift = shiftOpt.get();
            List<Long> updatedEmployees = shift.getEmployees().stream()
                    .filter(idVal -> !idVal.equals(empId))
                    .collect(Collectors.toList());
            shift.setEmployees(updatedEmployees);
            Shift saved = shiftRepository.save(shift);
            return ResponseEntity.ok(saved);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @PutMapping("/{id}/reassign")
    public ResponseEntity<?> reassignEmployee(
            @PathVariable Long id,
            @RequestParam Long oldEmpId,
            @RequestParam Long newEmpId) {
        Optional<Shift> shiftOpt = shiftRepository.findById(id);
        if (shiftOpt.isPresent()) {
            Shift shift = shiftOpt.get();
            
            // Check for conflict on this shift (does newEmpId already exist?)
            if (shift.getEmployees().contains(newEmpId)) {
                return ResponseEntity.badRequest().body("Employee already assigned to this shift.");
            }

            List<Long> updatedEmployees = shift.getEmployees().stream()
                    .map(empId -> empId.equals(oldEmpId) ? newEmpId : empId)
                    .collect(Collectors.toList());
            shift.setEmployees(updatedEmployees);
            Shift saved = shiftRepository.save(shift);
            return ResponseEntity.ok(saved);
        } else {
            return ResponseEntity.notFound().build();
        }
    }
}
