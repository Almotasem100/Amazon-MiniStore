package com.example.amazon;

import jakarta.persistence.*;

@Entity
@Table(name = "users")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String username;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = false)
    private String password;

    private String gender;
    private String country;
    private String phone;

    private String address; // NEW

    @Column(nullable = false)
    private String role = "USER"; // "USER" by default, can be "ADMIN"

    // Add address and role to constructors, getters, setters!
    public User() {}

    public User(String username, String email, String password, String gender, String country, String phone, String address, String role) {
        this.username = username;
        this.email = email;
        this.password = password;
        this.gender = gender;
        this.country = country;
        this.phone = phone;
        this.address = address;
        this.role = role;
    }

    // Getters and setters
    public Long getId() { return id; }
    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }
    public String getGender() { return gender; }
    public void setGender(String gender) { this.gender = gender; }
    public String getCountry() { return country; }
    public void setCountry(String country) { this.country = country; }
    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }
    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }
    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }
}
