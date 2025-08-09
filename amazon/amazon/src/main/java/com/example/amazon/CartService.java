package com.example.amazon;

import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class CartService {

    private final CartRepository cartRepository;

    public CartService(CartRepository cartRepository) {
        this.cartRepository = cartRepository;
    }

    public List<Cart> getCartForUser(String username) {
        return cartRepository.findByUsername(username);
    }

    public Cart addToCart(Cart cartItem) {
        return cartRepository.save(cartItem);
    }

    public void removeItem(Long id, String username) {
        Cart item = cartRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Item not found"));
        if (!item.getUsername().equals(username)) {
            throw new RuntimeException("Not authorized to remove this item");
        }
        cartRepository.deleteById(id);
    }

    public void clearCart(String username) {
        cartRepository.deleteByUsername(username);
    }
}
