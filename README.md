
# Ecommerce API

A robust, scalable backend for modern online stores, built with Node.js, Express, and MongoDB. This API demonstrates advanced backend engineering, clean architecture, and best practices for real-world ecommerce platforms.

## 🚀 Features

- **User Authentication & Authorization**  
    Secure JWT-based login, registration, and role-based access control (user, manager, admin).

- **Product Management**  
    Full CRUD for products, categories, subcategories, brands, and image uploads.

- **Shopping Cart & Wishlist**  
    Add, update, and remove items; persistent cart and wishlist per user.

- **Order Processing**  
    Create orders, track status, calculate totals, and manage shipping/payment methods.

- **Coupon System**  
    Apply discounts and manage coupon codes.

- **Review & Rating System**  
    Users can review products, rate them, and see average ratings.

- **Address Management**  
    Save and manage multiple shipping addresses.

- **RESTful API Design**  
    Follows REST principles, with clear resource-based endpoints.

- **Error Handling & Validation**  
    Centralized error middleware, custom validators, and async wrappers for clean code.

- **Security Best Practices**  
    Input sanitization, password hashing, and secure cookie handling.

- **Scalable Structure**  
    Modular controllers, models, routes, and middlewares for easy maintenance and extension.

## 🛠️ Technologies

- Node.js, Express.js
- MongoDB & Mongoose
- JWT Authentication
- Multer (image uploads)
- dotenv (environment management)
- Morgan (logging)
- bcrypt (password hashing)

## 📦 Installation

```bash
git clone https://github.com/mahmoud142/ecommerce-api.git
cd ecommerce-api
npm install
```

## ⚙️ Configuration

- Copy `.env.example` to `.env` and fill in your environment variables.

## ▶️ Usage

```bash
npm run dev
```
Server runs on `http://localhost:3000` (or your configured port).

## 📚 API Endpoints

- `/api/auth` - Authentication
- `/api/users` - User management
- `/api/products` - Product catalog
- `/api/orders` - Orders
- `/api/cart` - Shopping cart
- `/api/wishlist` - Wishlist
- `/api/reviews` - Product reviews
- `/api/categories` - Categories
- `/api/subcategories` - Subcategories
- `/api/brands` - Brands
- `/api/coupons` - Coupons
- `/api/addresses` - Addresses

## 🧑‍💻 Contributing

Pull requests and issues are welcome! This project is designed for learning, portfolio, and real-world use.

## 📄 License

MIT License