package com.example.ecommerce.controller;

import com.example.ecommerce.entity.Address;
import com.example.ecommerce.entity.User;
import com.example.ecommerce.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/users")
public class UserController {
    @Autowired
    private UserService userService;

    private String getCurrentUserEmail() {
        return SecurityContextHolder.getContext().getAuthentication().getName();
    }

    @GetMapping("/profile")
    public User getProfile() {
        return userService.getUserByEmail(getCurrentUserEmail());
    }

    @GetMapping("/addresses")
    public List<Address> getAddresses() {
        return userService.getUserAddresses(getCurrentUserEmail());
    }

    @PostMapping("/addresses")
    public Address addAddress(@RequestBody Address address) {
        return userService.addAddress(getCurrentUserEmail(), address);
    }
}
