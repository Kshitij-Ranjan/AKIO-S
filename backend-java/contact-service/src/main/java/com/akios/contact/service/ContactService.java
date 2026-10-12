package com.akios.contact.service;

import com.akios.contact.dto.ContactRequest;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class ContactService {

    private static final Logger log = LoggerFactory.getLogger(ContactService.class);

    private final JavaMailSender mailSender;

    @Value("${contact.to-email:akioCVE@gmail.com}")
    private String toEmail;
    
    @Value("${spring.mail.username:}")
    private String fromEmail;

    @Value("${spring.mail.password:}")
    private String mailPassword;

    public ContactService(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    public boolean isConfigured() {
        return fromEmail != null && !fromEmail.isBlank() && !fromEmail.contains("placeholder")
                && mailPassword != null && !mailPassword.isBlank() && !mailPassword.contains("placeholder");
    }

    public void sendContactEmail(ContactRequest request) {
        if (!isConfigured()) {
            log.error("SMTP credentials are not configured. MAIL_USERNAME and MAIL_PASSWORD environment variables are required.");
            throw new IllegalStateException("Email service is temporarily unconfigured on this server.");
        }

        SimpleMailMessage message = new SimpleMailMessage();
        
        message.setFrom(fromEmail);
        message.setTo(toEmail);
        message.setReplyTo(request.getEmail());
        
        boolean isProjectInquiry = request.getProjectName() != null && !request.getProjectName().trim().isEmpty();
        
        if (isProjectInquiry) {
            message.setSubject("New Project Inquiry: " + request.getProjectName());
        } else {
            message.setSubject("New Portfolio Contact — " + request.getName());
        }
        
        StringBuilder body = new StringBuilder();
        body.append("Name: ").append(request.getName()).append("\n");
        body.append("Email: ").append(request.getEmail()).append("\n\n");
        
        if (isProjectInquiry) {
            body.append("Project Name: ").append(request.getProjectName()).append("\n");
            
            if (request.getProjectType() != null) {
                body.append("Project Type: ").append(request.getProjectType()).append("\n");
            }
            if (request.getBudget() != null && !request.getBudget().trim().isEmpty()) {
                body.append("Budget: ").append(request.getBudget()).append("\n");
            }
            if (request.getDeadline() != null && !request.getDeadline().trim().isEmpty()) {
                body.append("Deadline: ").append(request.getDeadline()).append("\n");
            }
            body.append("\nProject Specifications:\n");
        } else {
            body.append("Message:\n");
        }
        
        body.append(request.getMessage());
        
        message.setText(body.toString());
        mailSender.send(message);
        log.info("Contact email successfully dispatched to {} for inquiry from {}", toEmail, request.getEmail());
    }
}
