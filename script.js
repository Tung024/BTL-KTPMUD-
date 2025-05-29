let currentUser = null;
let allProducts = [];

// Hiển thị trang công khai khi mở web
document.addEventListener('DOMContentLoaded', () => {
    fetchPublicProducts();
});

// Hàm ẩn tất cả trang và menu
function hideAllPagesAndMenus() {
    document.getElementById('publicPage').style.display = 'none';
    document.getElementById('registerPage').style.display = 'none';
    document.getElementById('loginPage').style.display = 'none';
    document.getElementById('adminLoginPage').style.display = 'none';
    document.getElementById('userPage').style.display = 'none';
    document.getElementById('cartPage').style.display = 'none';
    document.getElementById('orderPage').style.display = 'none';
    document.getElementById('adminPage').style.display = 'none';
    document.getElementById('userManagementPage').style.display = 'none';
    document.getElementById('orderManagementPage').style.display = 'none';
    document.getElementById('accountMenu').style.display = 'none';
}

// Hiển thị/ẩn menu tài khoản
function toggleAccountMenu() {
    const menu = document.getElementById('accountMenu');
    menu.style.display = menu.style.display === 'none' ? 'block' : 'none';
}

// Tìm kiếm sản phẩm
function searchProducts() {
    const query = document.getElementById('searchInput').value.toLowerCase();
    const filteredProducts = allProducts.filter(product => 
        product.name.toLowerCase().includes(query) || 
        product.features.toLowerCase().includes(query)
    );
    
    if (document.getElementById('publicPage').style.display !== 'none') {
        displayPublicProducts(filteredProducts);
    } else if (document.getElementById('userPage').style.display !== 'none') {
        displayUserProducts(filteredProducts);
    } else if (document.getElementById('adminPage').style.display !== 'none') {
        displayAdminProducts(filteredProducts);
    }
}

// Lấy danh sách sản phẩm công khai
async function fetchPublicProducts() {
    try {
        const response = await fetch('http://localhost:3000/products');
        const products = await response.json();
        allProducts = products;
        displayPublicProducts(products);
    } catch (error) {
        console.error('Error fetching public products:', error);
    }
}

// Hiển thị danh sách sản phẩm công khai
function displayPublicProducts(products) {
    const productListDiv = document.getElementById('publicProductList');
    productListDiv.innerHTML = '';

    products.forEach(product => {
        const productDiv = document.createElement('div');
        productDiv.innerHTML = `
            <img src="${product.image}" alt="${product.name}">
            <p>${product.name}</p>
            <p>Giá: ${product.price.toLocaleString()} VNĐ</p>
            <p>${product.features}</p>
        `;
        productListDiv.appendChild(productDiv);
    });
}

// Lọc sản phẩm theo danh mục
function filterProducts(category) {
    const filteredProducts = category === 'all' 
        ? allProducts 
        : allProducts.filter(product => product.type === category);
    
    if (document.getElementById('publicPage').style.display !== 'none') {
        displayPublicProducts(filteredProducts);
    } else if (document.getElementById('userPage').style.display !== 'none') {
        displayUserProducts(filteredProducts);
    } else if (document.getElementById('adminPage').style.display !== 'none') {
        displayAdminProducts(filteredProducts);
    }
}

// Chuyển đến trang đăng ký
function goToRegister() {
    hideAllPagesAndMenus();
    document.getElementById('registerPage').style.display = 'block';
}

// Xử lý đăng ký
document.getElementById('registerForm').addEventListener('submit', async function (e) {
    e.preventDefault();
    const username = document.getElementById('regUsername').value;
    const password = document.getElementById('regPassword').value;
    const email = document.getElementById('regEmail').value;
    const errorDiv = document.getElementById('registerError');

    try {
        const response = await fetch('http://localhost:3000/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password, email }),
        });
        const result = await response.json();
        if (response.ok) {
            errorDiv.style.display = 'none';
            hideAllPagesAndMenus();
            document.getElementById('loginPage').style.display = 'block';
        } else {
            errorDiv.textContent = result.error;
            errorDiv.style.display = 'block';
        }
    } catch (error) {
        errorDiv.textContent = 'Lỗi khi đăng ký';
        errorDiv.style.display = 'block';
    }
});

// Chuyển đến trang đăng nhập
function goToLogin() {
    hideAllPagesAndMenus();
    document.getElementById('loginPage').style.display = 'block';
}

