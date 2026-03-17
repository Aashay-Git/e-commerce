package com.example.ecommerce.config;

import com.example.ecommerce.entity.Category;
import com.example.ecommerce.entity.Product;
import com.example.ecommerce.entity.Role;
import com.example.ecommerce.repository.CategoryRepository;
import com.example.ecommerce.repository.ProductRepository;
import com.example.ecommerce.repository.RoleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;

@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired
    RoleRepository roleRepository;

    @Autowired
    CategoryRepository categoryRepository;

    @Autowired
    ProductRepository productRepository;

    @Override
    public void run(String... args) throws Exception {
        if (roleRepository.findByName("ROLE_USER").isEmpty()) {
            Role userRole = new Role();
            userRole.setName("ROLE_USER");
            roleRepository.save(userRole);
        }

        if (roleRepository.findByName("ROLE_ADMIN").isEmpty()) {
            Role adminRole = new Role();
            adminRole.setName("ROLE_ADMIN");
            roleRepository.save(adminRole);
        }

        // Seed Categories
        if (categoryRepository.count() == 0) {
            Category electronics = new Category();
            electronics.setName("Electronics");
            electronics.setDescription("Gadgets and devices");
            categoryRepository.save(electronics);

            Category fashion = new Category();
            fashion.setName("Fashion");
            fashion.setDescription("Clothing and accessories");
            categoryRepository.save(fashion);

            // Seed Products
            if (productRepository.count() == 0) {
                Product smartphone = new Product();
                smartphone.setName("Premium Smartphone");
                smartphone.setDescription("Latest model with high-res camera and fast processor.");
                smartphone.setPrice(new BigDecimal("999.99"));
                smartphone.setStock(50);
                smartphone.setImageUrl("https://placehold.co/600x400/png?text=Smartphone");
                smartphone.setCategory(electronics);
                productRepository.save(smartphone);

                Product laptop = new Product();
                laptop.setName("Ultra Slim Laptop");
                laptop.setDescription("Lightweight laptop for professionals.");
                laptop.setPrice(new BigDecimal("1299.00"));
                laptop.setStock(30);
                laptop.setImageUrl("https://placehold.co/600x400/png?text=Laptop");
                laptop.setCategory(electronics);
                productRepository.save(laptop);

                Product tshirt = new Product();
                tshirt.setName("Classic White T-Shirt");
                tshirt.setDescription("100% Cotton, comfortable fit.");
                tshirt.setPrice(new BigDecimal("29.99"));
                tshirt.setStock(100);
                tshirt.setImageUrl("https://placehold.co/600x400/png?text=T-Shirt");
                tshirt.setCategory(fashion);
                productRepository.save(tshirt);
            }
        }
    }
}
