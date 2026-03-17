# E-Commerce Platform

A full-stack e-commerce application developed using Spring Boot and React for a seamless user experience. It includes secure authentication, product management, shopping cart, wishlist, and order processing features.
The system also provides a comprehensive admin dashboard for efficient management and control.

---

## Features

### Customer
- **JWT Authentication** — Secure login & registration
- **Product Browsing** — Browse by category, view product details
- **Shopping Cart** — Add, update, and remove items
- **Wishlist** — Save products for later
- **Orders** — Place orders, track status, view order history
- **Checkout** — Streamlined checkout flow

### Admin
- **Dashboard** — Overview and statistics
- **Product Management** — Create, update, and delete products
- **Category Management** — Organize products into categories
- **Order Management** — View all orders, update order status
- **User Management** — View and manage registered users

---

## Tech Stack

| Layer       | Technology                                                                 |
|-------------|---------------------------------------------------------------------------|
| **Frontend** | React 19, Vite, React Router, Axios, Lucide React, React Toastify        |
| **Backend**  | Spring Boot 3.4, Spring Security, Spring Data JPA, JWT (jjwt 0.12)       |
| **Database** | MySQL                                                                     |
| **Build**    | Maven (backend), npm (frontend)                                           |
| **Language** | Java 21, JavaScript (ES Modules)                                          |

---

## Project Structure

```
e-commerce/
├── e-commerce-backend/          # Spring Boot REST API
│   └── src/main/java/com/example/ecommerce/
│       ├── config/              # Data initializer
│       ├── controller/          # REST controllers
│       ├── dto/                 # Request/Response DTOs
│       ├── entity/              # JPA entities
│       ├── repository/          # Spring Data repositories
│       ├── security/            # Security config, JWT filter & utils
│       └── service/             # Business logic
│
├── e-commerce-frontend/         # React SPA
│   └── src/
│       ├── components/          # Reusable UI components (Navbar, ProductCard, Admin)
│       ├── context/             # Auth & Cart context providers
│       ├── pages/               # Page-level components (Home, Cart, Orders, Admin)
│       ├── services/            # API service layer (Axios)
│       └── assets/              # Styles & static assets
│
└── README.md
```

---

## Getting Started

### Prerequisites

- **Java 21** (JDK)
- **Node.js 18+** & **npm**
- **MySQL 8+**
- **Maven** (or use the included Maven wrapper)

### 1. Database Setup

```sql
CREATE DATABASE ecommerce_db;
```

### 2. Backend Setup

```bash
cd e-commerce-backend

# Configure database connection in src/main/resources/application.properties
# (set spring.datasource.url, username, password)

# Run using Maven wrapper
./mvnw spring-boot:run
```

The backend starts on **`http://localhost:8080`** by default.

### 3. Frontend Setup

```bash
cd e-commerce-frontend

npm install
npm run dev
```

The frontend starts on **`http://localhost:5173`** by default.

---

## API Endpoints

### Authentication
| Method | Endpoint               | Description         |
|--------|------------------------|---------------------|
| POST   | `/api/auth/login`      | User login          |
| POST   | `/api/auth/register`   | User registration   |

### Products
| Method | Endpoint                  | Description               |
|--------|---------------------------|---------------------------|
| GET    | `/api/products`           | List all products         |
| GET    | `/api/products/{id}`      | Get product by ID         |
| POST   | `/api/products`           | Create product (Admin)    |
| PUT    | `/api/products/{id}`      | Update product (Admin)    |
| DELETE | `/api/products/{id}`      | Delete product (Admin)    |

### Cart
| Method | Endpoint              | Description             |
|--------|-----------------------|-------------------------|
| GET    | `/api/cart`           | View cart               |
| POST   | `/api/cart/add`       | Add item to cart        |
| DELETE | `/api/cart/remove`    | Remove item from cart   |

### Orders
| Method | Endpoint               | Description              |
|--------|------------------------|--------------------------| 
| GET    | `/api/orders`          | List user orders         |
| GET    | `/api/orders/{id}`     | Get order details        |
| POST   | `/api/orders`          | Place a new order        |

### Wishlist
| Method | Endpoint                  | Description                |
|--------|---------------------------|----------------------------|
| GET    | `/api/wishlist`           | View wishlist              |
| POST   | `/api/wishlist/add`       | Add to wishlist            |
| DELETE | `/api/wishlist/remove`    | Remove from wishlist       |

---

## Security

- **JWT-based authentication** with token expiration
- **Role-based access control** — `USER` and `ADMIN` roles
- Protected admin routes on both frontend and backend
- Password encryption using BCrypt
- CORS configuration for frontend-backend communication
