/**
 * Shopping Cart Management Web Application
 * Part A: Native HTTP Module and Static File Serving
 * Server: httpServer.js (Port: 3000)
 */

import http from 'node:http';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

// Directory resolution for ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = 3000;

// In-memory Shopping Cart Data Store (JavaScript Array of Objects)
let shoppingCart = [
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
    category: "Accessories"
  }
];

// Helper: send JSON response with appropriate headers
function sendJSON(res, statusCode, data) {
  res.writeHead(statusCode, {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*'
  });
  res.end(JSON.stringify(data, null, 2));
}

// Helper: send HTML response with appropriate headers
function sendHTML(res, statusCode, html) {
  res.writeHead(statusCode, {
    'Content-Type': 'text/html; charset=utf-8'
  });
  res.end(html);
}

// Create HTTP Server
const server = http.createServer(async (req, res) => {
  const parsedUrl = new URL(req.url, `http://localhost:${PORT}`);
  const pathname = parsedUrl.pathname;
  const method = req.method.toUpperCase();

  // Route: GET /
  if (method === 'GET' && pathname === '/') {
    const welcomeHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Welcome - Shopping Cart App</title>
          <style>
            body { font-family: system-ui, sans-serif; padding: 2rem; background: #f8fafc; color: #1e293b; }
            .container { max-width: 600px; margin: 0 auto; background: white; padding: 2rem; border-radius: 8px; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1); }
            h1 { color: #2563eb; }
            a { color: #2563eb; text-decoration: none; font-weight: 600; }
            a:hover { text-decoration: underline; }
            ul { line-height: 2; margin-top: 1rem; }
          </style>
        </head>
        <body>
          <div class="container">
            <h1>Welcome to Shopping Cart Application!</h1>
            <p>Full Stack Development - Node.js HTTP Server running successfully.</p>
            <h3>Quick Links:</h3>
            <ul>
              <li><a href="/home">/home</a> - Serve Static HTML Page (via FS Module)</li>
              <li><a href="/cart">/cart</a> - View Shopping Cart Items (JSON format)</li>
              <li><a href="/about">/about</a> - Shopping Cart Application Information</li>
            </ul>
          </div>
        </body>
      </html>
    `;
    return sendHTML(res, 200, welcomeHtml);
  }

  // Route: GET /cart
  if (method === 'GET' && pathname === '/cart') {
    return sendJSON(res, 200, {
      message: "Shopping cart items retrieved successfully",
      count: shoppingCart.length,
      cart: shoppingCart
    });
  }

  // Route: GET /about
  if (method === 'GET' && pathname === '/about') {
    const aboutHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>About - Shopping Cart App</title>
          <style>
            body { font-family: system-ui, sans-serif; padding: 2rem; background: #f8fafc; color: #1e293b; }
            .card { max-width: 600px; margin: 0 auto; background: white; padding: 2rem; border-radius: 8px; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1); }
            h1 { color: #2563eb; }
            p { margin-top: 0.5rem; line-height: 1.6; }
            .badge { background: #dbeafe; color: #1e40af; padding: 0.2rem 0.6rem; border-radius: 4px; font-weight: 600; font-size: 0.85rem; }
            a { display: inline-block; margin-top: 1.5rem; color: #2563eb; font-weight: 600; text-decoration: none; }
          </style>
        </head>
        <body>
          <div class="card">
            <span class="badge">Application Info</span>
            <h1>About Shopping Cart App</h1>
            <p><strong>Course:</strong> Full Stack Development - Node.js Lab Examination</p>
            <p><strong>Technology Stack:</strong> Node.js HTTP Module, FS Module, ES Modules</p>
            <p><strong>Description:</strong> This web application demonstrates native HTTP server creation, custom routing, HTTP request method handling (GET, POST), static file serving via the FS module, and array-based in-memory state management without external frameworks.</p>
            <a href="/home">&larr; Back to Home</a>
          </div>
        </body>
      </html>
    `;
    return sendHTML(res, 200, aboutHtml);
  }

  // Route: GET /home (Static File Serving Using FS Module)
  if (method === 'GET' && pathname === '/home') {
    try {
      const filePath = path.join(__dirname, 'public', 'index.html');
      const fileData = await fs.readFile(filePath, 'utf-8');
      return sendHTML(res, 200, fileData);
    } catch (error) {
      console.error("FS Error reading index.html:", error.message);
      return sendHTML(res, 500, `<h1>500 - Internal Server Error</h1><p>Unable to load static page: ${error.message}</p>`);
    }
  }

  // Route: POST /add-to-cart
  if (method === 'POST' && pathname === '/add-to-cart') {
    let body = '';

    req.on('data', chunk => {
      body += chunk.toString();
    });

    req.on('end', () => {
      try {
        if (!body) {
          return sendJSON(res, 400, {
            error: "Bad Request",
            message: "Request body cannot be empty"
          });
        }

        const parsedData = JSON.parse(body);
        const { id, productName, price, quantity, category } = parsedData;

        // Validation for required fields: id, productName, price, quantity
        if (id === undefined || !productName || price === undefined || quantity === undefined) {
          return sendJSON(res, 400, {
            error: "Validation Error",
            message: "Missing required fields. 'id', 'productName', 'price', and 'quantity' are required."
          });
        }

        const numericId = Number(id);
        const numericPrice = Number(price);
        const numericQuantity = Number(quantity);

        if (isNaN(numericId) || isNaN(numericPrice) || isNaN(numericQuantity) || numericPrice < 0 || numericQuantity <= 0) {
          return sendJSON(res, 400, {
            error: "Validation Error",
            message: "id, price (>= 0), and quantity (> 0) must be valid numbers"
          });
        }

        // Check if item already exists
        const existingItem = shoppingCart.find(item => item.id === numericId);
        if (existingItem) {
          existingItem.quantity += numericQuantity;
          return sendJSON(res, 200, {
            message: "Product quantity updated in cart successfully",
            product: existingItem
          });
        }

        const newProduct = {
          id: numericId,
          productName: String(productName).trim(),
          price: numericPrice,
          quantity: numericQuantity,
          category: category ? String(category).trim() : "General"
        };

        shoppingCart.push(newProduct);

        return sendJSON(res, 201, {
          message: "Product added to cart successfully",
          product: newProduct
        });
      } catch (err) {
        return sendJSON(res, 400, {
          error: "Invalid JSON",
          message: "Could not parse JSON body: " + err.message
        });
      }
    });

    return;
  }

  // A5. Error Handling - 404 for invalid routes or methods
  return sendJSON(res, 404, {
    error: "Not Found",
    message: `Cannot ${method} ${pathname}. Invalid route.`,
    availableRoutes: [
      "GET /",
      "GET /cart",
      "GET /about",
      "GET /home",
      "POST /add-to-cart"
    ]
  });
});

// Configure server to listen on port 3000
server.listen(PORT, () => {
  console.log(`HTTP Server running at http://localhost:${PORT}`);
});
