const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');
const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

// Cấu hình kết nối MySQL
const dbConfig = {
    host: 'localhost',
    user: 'root',
    password: '27112004',
    database: 'product_dis',
};

// Tạo pool kết nối
const pool = mysql.createPool(dbConfig);

// API lấy danh sách sản phẩm
app.get('/products', async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM products');
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// API đăng ký tài khoản
app.post('/register', async (req, res) => {
    const { username, password, email } = req.body;
    try {
        await pool.query('INSERT INTO users (username, password, email) VALUES (?, ?, ?)', [username, password, email]);
        res.json({ message: 'Đăng ký thành công' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// API đăng nhập
app.post('/login', async (req, res) => {
    const { username, password } = req.body;
    try {
        const [rows] = await pool.query('SELECT * FROM users WHERE username = ? AND password = ?', [username, password]);
        if (rows.length > 0) {
            res.json({ user: rows[0] });
        } else {
            res.status(401).json({ error: 'Tên đăng nhập hoặc mật khẩu không đúng' });
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// API đặt hàng
app.post('/orders', async (req, res) => {
    const { user_id, product_id, quantity, address, phone } = req.body;
    try {
        // Kiểm tra sản phẩm có tồn tại không
        const [product] = await pool.query('SELECT price FROM products WHERE id = ?', [product_id]);
        if (product.length === 0) {
            return res.status(404).json({ error: 'Sản phẩm không tồn tại' });
        }

        // Kiểm tra tồn kho
        const [inventory] = await pool.query('SELECT quantity FROM inventory WHERE product_id = ?', [product_id]);
        if (inventory.length === 0 || inventory[0].quantity < quantity) {
            return res.status(400).json({ error: 'Sản phẩm không đủ số lượng trong kho' });
        }

        const total_price = product[0].price * quantity;

        // Cập nhật tồn kho
        await pool.query('UPDATE inventory SET quantity = quantity - ? WHERE product_id = ?', [quantity, product_id]);

        // Thêm đơn hàng
        await pool.query(
            'INSERT INTO orders (user_id, product_id, quantity, total_price, address, phone, status) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [user_id, product_id, quantity, total_price, address, phone, 'Đang xử lý']
        );

        res.json({ message: 'Đặt hàng thành công' });
    } catch (err) {
        console.error('Database error:', err); // Log lỗi chi tiết
        res.status(500).json({ error: err.message });
    }
});

// API xem đơn hàng của khách hàng
app.get('/orders/:user_id', async (req, res) => {
    const user_id = req.params.user_id;
    try {
        const [rows] = await pool.query(
            'SELECT o.*, p.name, p.image FROM orders o JOIN products p ON o.product_id = p.id WHERE o.user_id = ?',
            [user_id]
        );
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// API thêm sản phẩm
app.post('/products', async (req, res) => {
    const { name, type, price, image, features, category_id } = req.body;
    try {
        const [result] = await pool.query(
            'INSERT INTO products (name, type, price, image, features, category_id) VALUES (?, ?, ?, ?, ?, ?)',
            [name, type, price, image, features, category_id]
        );
        res.json({ id: result.insertId });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// API chỉnh sửa sản phẩm
app.put('/products/:id', async (req, res) => {
    const id = req.params.id;
    const { name, type, price, image, features, category_id } = req.body;
    try {
        await pool.query(
            'UPDATE products SET name = ?, type = ?, price = ?, image = ?, features = ?, category_id = ? WHERE id = ?',
            [name, type, price, image, features, category_id, id]
        );
        res.json({ message: 'Chỉnh sửa thành công' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// API lấy danh sách tài khoản
app.get('/users', async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM users');
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// API xóa tài khoản
app.delete('/users/:id', async (req, res) => {
    const id = req.params.id;
    try {
        await pool.query('DELETE FROM users WHERE id = ?', [id]);
        res.json({ message: 'Xóa tài khoản thành công' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// API cập nhật trạng thái đơn hàng
app.put('/orders/:id', async (req, res) => {
    const id = req.params.id;
    const { status } = req.body;
    try {
        await pool.query('UPDATE orders SET status = ? WHERE id = ?', [status, id]);
        await pool.query('INSERT INTO order_tracking (order_id, status, note) VALUES (?, ?, ?)', [id, status, 'Cập nhật trạng thái']);
        res.json({ message: 'Cập nhật trạng thái đơn hàng thành công' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// API lấy danh sách đơn hàng (admin)
app.get('/orders', async (req, res) => {
    const { user_id } = req.query;
    try {
        let query = `
            SELECT o.*, p.name AS product_name, p.image, u.username
            FROM orders o
            JOIN products p ON o.product_id = p.id
            JOIN users u ON o.user_id = u.id
        `;
        let params = [];
        
        if (user_id) {
            query += ' WHERE o.user_id = ?';
            params.push(user_id);
        }

        const [rows] = await pool.query(query, params);
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// API thêm vào giỏ hàng
app.post('/cart', async (req, res) => {
    const { user_id, product_id, quantity } = req.body;
    try {
        const [inventory] = await pool.query('SELECT quantity FROM inventory WHERE product_id = ?', [product_id]);
        if (inventory.length === 0 || inventory[0].quantity < quantity) {
            return res.status(400).json({ error: 'Sản phẩm không đủ số lượng trong kho' });
        }

        const [result] = await pool.query(
            'INSERT INTO cart (user_id, product_id, quantity) VALUES (?, ?, ?)',
            [user_id, product_id, quantity]
        );
        res.json({ id: result.insertId });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// API lấy giỏ hàng
app.get('/cart/:user_id', async (req, res) => {
    const user_id = req.params.user_id;
    try {
        const [rows] = await pool.query(
            'SELECT c.*, p.name, p.image, p.price FROM cart c JOIN products p ON c.product_id = p.id WHERE c.user_id = ?',
            [user_id]
        );
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// API xóa sản phẩm khỏi giỏ hàng
app.delete('/cart/:id', async (req, res) => {
    const id = req.params.id;
    try {
        await pool.query('DELETE FROM cart WHERE id = ?', [id]);
        res.json({ message: 'Xóa sản phẩm khỏi giỏ hàng thành công' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// API thanh toán
app.post('/checkout', async (req, res) => {
    const { user_id, address_id, payment_method_id, discount_code } = req.body;
    try {
        const [cartItems] = await pool.query(
            'SELECT c.*, p.price FROM cart c JOIN products p ON c.product_id = p.id WHERE c.user_id = ?',
            [user_id]
        );

        if (cartItems.length === 0) {
            return res.status(400).json({ error: 'Giỏ hàng trống' });
        }

        let discount = 0;
        if (discount_code) {
            const [discountRows] = await pool.query(
                'SELECT discount_percentage FROM discounts WHERE code = ? AND is_active = TRUE AND NOW() BETWEEN start_date AND end_date',
                [discount_code]
            );
            if (discountRows.length > 0) {
                discount = discountRows[0].discount_percentage;
            }
        }

        let total_price = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
        total_price = total_price * (1 - discount / 100);

        for (const item of cartItems) {
            await pool.query(
                'INSERT INTO orders (user_id, product_id, quantity, total_price, address_id, payment_method_id, status) VALUES (?, ?, ?, ?, ?, ?, ?)',
                [user_id, item.product_id, item.quantity, item.price * item.quantity * (1 - discount / 100), address_id, payment_method_id, 'pending']
            );
            await pool.query('UPDATE inventory SET quantity = quantity - ? WHERE product_id = ?', [item.quantity, item.product_id]);
        }

        await pool.query('DELETE FROM cart WHERE user_id = ?', [user_id]);
        res.json({ message: 'Thanh toán thành công' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Khởi động server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});