package com.example.ecommerce.controller;

import com.example.ecommerce.dto.OrderRequest;
import com.example.ecommerce.entity.Order;
import com.example.ecommerce.service.OrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/orders")
public class OrderController {
    @Autowired
    private OrderService orderService;

    private String getCurrentUserEmail() {
        return SecurityContextHolder.getContext().getAuthentication().getName();
    }

    @PostMapping
    public Order placeOrder(@RequestBody OrderRequest orderRequest) {
        return orderService.placeOrder(getCurrentUserEmail(), orderRequest);
    }

    @GetMapping
    public List<Order> getUserOrders() {
        return orderService.getUserOrders(getCurrentUserEmail());
    }

    @GetMapping("/{id}")
    public Order getOrderById(@PathVariable Long id) {
        return orderService.getOrderById(getCurrentUserEmail(), id);
    }

    @PutMapping("/{id}/cancel")
    public Order cancelOrder(@PathVariable Long id) {
        return orderService.cancelOrder(getCurrentUserEmail(), id);
    }

    // Admin endpoints
    @GetMapping("/all")
    @org.springframework.security.access.prepost.PreAuthorize("hasRole('ADMIN')")
    public List<Order> getAllOrders() {
        return orderService.getAllOrders();
    }

    @PutMapping("/{id}/status")
    @org.springframework.security.access.prepost.PreAuthorize("hasRole('ADMIN')")
    public Order updateOrderStatus(@PathVariable Long id, @RequestBody java.util.Map<String, String> statusUpdate) {
        return orderService.updateOrderStatus(id, statusUpdate.get("status"));
    }

    @PutMapping("/{id}/cancel-admin")
    @org.springframework.security.access.prepost.PreAuthorize("hasRole('ADMIN')")
    public Order cancelOrderAdmin(@PathVariable Long id) {
        return orderService.cancelOrderAdmin(id);
    }
}
