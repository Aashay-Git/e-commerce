package com.example.ecommerce.controller;

import com.example.ecommerce.entity.Cart;
import com.example.ecommerce.service.CartService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/cart")
public class CartController {
    @Autowired
    private CartService cartService;

    private String getCurrentUserEmail() {
        return SecurityContextHolder.getContext().getAuthentication().getName();
    }

    @GetMapping
    public Cart getCart() {
        return cartService.getCartByUserEmail(getCurrentUserEmail());
    }

    @PostMapping("/add")
    public Cart addToCart(@RequestParam Long productId, @RequestParam int quantity) {
        return cartService.addToCart(getCurrentUserEmail(), productId, quantity);
    }

    @PutMapping("/item/{itemId}")
    public Cart updateQuantity(@PathVariable Long itemId, @RequestParam int quantity) {
        return cartService.updateQuantity(getCurrentUserEmail(), itemId, quantity);
    }

    @DeleteMapping("/item/{itemId}")
    public Cart removeFromCart(@PathVariable Long itemId) {
        return cartService.removeFromCart(getCurrentUserEmail(), itemId);
    }
}
