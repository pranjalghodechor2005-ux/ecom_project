-- Products table creation query matching the INSERT statement
-- Database: a2z47_ecom

CREATE TABLE IF NOT EXISTS products (
    id INT AUTO_INCREMENT PRIMARY KEY,
    category_id INT NOT NULL,
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
    FOREIGN KEY (category_id) REFERENCES category(category_id) ON DELETE CASCADE
);

-- Sample INSERT query matching your admin.js structure:
-- INSERT INTO products(category_id, product_name, product_brand, product_details, product_colors, product_main_image, is_highlighted, is_most_selling) 
-- VALUES(1, 'iPhone 15', 'Apple', 'Latest iPhone with advanced features', 'Space Black, Silver, Gold', 'iphone15.jpg', TRUE, TRUE);

