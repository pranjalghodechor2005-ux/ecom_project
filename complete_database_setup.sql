-- Complete Database Setup for E-commerce Project
-- Database: a2z47_ecom

-- Drop database if exists and create new one
DROP DATABASE IF EXISTS a2z47_ecom;
CREATE DATABASE a2z47_ecom;
USE a2z47_ecom;

-- Create category table
CREATE TABLE IF NOT EXISTS category (
    category_id INT AUTO_INCREMENT PRIMARY KEY,
    category_name VARCHAR(255) NOT NULL,
    category_image VARCHAR(255),
    category_status ENUM('active', 'inactive') DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Create products table
CREATE TABLE IF NOT EXISTS products (
    id INT AUTO_INCREMENT PRIMARY KEY,
    category_id INT,
    product_name VARCHAR(255) NOT NULL,
    product_brand VARCHAR(255),
    product_details TEXT,
    product_colors VARCHAR(255),
    product_main_image VARCHAR(255),
    is_highlighted BOOLEAN DEFAULT FALSE,
    is_most_selling BOOLEAN DEFAULT FALSE,
    product_price DECIMAL(10,2),
    product_status ENUM('active', 'inactive') DEFAULT 'active',
    stock_quantity INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES category(category_id) ON DELETE SET NULL
);

-- Create product_variations table
CREATE TABLE IF NOT EXISTS product_variations (
    variation_id INT AUTO_INCREMENT PRIMARY KEY,
    product_id INT NOT NULL,
    variation_title VARCHAR(255) NOT NULL,
    variation_market_price DECIMAL(10,2),
    variation_price DECIMAL(10,2) NOT NULL,
    available_stock INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);

-- Create users table (updated schema)
CREATE TABLE IF NOT EXISTS users (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR(50),
    last_name VARCHAR(50),
    email VARCHAR(100) UNIQUE,
    phone VARCHAR(20),
    password VARCHAR(255),
    confirm_password VARCHAR(255),
    date_of_birth DATE,
    newsletter VARCHAR(10),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Create slider table
CREATE TABLE IF NOT EXISTS slider (
    slider_id INT AUTO_INCREMENT PRIMARY KEY,
    slider_image VARCHAR(255),
    slider_title VARCHAR(255),
    slider_description TEXT,
    slider_button_text VARCHAR(100),
    slider_button_link VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Create orders table
CREATE TABLE IF NOT EXISTS orders (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    order_total DECIMAL(10,2) NOT NULL,
    order_status ENUM('pending', 'processing', 'shipped', 'delivered', 'cancelled') DEFAULT 'pending',
    shipping_address TEXT,
    payment_method VARCHAR(50),
    payment_status ENUM('pending', 'paid', 'failed') DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE SET NULL
);

-- Create order_items table
CREATE TABLE IF NOT EXISTS order_items (
    id INT AUTO_INCREMENT PRIMARY KEY,
    order_id INT,
    product_id INT,
    variation_id INT,
    quantity INT NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
    FOREIGN KEY (variation_id) REFERENCES product_variations(variation_id) ON DELETE CASCADE
);

-- Insert sample data
INSERT INTO category (category_name, category_status) VALUES 
('Electronics', 'active'),
('Clothing', 'active'),
('Books', 'active'),
('Home & Garden', 'active'),
('Smartphones', 'active'),
('Laptops', 'active'),
('Tablets', 'active'),
('Headphones', 'active'),
('Accessories', 'active');

-- Insert sample users (passwords should be hashed in real application)
INSERT INTO users (first_name, last_name, email, phone, password, confirm_password, date_of_birth, newsletter) VALUES 
('Admin', 'User', 'admin@example.com', '5555555555', 'admin123', 'admin123', '1980-01-01', 'yes'),
('John', 'Doe', 'john.doe@example.com', '1234567890', 'password123', 'password123', '1990-05-15', 'yes'),
('Jane', 'Smith', 'jane.smith@example.com', '0987654321', 'password456', 'password456', '1985-12-20', 'no');

-- Insert sample products
INSERT INTO products (category_id, product_name, product_brand, product_details, product_colors, product_main_image, is_highlighted, is_most_selling) VALUES 
(1, 'iPhone 15 Pro', 'Apple', 'Latest iPhone with advanced features and titanium design', 'Natural Titanium, Blue Titanium, White Titanium, Black Titanium', 'iphone15.jpg', TRUE, TRUE),
(1, 'Samsung Galaxy S24', 'Samsung', 'Premium Android smartphone with AI features', 'Onyx Black, Marble Gray, Cobalt Violet, Amber Yellow', 'galaxy_s24.jpg', TRUE, FALSE),
(2, 'MacBook Pro 14"', 'Apple', 'Professional laptop with M3 chip', 'Space Gray, Silver', 'macbook_pro.jpg', FALSE, TRUE),
(3, 'iPad Air', 'Apple', 'Powerful tablet for creativity and productivity', 'Space Gray, Blue, Pink, Purple, Starlight', 'ipad_air.jpg', FALSE, FALSE);

-- Insert sample product variations
INSERT INTO product_variations (product_id, variation_title, variation_market_price, variation_price, available_stock) VALUES 
(1, '128GB', 999.00, 899.00, 50),
(1, '256GB', 1099.00, 999.00, 30),
(1, '512GB', 1299.00, 1199.00, 20),
(2, '128GB', 899.00, 799.00, 40),
(2, '256GB', 999.00, 899.00, 25),
(2, '512GB', 1199.00, 1099.00, 15),
(3, '512GB SSD', 1999.00, 1799.00, 10),
(3, '1TB SSD', 2399.00, 2199.00, 8),
(4, '64GB WiFi', 599.00, 549.00, 35),
(4, '256GB WiFi', 749.00, 699.00, 20);

-- Insert sample slider data
INSERT INTO slider (slider_image, slider_title, slider_description, slider_button_text, slider_button_link) VALUES 
('slider1.jpg', 'New iPhone 15 Pro', 'Experience the latest technology with our premium smartphones', 'Shop Now', '/products'),
('slider2.jpg', 'MacBook Pro Sale', 'Get up to 20% off on all MacBook Pro models', 'View Deals', '/products'),
('slider3.jpg', 'Electronics Collection', 'Discover our wide range of electronics and accessories', 'Explore', '/products');

-- Show success message
SELECT 'Database setup completed successfully!' as message;

