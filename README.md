# MT1-LABEXAM: Shopping Cart Management Web Application

Full Stack Development – Node.js Lab Examination  
**Technology Stack:** Node.js (ES Modules), Built-in HTTP Module, Built-in FS Module, Express.js  
**Database:** In-memory JavaScript Array of Objects  

---

## 1. Project Overview

This project implements a complete Shopping Cart Management Web Application divided into two core parts:
1. **Part A (`httpServer.js`)**: Built strictly with Node.js built-in `http` and `fs` modules on port `3000`. Demonstrates request routing, HTTP method handling, static file delivery (`index.html`), and robust error handling.
2. **Part B (`expressApp.js`)**: Built using the `express` framework on port `4000`. Exposes a complete RESTful API providing full CRUD (Create, Read, Update, Delete) operations over in-memory shopping cart resources.

---

## 2. Directory Structure

```
MT1-LABEXAM/
│
├── package.json          # Project metadata, ES Module ("type": "module"), express dependency
├── package-lock.json     # Dependency lockfile
├── .gitignore            # Ignores node_modules, logs, OS files
├── httpServer.js         # Part A: Native Node.js HTTP Server & FS file serving (Port 3000)
├── expressApp.js         # Part B: Express.js REST API with CRUD operations (Port 4000)
│
├── public/
│   └── index.html        # Modern responsive UI served at /home using the FS module
│
├── screenshots/          # Directory to store evaluation/submission screenshots
└── README.md             # Complete project documentation and Postman testing guide
```

---

## 3. Installation & Setup

1. Open your terminal in the `MT1-LABEXAM` directory:
   ```bash
   cd MT1-LABEXAM
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

---

## 4. Running the Applications

Both applications run independently on their dedicated ports:

### Step 1: Start Part A (Native HTTP Server on Port 3000)
```bash
node httpServer.js
```
**Expected Console Output:**
```
HTTP Server running at http://localhost:3000
```

**Browser Routes to Test:**
- `http://localhost:3000/` → Returns Welcome message in HTML format.
- `http://localhost:3000/cart` → Returns list of cart items in JSON format.
- `http://localhost:3000/about` → Returns Shopping Cart application details.
- `http://localhost:3000/home` → Serves `public/index.html` via the `fs` module.
- `http://localhost:3000/invalid` → Returns HTTP `404 Not Found` with JSON details.

**POST Request via curl / Postman:**
- **URL:** `http://localhost:3000/add-to-cart`
- **Method:** `POST`
- **Headers:** `Content-Type: application/json`
- **Body:**
  ```json
  {
    "id": 4,
    "productName": "Wireless Earbuds",
    "price": 1999,
    "quantity": 1,
    "category": "Audio"
  }
  ```

---

### Step 2: Start Part B (Express.js REST API on Port 4000)
Open a separate terminal window and execute:
```bash
node expressApp.js
```
**Expected Console Output:**
```
Express Server running at http://localhost:4000
```

---

## 5. REST API Testing Guide (Express.js - Port 4000)

| HTTP Method | Endpoint | Description | Expected Status |
|---|---|---|---|
| **GET** | `http://localhost:4000/cart` | Retrieve all cart items | `200 OK` |
| **GET** | `http://localhost:4000/cart/:id` | Retrieve single item with calculated `totalPrice` | `200 OK` / `404 Not Found` |
| **POST** | `http://localhost:4000/cart` | Add a new product to cart | `201 Created` / `400 Bad Request` |
| **PUT** | `http://localhost:4000/cart/:id` | Update product details | `200 OK` / `404 Not Found` |
| **DELETE** | `http://localhost:4000/cart/:id` | Remove product from cart | `200 OK` / `404 Not Found` |

### Sample Postman Requests

#### 1. GET All Items
- **URL:** `http://localhost:4000/cart`
- **Method:** `GET`

#### 2. GET Item by ID
- **URL:** `http://localhost:4000/cart/1`
- **Method:** `GET`
- **Response:**
  ```json
  {
    "id": 1,
    "productName": "Wireless Mouse",
    "price": 799,
    "quantity": 2,
    "category": "Electronics",
    "totalPrice": 1598
  }
  ```

#### 3. POST Add New Product
- **URL:** `http://localhost:4000/cart`
- **Method:** `POST`
- **Headers:** `Content-Type: application/json`
- **Body:**
  ```json
  {
    "id": 4,
    "productName": "Bluetooth Headphones",
    "price": 1499,
    "quantity": 1,
    "category": "Electronics"
  }
  ```
- **Response (Status 201):**
  ```json
  {
    "message": "Product added successfully",
    "product": {
      "id": 4,
      "productName": "Bluetooth Headphones",
      "price": 1499,
      "quantity": 1,
      "category": "Electronics"
    }
  }
  ```

#### 4. PUT Update Existing Product
- **URL:** `http://localhost:4000/cart/1`
- **Method:** `PUT`
- **Headers:** `Content-Type: application/json`
- **Body:**
  ```json
  {
    "productName": "Wireless Mouse",
    "price": 899,
    "quantity": 3,
    "category": "Electronics"
  }
  ```
- **Response (Status 200):**
  ```json
  {
    "message": "Product updated successfully",
    "product": {
      "id": 1,
      "productName": "Wireless Mouse",
      "price": 899,
      "quantity": 3,
      "category": "Electronics"
    }
  }
  ```

#### 5. DELETE Product
- **URL:** `http://localhost:4000/cart/1`
- **Method:** `DELETE`
- **Response (Status 200):**
  ```json
  {
    "message": "Product removed successfully"
  }
  ```

---

## 6. GitHub Repository Instructions

To push this repository to your GitHub account:
```bash
# 1. Create a repository named MT1-LABEXAM on GitHub
# 2. Link your local repo to the remote GitHub repo:
git remote add origin https://github.com/<YOUR_GITHUB_USERNAME>/MT1-LABEXAM.git

# 3. Rename branch to main if needed and push:
git branch -M main
git push -u origin main
```

To view commit history:
```bash
git log --oneline
```
