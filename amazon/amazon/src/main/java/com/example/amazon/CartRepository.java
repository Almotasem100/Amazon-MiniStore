package com.example.amazon;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface CartRepository extends JpaRepository<Cart, Long> {
    List<Cart> findByUsername(String username);
    void deleteByUsername(String username);
}