// Xử lý đăng nhập
document.getElementById('loginForm').addEventListener('submit', async function (e) {
    e.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const errorDiv = document.getElementById('loginError');

    try {
        const response = await fetch('http://localhost:3000/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password }),
        });
        const result = await response.json();
        if (response.ok) {
            currentUser = result.user;
            errorDiv.style.display = 'none';
            hideAllPagesAndMenus();
            document.getElementById('userPage').style.display = 'block';
            fetchUserProducts();
        } else {
            errorDiv.textContent = result.error;
            errorDiv.style.display = 'block';
        }
    } catch (error) {
        errorDiv.textContent = 'Lỗi khi đăng nhập';
        errorDiv.style.display = 'block';
    }
});

// Lấy danh sách sản phẩm cho khách hàng
async function fetchUserProducts() {
    try {
        const response = await fetch('http://localhost:3000/products');
        const products = await response.json();
        allProducts = products;
        displayUserProducts(products);
    } catch (error) {
        console.error('Error fetching user products:', error);
    }
}

// Hiển thị danh sách sản phẩm cho khách hàng
function displayUserProducts(products) {
    const productListDiv = document.getElementById('userProductList');
    productListDiv.innerHTML = '';

    products.forEach(product => {
        const productDiv = document.createElement('div');
        productDiv.innerHTML = `
            <img src="${product.image}" alt="${product.name}">
            <p>${product.name}</p>
            <p>Giá: ${product.price.toLocaleString()} VNĐ</p>
            <p>${product.features}</p>
            <button onclick="showOrderForm(${product.id})">Đặt mua</button>
            <button onclick="addToCart(${product.id})">Thêm vào giỏ</button>
        `;
        productListDiv.appendChild(productDiv);
    });
}

// Hiển thị form đặt hàng
function showOrderForm(productId) {
    const orderForm = document.createElement('div');
    orderForm.id = 'orderFormOverlay';
    orderForm.innerHTML = `
        <div class="order-form-container">
            <h2>Thông tin đặt hàng</h2>
            <div id="orderError" class="error-message"></div>
            <div class="form-group">
                <label for="orderQuantity"><i class="fas fa-box"></i> Số lượng</label>
                <input type="number" id="orderQuantity" min="1" required>
            </div>
            <div class="form-group">
                <label for="orderAddress"><i class="fas fa-map-marker-alt"></i> Địa chỉ giao hàng</label>
                <input type="text" id="orderAddress" required>
            </div>
            <div class="form-group">
                <label for="orderPhone"><i class="fas fa-phone"></i> Số điện thoại</label>
                <input type="text" id="orderPhone" required>
            </div>
            <div class="form-actions">
                <button onclick="placeOrder(${productId})" class="auth-btn">Xác nhận đặt hàng</button>
                <button onclick="closeOrderForm()" class="back-btn">Hủy</button>
            </div>
        </div>
    `;
    document.body.appendChild(orderForm);
}

// Đóng form đặt hàng
function closeOrderForm() {
    const orderForm = document.getElementById('orderFormOverlay');
    if (orderForm) {
        orderForm.remove();
    }
}

// Đặt hàng
async function placeOrder(productId) {
    const quantityInput = document.getElementById('orderQuantity');
    const addressInput = document.getElementById('orderAddress');
    const phoneInput = document.getElementById('orderPhone');
    const errorDiv = document.getElementById('orderError');

    const quantity = parseInt(quantityInput.value);
    const address = addressInput.value.trim();
    const phone = phoneInput.value.trim();

    // Kiểm tra đầu vào
    if (!quantity || quantity <= 0) {
        errorDiv.textContent = 'Số lượng phải lớn hơn 0';
        errorDiv.style.display = 'block';
        return;
    }

    if (!address) {
        errorDiv.textContent = 'Vui lòng nhập địa chỉ giao hàng';
        errorDiv.style.display = 'block';
        return;
    }

    const phoneRegex = /^[0-9]{10,11}$/;
    if (!phone || !phoneRegex.test(phone)) {
        errorDiv.textContent = 'Số điện thoại không hợp lệ (10-11 chữ số)';
        errorDiv.style.display = 'block';
        return;
    }

    const orderData = {
        user_id: currentUser.id,
        product_id: productId,
        quantity: quantity,
        address: address,
        phone: phone,
        status: 'Đang xử lý'
    };

    try {
        const response = await fetch('http://localhost:3000/orders', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(orderData),
        });
        const result = await response.json();
        if (response.ok) {
            alert('Đặt hàng thành công');
            closeOrderForm();
            goToOrders();
        } else {
            errorDiv.textContent = result.error || 'Đặt hàng thất bại';
            errorDiv.style.display = 'block';
        }
    } catch (error) {
        console.error('Error placing order:', error);
        errorDiv.textContent = 'Lỗi khi đặt hàng';
        errorDiv.style.display = 'block';
    }
}

