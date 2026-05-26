<div align="center">

# 🛒 ECommerce API

**A production-ready RESTful API for modern e-commerce platforms**

[![Node.js](https://img.shields.io/badge/Node.js-v20+-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-v5-000000?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![Stripe](https://img.shields.io/badge/Stripe-008CDD?style=for-the-badge&logo=stripe&logoColor=white)](https://stripe.com/)
[![Docker](https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white)](https://www.docker.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow?style=for-the-badge)](LICENSE)

<br />

[![🌐 Live Demo](https://img.shields.io/badge/🌐_Live_Demo-Shopply-0ABF53?style=for-the-badge)](https://shopplywebapp.vercel.app/)
[![Frontend Repo](https://img.shields.io/badge/Frontend_Repo-Shopply-blue?style=for-the-badge&logo=github)](https://github.com/Mahmoud142/Shopply)

<br />

A robust, scalable backend powering the full e-commerce lifecycle — from user registration with email verification and two-factor authentication, through product browsing with advanced search, to cart management, coupon discounts, and Stripe-integrated checkout.

> 🔗 **Live Frontend:** [shopplywebapp.vercel.app](https://shopplywebapp.vercel.app/) · **Frontend Source:** [Mahmoud142/Shopply](https://github.com/Mahmoud142/Shopply)

[Getting Started](#-getting-started) •
[API Reference](#-api-reference) •
[Architecture](#-architecture) •
[Deployment](#-deployment)

</div>

---

## ✨ Highlights

| Feature | Description |
|---|---|
| 🔐 **Multi-Layer Auth** | JWT access tokens, email verification (SendGrid), 2FA via OTP, and a secure forgot/reset password flow |
| 🛍️ **Full Product Catalog** | CRUD for products, categories, subcategories & brands with image uploads (Cloudinary / local) |
| 🛒 **Cart & Checkout** | Persistent shopping cart, coupon system, cash orders, and Stripe Checkout Sessions |
| ⭐ **Reviews & Ratings** | Users rate and review products; auto-calculated average ratings |
| 👥 **Role-Based Access** | Three-tier RBAC — `user`, `manager`, `admin` — enforced at the route level |
| 📄 **Swagger Docs** | Interactive OpenAPI 3.0 documentation served at `/api-docs` |
| 🐳 **Docker Ready** | Dockerfile + docker-compose for one-command deployment |
| 🛡️ **Production Hardened** | Rate limiting, input validation (express-validator), centralized error handling, bcrypt hashing |

---

## 🛠️ Tech Stack

| Layer | Technologies |
|---|---|
| **Runtime** | Node.js 20+, Express 5 |
| **Database** | MongoDB Atlas / Local, Mongoose 8 ODM |
| **Authentication** | JWT (jsonwebtoken), bcrypt, crypto (OTP hashing) |
| **Payments** | Stripe Checkout Sessions + Webhooks |
| **Email** | SendGrid (`@sendgrid/mail`) |
| **Image Processing** | Multer (upload), Sharp (resize), Cloudinary (cloud storage) |
| **Validation** | express-validator, custom validator middleware |
| **Security** | express-rate-limit, CORS, cookie-parser, input sanitization |
| **Documentation** | swagger-ui-express, OpenAPI 3.0 spec |
| **DevOps** | Docker, docker-compose, nodemon (dev) |
| **Logging** | Morgan (HTTP request logger) |

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** ≥ 20
- **MongoDB** (local instance or [MongoDB Atlas](https://www.mongodb.com/atlas) connection string)
- **npm** ≥ 9

### Installation

```bash
# Clone the repository
git clone https://github.com/Mahmoud142/ECommerce-api.git
cd ECommerce-api

# Install dependencies
npm install
```

### Environment Variables

Create a `.env` file in the project root (see the table below for all supported variables):

| Variable | Required | Description |
|---|:---:|---|
| `PORT` | ✅ | Server port (default: `3000`) |
| `NODE_ENV` | ✅ | `development` or `production` |
| `BASE_URL` | ✅ | Base URL for the API (e.g. `http://localhost:3000`) |
| `URI` | ✅ | MongoDB connection string |
| `JWT_SECRET` | ✅ | Secret key for signing access tokens |
| `JWT_EXPIRES_IN` | ✅ | Access token expiry (e.g. `30d`) |
| `JWT_REFRESH_SECRET` | ✅ | Secret key for refresh tokens |
| `JWT_REFRESH_EXPIRES_IN` | ✅ | Refresh token expiry (e.g. `90d`) |
| `STRIPE_SECRET_KEY` | ❌ | Stripe secret key (enables checkout) |
| `STRIPE_WEBHOOK_SECRET` | ❌ | Stripe webhook signing secret |
| `CLOUDINARY_CLOUD_NAME` | ❌ | Cloudinary cloud name (enables cloud image storage) |
| `CLOUDINARY_API_KEY` | ❌ | Cloudinary API key |
| `CLOUDINARY_API_SECRET` | ❌ | Cloudinary API secret |
| `SENDGRID_API_KEY` | ❌ | SendGrid API key (enables transactional emails) |
| `SENDGRID_FROM_EMAIL` | ❌ | Verified sender email address for SendGrid |

### Run the Server

```bash
# Development (hot-reload with nodemon)
npm run dev

# Production
npm start
```

The API will be available at `http://localhost:<PORT>` and interactive docs at `http://localhost:<PORT>/api-docs`.

---

## 📚 API Reference

> **Interactive Documentation:** Start the server and visit [`/api-docs`](http://localhost:3000/api-docs) for full Swagger UI.

### 🔐 Authentication

| Method | Endpoint | Description | Access |
|:---:|---|---|:---:|
| `POST` | `/api/auth/register` | Register with email verification | Public |
| `POST` | `/api/auth/login` | Login (supports 2FA flow) | Public |
| `POST` | `/api/auth/verifyEmail` | Verify email with 6-digit code | Public |
| `POST` | `/api/auth/forgotPassword` | Request password reset code | Public |
| `POST` | `/api/auth/verifyResetCode` | Verify reset code → get reset token | Public |
| `PUT` | `/api/auth/resetPassword` | Set new password with reset token | Public |
| `POST` | `/api/auth/verify2fa` | Verify 2FA OTP code | Public |
| `POST` | `/api/auth/enable2fa` | Enable two-factor authentication | 🔒 User |
| `POST` | `/api/auth/disable2fa` | Disable two-factor authentication | 🔒 User |

### 👤 Users

| Method | Endpoint | Description | Access |
|:---:|---|---|:---:|
| `GET` | `/api/users/getMe` | Get logged-in user profile | 🔒 User |
| `PUT` | `/api/users/updateMe` | Update own profile (+ image) | 🔒 User |
| `PUT` | `/api/users/changeMyPassword` | Change own password | 🔒 User |
| `DELETE` | `/api/users/deleteMe` | Deactivate own account | 🔒 User |
| `GET` | `/api/users` | List all users | 🔒 Admin |
| `POST` | `/api/users` | Create a user | 🔒 Admin |
| `GET` | `/api/users/:id` | Get user by ID | 🔒 Admin |
| `PUT` | `/api/users/:id` | Update user by ID | 🔒 Admin |
| `DELETE` | `/api/users/:id` | Delete user by ID | 🔒 Admin |
| `PUT` | `/api/users/change-password/:id` | Change any user's password | 🔒 Admin |

### 📦 Products

| Method | Endpoint | Description | Access |
|:---:|---|---|:---:|
| `GET` | `/api/products` | List/search/filter products | Public |
| `GET` | `/api/products/:id` | Get product details | Public |
| `POST` | `/api/products` | Create a product (+ images) | 🔒 Admin/Manager |
| `PUT` | `/api/products/:id` | Update a product | 🔒 Admin/Manager |
| `DELETE` | `/api/products/:id` | Delete a product | 🔒 Admin |

**Query Features:** `?page=1&limit=20&sort=-price&keyword=laptop&price[gte]=100&price[lte]=5000&fields=name,price`

### 📂 Categories / Subcategories / Brands

| Method | Endpoint | Description | Access |
|:---:|---|---|:---:|
| `GET` | `/api/categories` | List all categories | Public |
| `POST` | `/api/categories` | Create category (+ image) | 🔒 Admin/Manager |
| `GET/PUT/DELETE` | `/api/categories/:id` | Single category operations | Public / 🔒 Admin |
| `GET` | `/api/subcategories` | List all subcategories | Public |
| `POST` | `/api/subcategories` | Create subcategory | 🔒 Admin/Manager |
| `GET/PUT/DELETE` | `/api/subcategories/:id` | Single subcategory operations | Public / 🔒 Admin |
| `GET` | `/api/brands` | List all brands | Public |
| `POST` | `/api/brands` | Create brand (+ image) | 🔒 Admin/Manager |
| `GET/PUT/DELETE` | `/api/brands/:id` | Single brand operations | Public / 🔒 Admin |

### 🛒 Cart

| Method | Endpoint | Description | Access |
|:---:|---|---|:---:|
| `GET` | `/api/cart` | Get active cart | 🔒 User |
| `POST` | `/api/cart` | Add product to cart | 🔒 User |
| `PUT` | `/api/cart/:productId` | Update item quantity | 🔒 User |
| `DELETE` | `/api/cart/:productId` | Remove item from cart | 🔒 User |
| `DELETE` | `/api/cart` | Clear entire cart | 🔒 User |
| `PUT` | `/api/cart/applyCoupon` | Apply coupon code | 🔒 User |

### 🧾 Orders

| Method | Endpoint | Description | Access |
|:---:|---|---|:---:|
| `POST` | `/api/orders/:cartId` | Create a cash order | 🔒 User |
| `POST` | `/api/orders/checkout-session/:cartId` | Create Stripe checkout session | 🔒 User |
| `GET` | `/api/orders` | Get all orders | 🔒 User/Admin |
| `GET` | `/api/orders/:id` | Get order by ID | 🔒 User/Admin |
| `PUT` | `/api/orders/:id/pay` | Mark order as paid | 🔒 Admin/Manager |
| `PUT` | `/api/orders/:id/deliver` | Mark order as delivered | 🔒 Admin/Manager |

### ⭐ Reviews

| Method | Endpoint | Description | Access |
|:---:|---|---|:---:|
| `GET` | `/api/reviews` | List all reviews | Public |
| `POST` | `/api/reviews` | Create a review | 🔒 User |
| `GET` | `/api/reviews/:id` | Get review by ID | Public |
| `PUT` | `/api/reviews/:id` | Update own review | 🔒 User |
| `DELETE` | `/api/reviews/:id` | Delete review | 🔒 User/Admin |
| `GET` | `/api/products/:productId/reviews` | Get reviews for a product | Public |

### ❤️ Wishlist & 📍 Addresses

| Method | Endpoint | Description | Access |
|:---:|---|---|:---:|
| `GET` | `/api/wishlist` | Get wishlist | 🔒 User |
| `POST` | `/api/wishlist` | Add product to wishlist | 🔒 User |
| `DELETE` | `/api/wishlist/:productId` | Remove from wishlist | 🔒 User |
| `GET` | `/api/addresses` | Get saved addresses | 🔒 User |
| `POST` | `/api/addresses` | Add a new address | 🔒 User |
| `DELETE` | `/api/addresses/:addressId` | Remove an address | 🔒 User |

### 🎟️ Coupons

| Method | Endpoint | Description | Access |
|:---:|---|---|:---:|
| `GET` | `/api/coupons` | List all coupons | 🔒 Admin/Manager |
| `POST` | `/api/coupons` | Create a coupon | 🔒 Admin/Manager |
| `GET` | `/api/coupons/:id` | Get coupon by ID | 🔒 Admin/Manager |
| `PUT` | `/api/coupons/:id` | Update a coupon | 🔒 Admin/Manager |
| `DELETE` | `/api/coupons/:id` | Delete a coupon | 🔒 Admin/Manager |

---

## 🏗️ Architecture

```
ECommerce-api/
├── config/
│   └── db.js                    # MongoDB connection setup
├── controllers/
│   ├── auth.controller.js       # Register, login, 2FA, email verify, password reset
│   ├── user.controller.js       # User CRUD + profile management
│   ├── product.controller.js    # Product CRUD + image processing
│   ├── category.controller.js   # Category CRUD
│   ├── subcategory.controller.js
│   ├── brand.controller.js      # Brand CRUD
│   ├── cart.controller.js       # Cart operations + coupon application
│   ├── order.controller.js      # Cash orders + Stripe checkout + webhooks
│   ├── review.controller.js     # Review CRUD + rating aggregation
│   ├── wishlist.controller.js   # Wishlist add/remove
│   ├── coupon.controller.js     # Coupon management
│   └── address.controller.js    # Address management
├── middlewares/
│   ├── protect.middleware.js    # JWT auth + RBAC (allowedTo)
│   ├── asyncWrapper.js          # Async error handler wrapper
│   ├── imageUpload.js           # Multer configuration
│   └── validator.middleware.js  # Validation result handler
├── models/
│   ├── user.model.js            # User schema (auth, 2FA, addresses, wishlist)
│   ├── product.model.js         # Product schema (images, ratings, categories)
│   ├── category.model.js
│   ├── subcategory.model.js
│   ├── brand.model.js
│   ├── cart.model.js
│   ├── order.model.js           # Order schema (payment, delivery tracking)
│   ├── coupon.model.js
│   └── review.model.js          # Review schema (rating aggregation hooks)
├── routes/                      # Express routers (12 route files)
├── utils/
│   ├── apiFeatures.js           # Filter, sort, search, paginate, field limiting
│   ├── appError.js              # Custom error class
│   ├── cloudinary.js            # Cloudinary upload stream helper
│   ├── generateToken.js         # JWT token generation
│   ├── sendEmail.js             # SendGrid email helper
│   ├── httpStatusText.js        # Status constants (SUCCESS, FAIL, ERROR)
│   └── validators/              # express-validator rule sets (7 files)
├── uploads/                     # Local image storage (fallback)
├── swagger.json                 # OpenAPI 3.0 specification
├── Dockerfile                   # Node 20-slim production image
├── docker-compose.yml           # One-command container orchestration
├── server.js                    # App entry point (Express config + route mounting)
└── package.json
```

### Design Patterns

- **MVC Architecture** — Models, Controllers, and Routes cleanly separated
- **Centralized Error Handling** — Global error middleware + custom `AppError` class
- **Async Wrapper** — All controller logic wrapped to catch async errors automatically
- **API Features Class** — Chainable `filter().sort().search().limitFields().paginate()` for query building
- **Pre-save Hooks** — Automatic password hashing and image URL transformation
- **Mongoose Population** — Orders auto-populate user and product references

---

## 🐳 Deployment

### Docker

```bash
# Build and start the container
docker-compose up -d --build

# The API will be available on port 4000
curl http://localhost:4000/api-docs
```

### Manual

```bash
# Set NODE_ENV to production
export NODE_ENV=production

# Start the server
npm start
```

---

## 🔒 Security Features

- **Password Hashing** — bcrypt with 10 salt rounds
- **JWT Authentication** — Stateless auth with token expiry and password-change invalidation
- **Two-Factor Authentication** — Email-based OTP with 10-minute expiry
- **Email Verification** — Mandatory email verification on registration
- **Rate Limiting** — 100 requests per 15 minutes per IP on all `/api` routes
- **Input Validation** — express-validator rules on all mutation endpoints
- **RBAC** — Route-level role enforcement (`user`, `manager`, `admin`)
- **Secure Password Reset** — 6-digit code → cryptographic reset token → new password (3-step flow)

---

## 📄 License

This project is licensed under the **MIT License**.

---

<div align="center">

**Built by [Mahmoud Abdellah](https://github.com/Mahmoud142)**

</div>
