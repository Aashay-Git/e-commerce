package com.example.ecommerce.service;

import com.example.ecommerce.entity.Product;
import com.example.ecommerce.entity.User;
import com.example.ecommerce.entity.Wishlist;
import com.example.ecommerce.entity.WishlistItem;
import com.example.ecommerce.repository.ProductRepository;
import com.example.ecommerce.repository.UserRepository;
import com.example.ecommerce.repository.WishlistRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class WishlistService {
    @Autowired
    private WishlistRepository wishlistRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ProductRepository productRepository;

    public Wishlist getWishlistByUserEmail(String email) {
        User user = userRepository.findByEmail(email).orElseThrow(() -> new RuntimeException("User not found"));
        return wishlistRepository.findByUserId(user.getId()).orElseGet(() -> {
            Wishlist wishlist = new Wishlist();
            wishlist.setUser(user);
            return wishlistRepository.save(wishlist);
        });
    }

    public Wishlist addToWishlist(String email, Long productId) {
        Wishlist wishlist = getWishlistByUserEmail(email);
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        boolean exists = wishlist.getItems().stream().anyMatch(item -> item.getProduct().getId().equals(productId));
        if (!exists) {
            WishlistItem item = new WishlistItem();
            item.setWishlist(wishlist);
            item.setProduct(product);
            wishlist.getItems().add(item);
            wishlistRepository.save(wishlist);
        }
        return wishlist;
    }

    public Wishlist removeFromWishlist(String email, Long itemId) {
        Wishlist wishlist = getWishlistByUserEmail(email);
        wishlist.getItems().removeIf(item -> item.getId().equals(itemId));
        return wishlistRepository.save(wishlist);
    }
}
