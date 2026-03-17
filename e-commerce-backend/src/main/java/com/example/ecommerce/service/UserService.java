package com.example.ecommerce.service;

import com.example.ecommerce.entity.Address;
import com.example.ecommerce.entity.User;
import com.example.ecommerce.repository.AddressRepository;
import com.example.ecommerce.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UserService {
    @Autowired
    private UserRepository userRepository;

    @Autowired
    private AddressRepository addressRepository;

    public User getUserByEmail(String email) {
        return userRepository.findByEmail(email).orElseThrow(() -> new RuntimeException("User not found"));
    }

    public Address addAddress(String email, Address address) {
        User user = getUserByEmail(email);
        address.setUser(user);
        return addressRepository.save(address);
    }

    public List<Address> getUserAddresses(String email) {
        User user = getUserByEmail(email);
        return user.getAddresses();
    }
}