// Thêm vào giỏ hàng
async function addToCart(productId) {
    if (!currentUser) {
        alert('Vui lòng đăng nhập để thêm sản phẩm vào giỏ hàng!');
        goToLogin();
        return;
    }
    
    const quantity = prompt('Nhập số lượng:', '1');
    if (!quantity || parseInt(quantity) <= 0) return;

    try {
        const response = await fetch('http://localhost:3000/cart', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ user_id: currentUser.id, product_id: productId, quantity: parseInt(quantity) }),
        });
        if (response.ok) {
            alert('Đã thêm vào giỏ hàng');
        } else {
            alert('Thêm vào giỏ hàng thất bại');
        }
    } catch (error) {
        console.error('Error adding to cart:', error);
        alert('Lỗi khi thêm vào giỏ hàng');
    }
}

// Chuyển đến trang giỏ hàng
function goToCart() {
    if (!currentUser) {
        alert('Vui lòng đăng nhập để xem giỏ hàng!');
        goToLogin();
        return;
    }
    
    hideAllPagesAndMenus();
    document.getElementById('cartPage').style.display = 'block';
    fetchCart();
}

// Lấy giỏ hàng
async function fetchCart() {
    try {
        const response = await fetch(`http://localhost:3000/cart/${currentUser.id}`);
        const cartItems = await response.json();
        displayCart(cartItems);
    } catch (error) {
        console.error('Error fetching cart:', error);
    }
}

// Hiển thị giỏ hàng
function displayCart(cartItems) {
    const cartListDiv = document.getElementById('cartList');
    cartListDiv.innerHTML = '';
    
    cartItems.forEach(item => {
        const cartItemDiv = document.createElement('div');
        cartItemDiv.innerHTML = `
            <img src="${item.image}" alt="${item.name}">
            <p>Sản phẩm: ${item.name}</p>
            <p>Số lượng: ${item.quantity}</p>
            <p>Giá: ${(item.price * item.quantity).toLocaleString()} VNĐ</p>
            <button onclick="removeFromCart(${item.id})">Xóa</button>
        `;
        cartListDiv.appendChild(cartItemDiv);
    });
}

// Xóa sản phẩm khỏi giỏ hàng
async function removeFromCart(cartId) {
    if (confirm('Bạn có chắc muốn xóa sản phẩm này khỏi giỏ hàng?')) {
        try {
            const response = await fetch(`http://localhost:3000/cart/${cartId}`, {
                method: 'DELETE',
            });
            if (response.ok) {
                fetchCart();
            } else {
                alert('Xóa sản phẩm thất bại');
            }
        } catch (error) {
            console.error('Error removing from cart:', error);
            alert('Lỗi khi xóa sản phẩm');
        }
    }
}

// Thanh toán
async function checkout() {
    const addressId = prompt('Nhập ID địa chỉ giao hàng:');
    const paymentMethodId = prompt('Nhập ID phương thức thanh toán:');
    const discountCode = prompt('Nhập mã giảm giá (nếu có):');
    
    if (!addressId || !paymentMethodId) return;
    
    try {
        const response = await fetch('http://localhost:3000/checkout', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ user_id: currentUser.id, address_id: addressId, payment_method_id: paymentMethodId, discount_code: discountCode }),
        });
        if (response.ok) {
            alert('Thanh toán thành công');
            goToOrders();
        } else {
            alert('Thanh toán thất bại');
        }
    } catch (error) {
        console.error('Error during checkout:', error);
        alert('Lỗi khi thanh toán');
    }
}

// Chuyển đến trang đơn hàng
function goToOrders() {
    hideAllPagesAndMenus();
    
    if (!currentUser) {
        alert('Vui lòng đăng nhập để xem đơn hàng!');
        document.getElementById('loginPage').style.display = 'block';
        return;
    }

    document.getElementById('orderPage').style.display = 'block';
    viewOrders();
}

