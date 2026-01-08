-- Users table creation script
-- Database: a2z47_ecom

USE a2z47_ecom;

-- Create users table with the exact schema from the comments
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

-- Insert sample user data
INSERT INTO users (first_name, last_name, email, phone, password, confirm_password, date_of_birth, newsletter) VALUES 
('John', 'Doe', 'john.doe@example.com', '1234567890', 'hashed_password_123', 'hashed_password_123', '1990-05-15', 'yes'),
('Jane', 'Smith', 'jane.smith@example.com', '0987654321', 'hashed_password_456', 'hashed_password_456', '1985-12-20', 'no'),
('Admin', 'User', 'admin@example.com', '5555555555', 'admin123', 'admin123', '1980-01-01', 'yes');

-- Show success message
SELECT 'Users table created successfully!' as message;
