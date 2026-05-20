-- ============================================================
-- Smart F2C Connect – Database Schema
-- ============================================================




-- ─── Admins ──────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS admins (
    id         INT AUTO_INCREMENT PRIMARY KEY,
    name       VARCHAR(100) NOT NULL,
    email      VARCHAR(150) UNIQUE NOT NULL,
    phone      VARCHAR(15),
    password   VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Default admin (password: admin@123)
INSERT IGNORE INTO admins (name, email, phone, password)
VALUES ('Super Admin', 'admin@f2c.com', '9999999999',
        'pbkdf2:sha256:600000$salt$hash_placeholder');
-- ⚠ Run this in Python to get real hash:
-- from werkzeug.security import generate_password_hash
-- print(generate_password_hash('admin@123'))

-- ─── Farmers ─────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS farmers (
    id         INT AUTO_INCREMENT PRIMARY KEY,
    name       VARCHAR(100) NOT NULL,
    email      VARCHAR(150) UNIQUE NOT NULL,
    phone      VARCHAR(15) NOT NULL,
    password   VARCHAR(255) NOT NULL,
    farm_name  VARCHAR(200),
    location   VARCHAR(200),
    is_active  TINYINT(1) DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ─── Consumers ───────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS consumers (
    id         INT AUTO_INCREMENT PRIMARY KEY,
    name       VARCHAR(100) NOT NULL,
    email      VARCHAR(150) UNIQUE NOT NULL,
    phone      VARCHAR(15) NOT NULL,
    password   VARCHAR(255) NOT NULL,
    address    TEXT,
    is_active  TINYINT(1) DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ─── Products ────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS products (
    id          INT AUTO_INCREMENT PRIMARY KEY,
    farmer_id   INT NOT NULL,
    name        VARCHAR(200) NOT NULL,
    category    VARCHAR(100) NOT NULL,
    price       DECIMAL(10,2) NOT NULL,
    quantity    INT NOT NULL DEFAULT 0,
    unit        VARCHAR(20) NOT NULL DEFAULT 'kg',
    description TEXT,
    image       VARCHAR(255) DEFAULT 'default_product.jpg',
    status      TEXT DEFAULT 'active',
    created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (farmer_id) REFERENCES farmers(id) ON DELETE CASCADE
);

-- ─── Orders ──────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS orders (
    id           INT AUTO_INCREMENT PRIMARY KEY,
    consumer_id  INT NOT NULL,
    total_amount DECIMAL(10,2) NOT NULL,
    address      TEXT NOT NULL,
    payment_mode TEXT DEFAULT 'cod',
    status       TEXT DEFAULT 'pending',
    notes        TEXT,
    created_at   TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at   TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (consumer_id) REFERENCES consumers(id) ON DELETE CASCADE
);

-- ─── Order Items ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS order_items (
    id         INT AUTO_INCREMENT PRIMARY KEY,
    order_id   INT NOT NULL,
    product_id INT NOT NULL,
    quantity   INT NOT NULL,
    price      DECIMAL(10,2) NOT NULL,
    FOREIGN KEY (order_id)   REFERENCES orders(id)   ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);

-- ─── Sample Data ─────────────────────────────────────────────
-- Run seed_db.py to insert sample data programmatically.
