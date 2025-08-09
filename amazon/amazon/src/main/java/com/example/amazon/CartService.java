package com.example.amazon;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
public class CartService {

    private final CartRepository cartRepository;
    private final ProductRepository productRepository;

    public CartService(CartRepository cartRepository, ProductRepository productRepository) {
        this.cartRepository = cartRepository;
        this.productRepository = productRepository;
    }

    public List<Cart> getCart(String username) {
        return cartRepository.findByUsername(username);
    }

    public List<Cart> addItem(String username, Long productId, int quantity) {
        if (quantity <= 0) quantity = 1;

        Cart existing = cartRepository.findByUsernameAndProductId(username, productId).orElse(null);
        if (existing != null) {
            existing.setQuantity(existing.getQuantity() + quantity);
            cartRepository.save(existing);
            return getCart(username);
        }

        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new IllegalArgumentException("Product not found: " + productId));

        Cart row = new Cart(username, product.getId(), product.getName(), product.getPrice(), quantity);
        try {
            cartRepository.save(row);
        } catch (org.springframework.dao.DataIntegrityViolationException e) {
            // Someone inserted the same (username, productId) in parallel — turn into increment
            Cart now = cartRepository.findByUsernameAndProductId(username, productId)
                    .orElseThrow(); // should exist now
            now.setQuantity(now.getQuantity() + quantity);
            cartRepository.save(now);
        }
        return getCart(username);
    }


    public List<Cart> updateQuantity(String username, Long rowId, int quantity) {
        if (quantity <= 0) quantity = 1;

        Cart row = cartRepository.findById(rowId)
                .orElseThrow(() -> new IllegalArgumentException("Cart row not found: " + rowId));

        // safety: ensure row belongs to the user
        if (!row.getUsername().equals(username)) {
            throw new IllegalArgumentException("Forbidden cart row access");
        }

        row.setQuantity(quantity);
        cartRepository.save(row);
        return getCart(username);
    }

    public List<Cart> removeItem(String username, Long rowId) {
        Cart row = cartRepository.findById(rowId)
                .orElseThrow(() -> new IllegalArgumentException("Cart row not found: " + rowId));
        if (!row.getUsername().equals(username)) {
            throw new IllegalArgumentException("Forbidden cart row access");
        }
        cartRepository.delete(row);
        return getCart(username);
    }

    public void clear(String username) {
        cartRepository.deleteByUsername(username);
    }

    /* Convenience totals */
    public double subtotal(String username) {
        return getCart(username).stream()
                .mapToDouble(r -> r.getPrice() * r.getQuantity())
                .sum();
    }

    public double totalWithDelivery(String username, double delivery) {
        return subtotal(username) + delivery;
    }
}