// Xem và hiển thị đơn hàng
async function viewOrders() {
    try {
        const response = await fetch(`http://localhost:3000/orders/${currentUser.id}`);
        const orders = await response.json();
        displayOrders(orders);
    } catch (error) {
        console.error('Error fetching orders:', error);
    }
}

// Hiển thị danh sách đơn hàng
function displayOrders(orders) {
    const orderListDiv = document.getElementById('orderList');
    orderListDiv.innerHTML = '';

    orders.forEach(order => {
        const orderDiv = document.createElement('div');
        orderDiv.innerHTML = `
            <img src="${order.image}" alt="${order.name}">
            <p>Sản phẩm: ${order.name}</p>
            <p>Số lượng: ${order.quantity}</p>
            <p>Tổng giá: ${order.total_price.toLocaleString()} VNĐ</p>
            <p>Địa chỉ: ${order.address}</p>
            <p>Số điện thoại: ${order.phone}</p>
            <p>Trạng thái: ${order.status}</p>
            <p>Ngày đặt: ${new Date(order.created_at).toLocaleDateString()}</p>
            <button onclick="cancelOrder(${order.id})">Hủy đơn hàng</button>
        `;
        orderListDiv.appendChild(orderDiv);
    });
}

// Hủy đơn hàng
async function cancelOrder(orderId) {
    if (confirm('Bạn có chắc muốn hủy đơn hàng này?')) {
        try {
            const response = await fetch(`http://localhost:3000/orders/${orderId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: 'Đã hủy' }),
            });
            const result = await response.json();
            if (response.ok) {
                alert('Đơn hàng đã được hủy');
                viewOrders();
            } else {
                alert(`Hủy đơn hàng thất bại: ${result.error}`);
            }
        } catch (error) {
            console.error('Error canceling order:', error);
            alert('Lỗi khi hủy đơn hàng');
        }
    }
}

// Đăng xuất (khách hàng)
function userLogout() {
    currentUser = null;
    hideAllPagesAndMenus();
    document.getElementById('publicPage').style.display = 'block';
    fetchPublicProducts();
}

// Chuyển đến trang đăng nhập admin
function goToAdminLogin() {
    hideAllPagesAndMenus();
    document.getElementById('adminLoginPage').style.display = 'block';
}

// Xử lý đăng nhập admin
const adminCredentials = { username: "admin", password: "123456" };
document.getElementById('adminLoginForm').addEventListener('submit', function (e) {
    e.preventDefault();
    const username = document.getElementById('adminUsername').value;
    const password = document.getElementById('adminPassword').value;
    const errorDiv = document.getElementById('adminLoginError');

    if (username === adminCredentials.username && password === adminCredentials.password) {
        errorDiv.style.display = 'none';
        hideAllPagesAndMenus();
        document.getElementById('adminPage').style.display = 'block';
        fetchAdminProducts();
    } else {
        errorDiv.textContent = 'Tên đăng nhập hoặc mật khẩu không đúng';
        errorDiv.style.display = 'block';
    }
});

// Lấy danh sách sản phẩm cho admin
async function fetchAdminProducts() {
    try {
        const response = await fetch('http://localhost:3000/products');
        const products = await response.json();
        allProducts = products;
        displayAdminProducts(products);
    } catch (error) {
        console.error('Error fetching admin products:', error);
    }
}

// Hiển thị danh sách sản phẩm cho admin
function displayAdminProducts(products) {
    const productListDiv = document.getElementById('adminProductList');
    productListDiv.innerHTML = '';

    products.forEach(product => {
        const productDiv = document.createElement('div');
        productDiv.innerHTML = `
            <img src="${product.image}" alt="${product.name}">
            <p>${product.name}</p>
            <p>Giá: ${product.price.toLocaleString()} VNĐ</p>
            <p>${product.features}</p>
            <button onclick="editProduct(${product.id})">Chỉnh sửa</button>
        `;
        productListDiv.appendChild(productDiv);
    });
}

// Thêm sản phẩm mới (admin)
document.getElementById('addProductForm').addEventListener('submit', async function (e) {
    e.preventDefault();
    const newProduct = {
        name: document.getElementById('productName').value,
        type: document.getElementById('productType').value,
        price: parseInt(document.getElementById('productPrice').value),
        image: document.getElementById('productImage').value,
        features: document.getElementById('productFeatures').value,
        category_id: parseInt(document.getElementById('productCategory').value),
    };

    try {
        const response = await fetch('http://localhost:3000/products', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newProduct),
        });
        const result = await response.json();
        if (result.id) {
            fetchAdminProducts();
            document.getElementById('addProductForm').reset();
        }
    } catch (error) {
        console.error('Error adding product:', error);
    }
});

// Chỉnh sửa sản phẩm (admin)
function editProduct(id) {
    const name = prompt('Nhập tên sản phẩm mới:');
    const type = prompt('Nhập loại sản phẩm (normal/featured/promotion):');
    const price = parseInt(prompt('Nhập giá mới:'));
    const image = prompt('Nhập URL hình ảnh mới:');
    const features = prompt('Nhập tính năng mới:');

    if (name && type && price && image && features) {
        const updatedProduct = { name, type, price, image, features };
        fetch(`http://localhost:3000/products/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updatedProduct),
        }).then(() => fetchAdminProducts());
    }
}

