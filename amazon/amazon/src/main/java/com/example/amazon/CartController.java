package com.example.amazon;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/cart")
public class CartController {

    private final CartService cartService;

    public CartController(CartService cartService) {
        this.cartService = cartService;
    }

    @GetMapping
    public List<Cart> getCart(Authentication authentication) {
        String username = authentication.getName();
        return cartService.getCartForUser(username);
    }

    @PostMapping
    public Cart addToCart(@RequestBody Cart cart, Authentication authentication) {
        cart.setUsername(authentication.getName());
        return cartService.addToCart(cart);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> removeFromCart(@PathVariable Long id, Authentication authentication) {
        cartService.removeItem(id, authentication.getName());
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/clear")
    public ResponseEntity<?> clearCart(Authentication authentication) {
        cartService.clearCart(authentication.getName());
        return ResponseEntity.ok().build();
    }
}
