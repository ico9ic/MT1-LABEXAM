/**
 * Shopping Cart Management Web Application
 * Part B: Shopping Cart REST API Using Express.js
 * Server: expressApp.js (Port: 4000)
 */

import express from 'express';

// B1. Configure Express.js
const app = express();
const PORT = 4000;

// Middleware to parse incoming JSON requests
app.use(express.json());

// B3. Shopping Cart Object Structure
// Initialize array containing at least three sample shopping cart items
let cart = [
  {
    id: 1,
    productName: "Wireless Mouse",
    price: 799,
    quantity: 2,
    category: "Electronics"
  },
  {
    id: 2,
    productName: "Mechanical Keyboard",
    price: 2499,
    quantity: 1,
    category: "Electronics"
  },
  {
    id: 3,
    productName: "USB-C Hub",
    price: 1299,
    quantity: 1,
    category: "Electronics"
  }
];

// Optional root route for developer convenience
app.get('/', (req, res) => {
  res.json({
    message: "Shopping Cart REST API is running",
    endpoints: [
      "GET    /cart",
      "GET    /cart/:id",
      "POST   /cart",
      "PUT    /cart/:id",
      "DELETE /cart/:id"
    ]
  });
});

// B2. Implement CRUD Operations

/**
 * GET /cart
 * Functionality: Retrieve all cart items
 */
app.get('/cart', (req, res) => {
  // Returns all items in the cart array
  res.status(200).json(cart);
});

/**
 * GET /cart/:id
 * Functionality: Retrieve a cart item by ID
 * Requirement: Calculate the total price of an individual cart item using price * quantity
 */
app.get('/cart/:id', (req, res) => {
  const id = Number(req.params.id);

  if (isNaN(id)) {
    return res.status(400).json({ message: "Invalid product ID format. ID must be a number." });
  }

  const product = cart.find(item => item.id === id);

  if (!product) {
    return res.status(404).json({ message: "Product not found" });
  }

  // Calculate total price: price * quantity
  const totalPrice = product.price * product.quantity;

  res.status(200).json({
    ...product,
    totalPrice
  });
});

/**
 * POST /cart
 * Functionality: Add a new product to the cart
 * Status Code: 201 Created
 */
app.post('/cart', (req, res) => {
  const { id, productName, price, quantity, category } = req.body;

  // Validate required product details
  if (!productName || price === undefined || quantity === undefined) {
    return res.status(400).json({
      message: "Validation failed: 'productName', 'price', and 'quantity' are required."
    });
  }

  const numericPrice = Number(price);
  const numericQuantity = Number(quantity);

  if (isNaN(numericPrice) || isNaN(numericQuantity) || numericPrice < 0 || numericQuantity <= 0) {
    return res.status(400).json({
      message: "Price must be >= 0 and quantity must be > 0"
    });
  }

  // Determine product ID
  let numericId;
  if (id !== undefined) {
    numericId = Number(id);
    if (isNaN(numericId)) {
      return res.status(400).json({ message: "Product ID must be a number." });
    }
    // Check if ID already exists
    const exists = cart.some(item => item.id === numericId);
    if (exists) {
      return res.status(400).json({ message: `Product with ID ${numericId} already exists in the cart.` });
    }
  } else {
    // Auto-generate next ID
    numericId = cart.length > 0 ? Math.max(...cart.map(item => item.id)) + 1 : 1;
  }

  const newProduct = {
    id: numericId,
    productName: String(productName).trim(),
    price: numericPrice,
    quantity: numericQuantity,
    category: category ? String(category).trim() : "General"
  };

  // Maintain updated shopping cart in the JavaScript array
  cart.push(newProduct);

  res.status(201).json({
    message: "Product added successfully",
    product: newProduct
  });
});

/**
 * PUT /cart/:id
 * Functionality: Update product details
 * Status Code: 200 OK (or 404 if not found)
 */
app.put('/cart/:id', (req, res) => {
  const id = Number(req.params.id);

  if (isNaN(id)) {
    return res.status(400).json({ message: "Invalid product ID format." });
  }

  const productIndex = cart.findIndex(item => item.id === id);

  if (productIndex === -1) {
    return res.status(404).json({ message: "Product not found" });
  }

  const { productName, price, quantity, category } = req.body;

  // Update provided fields
  if (productName !== undefined) {
    cart[productIndex].productName = String(productName).trim();
  }
  if (price !== undefined) {
    const numericPrice = Number(price);
    if (isNaN(numericPrice) || numericPrice < 0) {
      return res.status(400).json({ message: "Price must be a valid non-negative number." });
    }
    cart[productIndex].price = numericPrice;
  }
  if (quantity !== undefined) {
    const numericQuantity = Number(quantity);
    if (isNaN(numericQuantity) || numericQuantity <= 0) {
      return res.status(400).json({ message: "Quantity must be a positive integer." });
    }
    cart[productIndex].quantity = numericQuantity;
  }
  if (category !== undefined) {
    cart[productIndex].category = String(category).trim();
  }

  res.status(200).json({
    message: "Product updated successfully",
    product: cart[productIndex]
  });
});

/**
 * DELETE /cart/:id
 * Functionality: Remove a product from the cart
 * Status Code: 200 OK (or 404 if not found)
 */
app.delete('/cart/:id', (req, res) => {
  const id = Number(req.params.id);

  if (isNaN(id)) {
    return res.status(400).json({ message: "Invalid product ID format." });
  }

  const productIndex = cart.findIndex(item => item.id === id);

  if (productIndex === -1) {
    return res.status(404).json({ message: "Product not found" });
  }

  // Remove the product from the array
  cart.splice(productIndex, 1);

  res.status(200).json({
    message: "Product removed successfully"
  });
});

// Fallback 404 handler for invalid routes (placed last as per best practices)
app.use((req, res) => {
  res.status(404).json({
    message: "Route not found"
  });
});

// Configure application to listen on port 4000
app.listen(PORT, () => {
  console.log(`Express Server running at http://localhost:${PORT}`);
});
