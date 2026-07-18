package com.example.demo.controller;

import com.example.demo.model.Ticket;
import com.example.demo.repository.TicketRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/tickets")
public class TicketController {

    @Autowired
    private TicketRepository ticketRepository;

    @GetMapping
    public ResponseEntity<List<Ticket>> getAllTickets() {
        return ResponseEntity.ok(ticketRepository.findAll());
    }

    @GetMapping("/admin")
    public ResponseEntity<List<Ticket>> getAdminTickets() {
        return ResponseEntity.ok(ticketRepository.findByAdminHiddenFalse());
    }

    @GetMapping("/raised-by/{email}")
    public ResponseEntity<List<Ticket>> getMyTickets(@PathVariable String email) {
        return ResponseEntity.ok(ticketRepository.findByRaisedBy(email));
    }

    @PostMapping("/raise")
    public ResponseEntity<?> raiseTicket(@RequestBody Ticket ticket) {
        ticket.setStatus("Open");
        ticket.setAdminComment("");
        ticket.setAdminHidden(false);
        Ticket saved = ticketRepository.save(ticket);
        return ResponseEntity.ok(saved);
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<?> updateTicket(@PathVariable Long id, @RequestBody TicketUpdateReq req) {
        Optional<Ticket> ticketOpt = ticketRepository.findById(id);
        if (ticketOpt.isPresent()) {
            Ticket ticket = ticketOpt.get();
            if (req.getStatus() != null) {
                ticket.setStatus(req.getStatus());
            }
            if (req.getAdminComment() != null) {
                ticket.setAdminComment(req.getAdminComment());
            }
            Ticket updated = ticketRepository.save(ticket);
            return ResponseEntity.ok(updated);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @PutMapping("/hide/{id}")
    public ResponseEntity<?> hideTicket(@PathVariable Long id) {
        Optional<Ticket> ticketOpt = ticketRepository.findById(id);
        if (ticketOpt.isPresent()) {
            Ticket ticket = ticketOpt.get();
            ticket.setAdminHidden(true);
            Ticket updated = ticketRepository.save(ticket);
            return ResponseEntity.ok(updated);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteTicket(@PathVariable Long id) {
        if (ticketRepository.existsById(id)) {
            ticketRepository.deleteById(id);
            return ResponseEntity.ok().build();
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    public static class TicketUpdateReq {
        private String status;
        private String adminComment;

        public String getStatus() {
            return status;
        }

        public void setStatus(String status) {
            this.status = status;
        }

        public String getAdminComment() {
            return adminComment;
        }

        public void setAdminComment(String adminComment) {
            this.adminComment = adminComment;
        }
    }
}
