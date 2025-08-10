package com.example.amazon;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/cart")
@CrossOrigin(origins = "http://localhost:4200", allowCredentials = "true")
public class CartController {

    private final CartService cartService;
    private final ProductRepository productRepository;

    public CartController(CartService cartService, ProductRepository productRepository) {
        this.cartService = cartService;
        this.productRepository = productRepository;
    }

    private String username(Authentication auth) {
        return auth.getName();
    }

    // Response DTO (items + totals)
    public record CartRow(
            Long id,
            Long productId,
            String productName,
            double price,
            int quantity,
            String imageUrl
    ) {}
    public record CartResponse(List<CartRow> items, double subtotal, double total, double delivery) {}

    private List<CartRow> mapRows(List<Cart> rows) {
        return rows.stream()
                .map(r -> {
                    String imageUrl = productRepository.findById(r.getProductId())
                            .map(Product::getImageUrl)
                            .orElse(null);
                    return new CartRow(
                            r.getId(),
                            r.getProductId(),
                            r.getProductName(),
                            r.getPrice(),
                            r.getQuantity(),
                            imageUrl
                    );
                })
                .toList();
    }

    @GetMapping
    public ResponseEntity<CartResponse> getCart(Authentication auth,
                                                @RequestParam(name = "delivery", defaultValue = "20") double delivery) {
        String user = username(auth);
        List<Cart> rows = cartService.getCart(user);
        double subtotal = rows.stream().mapToDouble(r -> r.getPrice() * r.getQuantity()).sum();
        double total = subtotal + delivery;
        return ResponseEntity.ok(new CartResponse(mapRows(rows), subtotal, total, delivery));
    }

    public static class AddItemRequest { public Long productId; public Integer quantity; }

    @PostMapping("/items")
    public ResponseEntity<CartResponse> addItem(@RequestBody AddItemRequest req, Authentication auth,
                                                @RequestParam(name = "delivery", defaultValue = "20") double delivery) {
        int qty = req.quantity == null ? 1 : req.quantity;
        List<Cart> rows = cartService.addItem(username(auth), req.productId, qty);
        double subtotal = rows.stream().mapToDouble(r -> r.getPrice() * r.getQuantity()).sum();
        double total = subtotal + delivery;
        return ResponseEntity.ok(new CartResponse(mapRows(rows), subtotal, total, delivery));
    }

    public static class UpdateQtyRequest { public Integer quantity; }

    @PatchMapping("/items/{rowId}")
    public ResponseEntity<CartResponse> updateQuantity(@PathVariable Long rowId, @RequestBody UpdateQtyRequest req,
                                                       Authentication auth,
                                                       @RequestParam(name = "delivery", defaultValue = "20") double delivery) {
        int qty = req.quantity == null ? 1 : req.quantity;
        List<Cart> rows = cartService.updateQuantity(username(auth), rowId, qty);
        double subtotal = rows.stream().mapToDouble(r -> r.getPrice() * r.getQuantity()).sum();
        double total = subtotal + delivery;
        return ResponseEntity.ok(new CartResponse(mapRows(rows), subtotal, total, delivery));
    }

    @DeleteMapping("/items/{rowId}")
    public ResponseEntity<CartResponse> removeItem(@PathVariable Long rowId, Authentication auth,
                                                   @RequestParam(name = "delivery", defaultValue = "20") double delivery) {
        List<Cart> rows = cartService.removeItem(username(auth), rowId);
        double subtotal = rows.stream().mapToDouble(r -> r.getPrice() * r.getQuantity()).sum();
        double total = subtotal + delivery;
        return ResponseEntity.ok(new CartResponse(mapRows(rows), subtotal, total, delivery));
    }

    @PostMapping("/checkout")
    public ResponseEntity<Void> checkout(Authentication auth) {
        cartService.clear(username(auth)); // Clear cart in DB
        return ResponseEntity.noContent().build();
    }


    @DeleteMapping
    public ResponseEntity<Void> clear(Authentication auth) {
        cartService.clear(username(auth));
        return ResponseEntity.noContent().build();
    }
}