// Quản lý tài khoản (admin)
async function viewUsers() {
    try {
        const response = await fetch('http://localhost:3000/users');
        const users = await response.json();
        displayUsers(users);
        hideAllPagesAndMenus();
        document.getElementById('userManagementPage').style.display = 'block';
    } catch (error) {
        console.error('Error fetching users:', error);
    }
}

// Hiển thị danh sách tài khoản
function displayUsers(users) {
    const userListDiv = document.getElementById('userList');
    userListDiv.innerHTML = '';

    users.forEach(user => {
        const userDiv = document.createElement('div');
        userDiv.innerHTML = `
            <p>Tên đăng nhập: ${user.username}</p>
            <p>Email: ${user.email}</p>
            <p>Ngày tạo: ${new Date(user.created_at).toLocaleDateString()}</p>
            <button onclick="deleteUser(${user.id})">Xóa</button>
        `;
        userListDiv.appendChild(userDiv);
    });
}

// Xóa tài khoản (admin)
function deleteUser(id) {
    if (confirm('Bạn có chắc muốn xóa tài khoản này?')) {
        fetch(`http://localhost:3000/users/${id}`, {
            method: 'DELETE',
        }).then(() => viewUsers());
    }
}

// Xem và hiển thị tất cả đơn hàng (admin)
async function viewAllOrders() {
    const userId = document.getElementById('filterUserId')?.value;
    try {
        const url = userId ? `http://localhost:3000/orders?user_id=${userId}` : 'http://localhost:3000/orders';
        const response = await fetch(url);
        const orders = await response.json();
        displayAdminOrders(orders);
        hideAllPagesAndMenus();
        document.getElementById('orderManagementPage').style.display = 'block';
    } catch (error) {
        console.error('Error fetching orders:', error);
    }
}

// Hiển thị danh sách đơn hàng cho admin
function displayAdminOrders(orders) {
    const orderListDiv = document.getElementById('adminOrderList');
    orderListDiv.innerHTML = '';

    orders.forEach(order => {
        const orderDiv = document.createElement('div');
        orderDiv.innerHTML = `
            <img src="${order.image}" alt="${order.product_name}">
            <p>Người dùng: ${order.username}</p>
            <p>Sản phẩm: ${order.product_name}</p>
            <p>Số lượng: ${order.quantity}</p>
            <p>Tổng giá: ${order.total_price.toLocaleString()} VNĐ</p>
            <p>Địa chỉ: ${order.address}</p>
            <p>Số điện thoại: ${order.phone}</p>
            <p>Trạng thái: ${order.status}</p>
            <p>Ngày đặt: ${new Date(order.created_at).toLocaleDateString()}</p>
        `;
        orderListDiv.appendChild(orderDiv);
    });
}

// Quay lại trang admin
function goBackToAdmin() {
    hideAllPagesAndMenus();
    document.getElementById('adminPage').style.display = 'block';
}

// Đăng xuất (admin)
function adminLogout() {
    hideAllPagesAndMenus();
    document.getElementById('publicPage').style.display = 'block';
    fetchPublicProducts();
}

// Quay lại trang công khai
function goBackToPublic() {
    hideAllPagesAndMenus();
    document.getElementById('publicPage').style.display = 'block';
    fetchPublicProducts();
}