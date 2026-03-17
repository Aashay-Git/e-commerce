package com.example.ecommerce.service;

import com.example.ecommerce.dto.OrderRequest;
import com.example.ecommerce.entity.*;
import com.example.ecommerce.repository.OrderRepository;
import com.example.ecommerce.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

@Service
public class OrderService {
    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private CartService cartService;

    @Transactional
    public Order placeOrder(String email, OrderRequest orderRequest) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Cart cart = cartService.getCartByUserEmail(email);

        if (cart.getItems().isEmpty()) {
            throw new RuntimeException("Cart is empty");
        }

        Order order = new Order();
        order.setUser(user);

        // Store shipping address snapshot
        OrderRequest.ShippingAddress shippingAddr = orderRequest.getShippingAddress();
        order.setShippingFullName(shippingAddr.getFullName());
        order.setShippingAddressLine1(shippingAddr.getAddressLine1());
        order.setShippingAddressLine2(shippingAddr.getAddressLine2());
        order.setShippingCity(shippingAddr.getCity());
        order.setShippingState(shippingAddr.getState());
        order.setShippingPostalCode(shippingAddr.getPostalCode());
        order.setShippingCountry(shippingAddr.getCountry());
        order.setShippingPhone(shippingAddr.getPhone());

        // Set payment method
        order.setPaymentMethod(orderRequest.getPaymentMethod());
        order.setStatus("PENDING");

        List<OrderItem> orderItems = new ArrayList<>();
        BigDecimal total = BigDecimal.ZERO;

        for (CartItem cartItem : cart.getItems()) {
            OrderItem orderItem = new OrderItem();
            orderItem.setOrder(order);
            orderItem.setProduct(cartItem.getProduct());
            orderItem.setQuantity(cartItem.getQuantity());
            orderItem.setPrice(cartItem.getProduct().getPrice());
            orderItems.add(orderItem);

            total = total.add(orderItem.getPrice().multiply(BigDecimal.valueOf(orderItem.getQuantity())));
        }

        order.setItems(orderItems);
        order.setTotalAmount(total);

        // Simple payment stub
        Payment payment = new Payment();
        payment.setOrder(order);
        payment.setPaymentMethod(orderRequest.getPaymentMethod());
        payment.setAmount(total);
        payment.setStatus(orderRequest.getPaymentMethod().equals("COD") ? "PENDING" : "COMPLETED");
        order.setPayment(payment);

        Order savedOrder = orderRepository.save(order);

        // Clear cart
        cartService.clearCart(email);

        return savedOrder;
    }

    public List<Order> getUserOrders(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return orderRepository.findByUserId(user.getId());
    }

    public Order getOrderById(String email, Long orderId) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));

        // Verify the order belongs to the user
        if (!order.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("Unauthorized access to order");
        }

        return order;
    }

    @Transactional
    public Order cancelOrder(String email, Long orderId) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));

        // Verify the order belongs to the user
        if (!order.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("Unauthorized access to order");
        }

        // Only allow cancelling PENDING orders
        if (!"PENDING".equals(order.getStatus())) {
            throw new RuntimeException("Only pending orders can be cancelled");
        }

        order.setStatus("CANCELLED");
        return orderRepository.save(order);
    }

    // Admin methods
    public List<Order> getAllOrders() {
        return orderRepository.findAll();
    }

    @Transactional
    public Order updateOrderStatus(Long orderId, String newStatus) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));
        order.setStatus(newStatus);
        return orderRepository.save(order);
    }

    @Transactional
    public Order cancelOrderAdmin(Long orderId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));

        // Admin can cancel any non-cancelled order
        if ("CANCELLED".equals(order.getStatus())) {
            throw new RuntimeException("Order is already cancelled");
        }

        order.setStatus("CANCELLED");
        return orderRepository.save(order);
    }
}
