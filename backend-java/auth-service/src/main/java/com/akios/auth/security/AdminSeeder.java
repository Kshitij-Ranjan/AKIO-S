package com.akios.auth.security;

import com.akios.auth.model.User;
import com.akios.auth.repository.UserRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class AdminSeeder implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    
    @Value("${admin.username:admin}")
    private String adminUsername;
    
    @Value("${admin.password:12345678}")
    private String adminPassword;

    public AdminSeeder(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) {
        if (userRepository.findByUsername(adminUsername).isEmpty()) {
            User admin = new User();
            admin.setUsername(adminUsername);
            admin.setPasswordHash(passwordEncoder.encode(adminPassword));
            admin.setRole("ROLE_ADMIN");
            userRepository.save(admin);
            System.out.println("Default admin user created with username: " + adminUsername);
        } else {
            System.out.println("Admin user already exists.");
        }
    }
}
