package com.example.ecommerce.controller;

import com.example.ecommerce.entity.Wishlist;
import com.example.ecommerce.service.WishlistService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/wishlist")
public class WishlistController {
    @Autowired
    private WishlistService wishlistService;

    private String getCurrentUserEmail() {
        return SecurityContextHolder.getContext().getAuthentication().getName();
    }

    @GetMapping
    public Wishlist getWishlist() {
        return wishlistService.getWishlistByUserEmail(getCurrentUserEmail());
    }

    @PostMapping("/add")
    public Wishlist addToWishlist(@RequestParam Long productId) {
        return wishlistService.addToWishlist(getCurrentUserEmail(), productId);
    }

    @DeleteMapping("/item/{itemId}")
    public Wishlist removeFromWishlist(@PathVariable Long itemId) {
        return wishlistService.removeFromWishlist(getCurrentUserEmail(), itemId);
    }
}
