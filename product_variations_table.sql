-- Product Variations Table
-- Database: a2z47_ecom

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

-- Sample data for product variations
-- INSERT INTO product_variations (product_id, variation_title, variation_market_price, variation_price, available_stock) VALUES 
-- (1, '64GB', 999.00, 899.00, 50),
-- (1, '128GB', 1099.00, 999.00, 30),
-- (1, '256GB', 1299.00, 1199.00, 20);

