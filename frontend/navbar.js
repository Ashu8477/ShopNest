const shopNestAuth = {
  token: localStorage.getItem('token'),
  username: localStorage.getItem('username'),
  role: localStorage.getItem('role'),
};
window.shopNestAuth = shopNestAuth;

if (shopNestAuth.token) {
  const navbar = document.createElement('nav');
  navbar.innerHTML = `
    <div class="nav-left">
      <a class="brand" href="index.html">ShopNest</a>
      <button class="menu-toggle" onclick="toggleNav()">☰</button>
      <div class="nav-links">
        <a href="index.html">Home</a>
        <a href="account.html">Account</a>
        <a href="view_product.html">Products</a>
        ${
          shopNestAuth.role === 'customer'
            ? `
          <a href="cart.html">Cart <span id="cartCount" class="cart-count"></span></a>
          <a href="my_orders.html">My Orders</a>
        `
            : ''
        }
        ${
          shopNestAuth.role === 'vendor'
            ? `
          <a href="vendor_products.html">My Products</a>
          <a href="add_product.html">Add Product</a>
          <a href="vendor_orders.html">Customer Orders</a>
        `
            : ''
        }
      </div>
    </div>
    <div class="nav-right">
      <span class="user-badge">${shopNestAuth.username || 'User'}</span>
      <button onclick="logout()">Logout</button>
    </div>
  `;

  document.body.prepend(navbar);

  const style = document.createElement('style');
  style.innerHTML = `
  nav {
    background: #fff;
    border-bottom: 1px solid #e2e8f0;
    padding: 13px 30px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 20px;
    box-shadow: 0 2px 8px rgba(15, 23, 42, 0.04);
    position: relative;
    z-index: 10;
  }

  .nav-left {
    display: flex;
    align-items: center;
    gap: 20px;
  }

  .nav-links {
    display: flex;
    align-items: center;
    gap: 20px;
  }

  .nav-links a {
    text-decoration: none;
    color: #475569;
    font-size: 14px;
  }

  .nav-links a:hover {
    color: #172554;
  }

  .brand {
    text-decoration: none;
    font-size: 21px;
    font-weight: bold;
    color: #172554;
  }

  .menu-toggle {
    display: none;
    border: 0;
    background: white;
    font-size: 20px;
    cursor: pointer;
  }

  .nav-right {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .user-badge {
    font-size: 13px;
    color: #172033;
    background: #eef2ff;
    padding: 6px 10px;
    border-radius: 20px;
  }

  .cart-count {
    display: inline-flex;
    min-width: 18px;
    height: 18px;
    padding: 0 5px;
    align-items: center;
    justify-content: center;
    border-radius: 10px;
    background: #f59e0b;
    color: #172033;
    font-size: 11px;
    font-weight: bold;
    margin-left: 3px;
  }

  .nav-right button {
    padding: 8px 12px;
    background: #172033;
    color: #fff;
    border: none;
    border-radius: 6px;
    cursor: pointer;
  }

  .nav-right button:hover {
    background: #334155;
  }

  .theme-btn {
    font-size: 15px;
    padding: 7px 9px !important;
    background: #eef2ff !important;
    color: #172033 !important;
  }

  @media (max-width: 700px) {
    nav {
      padding: 12px 18px;
      align-items: center;
    }

    .menu-toggle {
      display: block;
    }

    .nav-left {
      gap: 12px;
    }

    .nav-links {
      display: none;
      position: absolute;
      left: 0;
      right: 0;
      top: 58px;
      background: #fff;
      border-bottom: 1px solid #e2e8f0;
      padding: 14px 18px;
      flex-direction: column;
      align-items: flex-start;
      gap: 14px;
    }

    .nav-links.open {
      display: flex;
    }

    .nav-right {
      margin-left: auto;
    }

    .user-badge {
      display: none;
    }
  }
`;
  document.head.appendChild(style);

  if (shopNestAuth.role === 'customer') {
    fetch(
      `http://localhost:3000/cart/view?username=${encodeURIComponent(shopNestAuth.username)}`
    )
      .then((res) => res.json())
      .then((result) => {
        const count = (result.data || []).reduce(
          (sum, item) => sum + Number(item.quantity || 0),
          0
        );
        const cartCount = document.getElementById('cartCount');
        if (cartCount) cartCount.textContent = count || '';
      })
      .catch(() => {});
  }
}

function toggleNav() {
  const links = document.querySelector('.nav-links');
  if (links) links.classList.toggle('open');
}

function logout() {
  localStorage.removeItem('token');
  localStorage.removeItem('username');
  localStorage.removeItem('role');
  localStorage.removeItem('userid');
  window.location.href = 'login.html';
}
