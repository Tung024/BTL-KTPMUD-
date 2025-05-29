
-- Tạo cơ sở dữ liệu
CREATE DATABASE product_dis;
USE product_dis;

-- Bảng danh mục sản phẩm
CREATE TABLE categories (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT
);

-- Bảng sản phẩm
CREATE TABLE products (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    type VARCHAR(50) NOT NULL, -- normal, featured, promotion
    price INT NOT NULL,
    image VARCHAR(255) NOT NULL,
    features TEXT NOT NULL,
    category_id INT,
    FOREIGN KEY (category_id) REFERENCES categories(id)
);

-- Bảng tài khoản khách hàng
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Bảng địa chỉ giao hàng
CREATE TABLE addresses (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    address_line VARCHAR(255) NOT NULL,
    city VARCHAR(100) NOT NULL,
    postal_code VARCHAR(20),
    phone VARCHAR(20) NOT NULL,
    is_default BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Bảng phương thức thanh toán
CREATE TABLE payment_methods (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    method_type VARCHAR(50) NOT NULL, -- credit_card, bank_transfer, cash_on_delivery
    details VARCHAR(255),
    is_default BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Bảng giỏ hàng
CREATE TABLE cart (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    product_id INT NOT NULL,
    quantity INT NOT NULL,
    added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (product_id) REFERENCES products(id)
);

-- Bảng đơn hàng
CREATE TABLE orders (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    product_id INT NOT NULL,
    quantity INT NOT NULL,
    total_price INT NOT NULL,
    address_id INT,
    payment_method_id INT,
    status VARCHAR(50) NOT NULL DEFAULT 'pending', -- pending, shipped, delivered, cancelled
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (product_id) REFERENCES products(id),
    FOREIGN KEY (address_id) REFERENCES addresses(id),
    FOREIGN KEY (payment_method_id) REFERENCES payment_methods(id)
);

-- Bảng theo dõi đơn hàng
CREATE TABLE order_tracking (
    id INT AUTO_INCREMENT PRIMARY KEY,
    order_id INT NOT NULL,
    status VARCHAR(50) NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    note TEXT,
    FOREIGN KEY (order_id) REFERENCES orders(id)
);

-- Bảng đánh giá sản phẩm
CREATE TABLE reviews (
    id INT AUTO_INCREMENT PRIMARY KEY,
    product_id INT NOT NULL,
    user_id INT NOT NULL,
    rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (product_id) REFERENCES products(id),
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Bảng mã giảm giá
CREATE TABLE discounts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    code VARCHAR(50) NOT NULL UNIQUE,
    discount_percentage INT NOT NULL CHECK (discount_percentage >= 0 AND discount_percentage <= 100),
    start_date DATETIME,
    end_date DATETIME,
    is_active BOOLEAN DEFAULT TRUE
);

-- Bảng tồn kho
CREATE TABLE inventory (
    id INT AUTO_INCREMENT PRIMARY KEY,
    product_id INT NOT NULL,
    quantity INT NOT NULL,
    last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (product_id) REFERENCES products(id)
);

-- Chèn dữ liệu mẫu
INSERT INTO categories (name, description) VALUES
('Điện tử', 'Các sản phẩm công nghệ như điện thoại, máy tính'),
('Quần áo', 'Áo, quần, phụ kiện thời trang'),
('Đồ gia dụng', 'Thiết bị và đồ dùng gia đình');

INSERT INTO products (name, type, price, image, features, category_id) VALUES
('Sản phẩm 1', 'normal', 100000, 'https://via.placeholder.com/100', 'Tính năng 1', 1),
('Sản phẩm 2', 'featured', 200000, 'https://via.placeholder.com/100', 'Tính năng 2', 1),
('Sản phẩm 3', 'promotion', 150000, 'https://via.placeholder.com/100', 'Tính năng 3', 2),
('Sản phẩm 4', 'normal', 120000, 'https://via.placeholder.com/100', 'Tính năng 4', 2),
('Sản phẩm 5', 'featured', 250000, 'https://via.placeholder.com/100', 'Tính năng 5', 3),
('Sản phẩm 6', 'promotion', 180000, 'https://via.placeholder.com/100', 'Tính năng 6', 3);

INSERT INTO users (username, password, email) VALUES
('user1', 'password1', 'user1@example.com'),
('user2', 'password2', 'user2@example.com'),
('anle', '090104', 'anle@gmail.com');

INSERT INTO addresses (user_id, address_line, city, postal_code, phone, is_default) VALUES
(1, '123 Đường Láng', 'Hà Nội', '100000', '0123456789', TRUE),
(2, '456 Nguyễn Trãi', 'Hồ Chí Minh', '700000', '0987654321', TRUE);

INSERT INTO payment_methods (user_id, method_type, details, is_default) VALUES
(1, 'credit_card', 'Visa ****1234', TRUE),
(2, 'cash_on_delivery', 'Thanh toán khi nhận hàng', TRUE);

INSERT INTO discounts (code, discount_percentage, start_date, end_date, is_active) VALUES
('SALE10', 10, '2025-05-01 00:00:00', '2025-12-31 23:59:59', TRUE),
('SUMMER20', 20, '2025-06-01 00:00:00', '2025-08-31 23:59:59', TRUE);

INSERT INTO inventory (product_id, quantity) VALUES
(1, 100),
(2, 50),
(3, 75),
(4, 120),
(5, 30),
(6, 60);
UPDATE products 
SET 
    name = 'iPhone 16',
    type = 'featured',
    price = 24990000,
    image = 'https://images.unsplash.com/photo-1616348436168-de43ad0db179?q=80&w=1981&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    features = 'iPhone 16 tích hợp Apple Intelligence, Camera Control, camera Fusion 48MP, zoom quang học 2x, và chip A18 mạnh mẽ. Có sẵn trong năm màu sắc rực rỡ, hỗ trợ chụp ảnh và quay video 3D.',
    category_id = 1
WHERE id = 1;

UPDATE products 
SET 
    name = 'iPhone 16 Pro',
    type = 'promotion',
    price = 29990000,
    image = 'https://unsplash.com/photos/iphone-16-pro-image',
    features = 'iPhone 16 Pro với chip A18 Pro, camera 48MP quay video 4K 120fps, màn hình Super Retina XDR 6.3 inch, và hỗ trợ Apple Intelligence. Thiết kế titan cao cấp, nhẹ và bền.',
    category_id = 1
WHERE id = 2;

UPDATE products 
SET 
    name = 'iPad Pro (M4, 11-inch)',
    type = 'featured',
    price = 27990000,
    image = 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjB8fGlwaG9uZXxlbnwwfHwwfHx8MA%3D%3D',
    features = 'iPad Pro với chip M4, màn hình Ultra Retina XDR 11 inch, hỗ trợ Wi-Fi 6E, 5G, và Apple Pencil Pro. Camera 12MP với LiDAR Scanner, lý tưởng cho chỉnh sửa video 4K.',
    category_id = 2
WHERE id = 3;

UPDATE products 
SET 
