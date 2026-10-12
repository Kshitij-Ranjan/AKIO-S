package com.akios.contact.controller;

import com.akios.contact.dto.ContactRequest;
import com.akios.contact.service.ContactService;
import jakarta.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.mail.MailAuthenticationException;
import org.springframework.mail.MailException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/contact")
public class ContactController {

    private static final Logger log = LoggerFactory.getLogger(ContactController.class);

    private final ContactService contactService;

    public ContactController(ContactService contactService) {
        this.contactService = contactService;
    }

    @PostMapping
    public ResponseEntity<?> submitContactForm(@Valid @RequestBody ContactRequest request) {
        try {
            contactService.sendContactEmail(request);
            return ResponseEntity.ok(Map.of(
                "success", true,
                "message", "Thank you for reaching out. Your inquiry has been sent successfully."
            ));
        } catch (IllegalStateException e) {
            log.error("Contact service misconfigured: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.SERVICE_UNAVAILABLE).body(Map.of(
                "success", false,
                "error", "Email service is temporarily unavailable. Please contact directly via email or phone."
            ));
        } catch (MailAuthenticationException e) {
            log.error("SMTP Authentication failure: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.SERVICE_UNAVAILABLE).body(Map.of(
                "success", false,
                "error", "Email delivery failed due to mail service authentication. Please contact directly."
            ));
        } catch (MailException e) {
            log.error("SMTP Mail delivery failure: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_GATEWAY).body(Map.of(
                "success", false,
                "error", "Unable to connect to the mail delivery provider. Please try again later."
            ));
        } catch (Exception e) {
            log.error("Unexpected error processing contact inquiry: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of(
                "success", false,
                "error", "Failed to send inquiry. Please try again later."
            ));
        }
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<?> handleValidationExceptions(MethodArgumentNotValidException ex) {
        Map<String, String> errors = new HashMap<>();
        ex.getBindingResult().getFieldErrors().forEach(error -> 
            errors.put(error.getField(), error.getDefaultMessage())
        );
        return ResponseEntity.badRequest().body(Map.of(
            "success", false,
            "error", "Validation failed: please check the required fields.",
            "fieldErrors", errors
        ));
    }
}
