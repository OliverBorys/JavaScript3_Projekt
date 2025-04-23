import express from "express";
import Database from "better-sqlite3";
import cors from "cors";
import bcrypt from "bcrypt";

const app = express();
const PORT = 8000;

app.use(cors());
app.use(express.json());

const hashPassword = async (password) => await bcrypt.hash(password, 10);

const adminDb = new Database("./db/adminUser.db", { verbose: console.log });
const productDb = new Database("./db/products.db", { verbose: console.log });
const heroDb = new Database("./db/hero.db", { verbose: console.log });

// **Create Tables**
adminDb.prepare(`
  CREATE TABLE IF NOT EXISTS admin_users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL
  )
`).run();

productDb.prepare(`
  CREATE TABLE IF NOT EXISTS categories (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      categoryName TEXT UNIQUE NOT NULL CHECK (categoryName IN ('Shoes', 'Clothes', 'Bags', 'Watches', 'Sunglasses'))
  )
`).run();

productDb.prepare(`
  CREATE TABLE IF NOT EXISTS products (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      productName TEXT NOT NULL,
      price NUMBER NOT NULL,
      image TEXT,
      secondaryImage1 TEXT,
      secondaryImage2 TEXT,
      secondaryImage3 TEXT,
      brand TEXT,
      productDescription TEXT,
      isNew TEXT,
      categoryId INTEGER,
      publishingDate TEXT,
      FOREIGN KEY (categoryId) REFERENCES categories(id) ON DELETE SET NULL
  )
`).run();

heroDb.prepare(`
  CREATE TABLE IF NOT EXISTS hero_images (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      image_url TEXT NOT NULL
  )
`).run();

// **Admin Routes**
app.post("/api/admin/register", async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) return res.status(400).json({ error: "Username and password are required" });

  try {
    const hashedPassword = await hashPassword(password);
    const stmt = adminDb.prepare("INSERT INTO admin_users (username, password) VALUES (?, ?)");
    const result = stmt.run(username, hashedPassword);
    res.status(201).json({ message: "Admin registered successfully", id: result.lastInsertRowid });
  } catch (error) {
    res.status(500).json({ error: "Username already exists or server error" });
  }
});

app.post("/api/admin/login", async (req, res) => {
  const { username, password } = req.body;
  const user = adminDb.prepare("SELECT * FROM admin_users WHERE username = ?").get(username);

  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(401).json({ error: "Invalid username or password" });
  }

  res.json({ message: "Login successful", user: { id: user.id, username: user.username } });
});

app.post("/api/admin/update-password", async (req, res) => {
  const { username, newPassword } = req.body;
  if (!username || !newPassword) return res.status(400).json({ error: "Username and new password are required" });

  try {
    const hashedPassword = await hashPassword(newPassword);
    const stmt = adminDb.prepare("UPDATE admin_users SET password = ? WHERE username = ?");
    const result = stmt.run(hashedPassword, username);
    
    if (result.changes === 0) return res.status(404).json({ error: "User not found" });

    res.json({ message: "Password updated successfully" });
  } catch (error) {
    res.status(500).json({ error: "Database error" });
  }
});

app.get("/api/admin/users", (req, res) => {
  res.json(adminDb.prepare("SELECT id, username FROM admin_users").all());
});

// **Product Routes**
app.get("/api/products", (req, res) => {
  res.json(
    productDb.prepare(`
      SELECT products.*, categories.categoryName
      FROM products
      LEFT JOIN categories ON products.categoryId = categories.id
    `).all()
  );
});

app.get("/api/products/:id", (req, res) => {
  const product = productDb.prepare(`
    SELECT products.*, categories.categoryName
    FROM products
    LEFT JOIN categories ON products.categoryId = categories.id
    WHERE products.id = ?
  `).get(req.params.id);

  product ? res.json(product) : res.status(404).json({ error: "Product not found" });
});

app.post("/api/products", (req, res) => {
  const { productName, price, image, secondaryImage1, secondaryImage2, secondaryImage3, brand, productDescription, isNew, categoryId, publishingDate } = req.body;
  
  if (!productName || !price || !publishingDate || !categoryId) {
    return res.status(400).json({ error: "Product name, price, publishing date, and categoryId are required" });
  }

  const stmt = productDb.prepare(`
    INSERT INTO products (productName, price, image, secondaryImage1, secondaryImage2, secondaryImage3, brand, productDescription, isNew, categoryId, publishingDate) 
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const result = stmt.run(productName, price, image, secondaryImage1, secondaryImage2, secondaryImage3, brand, productDescription, isNew, categoryId, publishingDate);
  res.json({ id: result.lastInsertRowid, productName, price, publishingDate, categoryId });
});

app.put("/api/products/:id", (req, res) => {
  const { productName, price, image, secondaryImage1, secondaryImage2, secondaryImage3, brand, productDescription, isNew, categoryId, publishingDate } = req.body;

  const stmt = productDb.prepare(`
    UPDATE products SET 
      productName = ?, price = ?, image = ?, secondaryImage1 = ?, secondaryImage2 = ?, secondaryImage3 = ?, brand = ?, productDescription = ?, isNew = ?, categoryId = ?, publishingDate = ?
    WHERE id = ?
  `);

  const result = stmt.run(productName, price, image, secondaryImage1, secondaryImage2, secondaryImage3, brand, productDescription, isNew, categoryId, publishingDate, req.params.id);

  result.changes
    ? res.json({ message: "Product updated successfully" })
    : res.status(404).json({ error: "Product not found" });
});

app.delete("/api/products/:id", (req, res) => {
  const result = productDb.prepare("DELETE FROM products WHERE id = ?").run(req.params.id);
  result.changes
    ? res.json({ message: "Product deleted" })
    : res.status(404).json({ error: "Product not found" });
});

app.get("/api/categories", (req, res) => {
  res.json(productDb.prepare("SELECT * FROM categories").all());
});

// **Hero Image Routes**
app.get("/api/hero-images", (req, res) => {
  res.json(heroDb.prepare("SELECT * FROM hero_images").all());
});

app.put("/api/hero-images/:id", (req, res) => {
  const { id } = req.params;
  const { image_url } = req.body;

  if (!image_url) {
    return res.status(400).json({ error: "image_url is required" });
  }

  const stmt = heroDb.prepare("UPDATE hero_images SET image_url = ? WHERE id = ?");
  const result = stmt.run(image_url, id);

  if (result.changes === 0) {
    return res.status(404).json({ error: "Hero image not found" });
  }

  res.json({ message: "Hero image updated successfully", id: parseInt(id), image_url });
});

app.listen(PORT, () => console.log(`Server is running on port: ${PORT}`));