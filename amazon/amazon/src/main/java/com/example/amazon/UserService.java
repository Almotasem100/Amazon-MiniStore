package com.example.amazon;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    @Autowired
    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public User registerUser(String username, String email, String password, String gender, String country, String phone, String address) throws Exception {
        if (userRepository.findByUsername(username).isPresent()) {
            throw new Exception("Username is already taken.");
        }
        if (userRepository.findByEmail(email).isPresent()) {
            throw new Exception("Email is already in use.");
        }
        String encodedPassword = passwordEncoder.encode(password);
        // Default role is "USER"
        User user = new User(username, email, encodedPassword, gender, country, phone, address, "USER");
        return userRepository.save(user);
    }
    
    public Optional<User> findByUsernameOrEmail(String input) {
        return userRepository.findByUsernameOrEmail(input, input);
    }
}
