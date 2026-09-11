import bcrypt from 'bcrypt';
import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import jwt from 'jsonwebtoken';
import mysql from 'mysql2/promise';

dotenv.config();

const connection = await mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'acme26_jun',
});

console.log('Db connection Success');

const app = express();
app.use(cors());

app.use(express.json());

app.post('/signup', async (req, res) => {
  const { username, password, role } = req.body;

  if (!username || !password || !role) {
    return res.status(400).json({
      error: true,
      message: 'All fields are required',
    });
  }

  try {
    const [existingUser] = await connection.query(
      'select userID from users where username=?',
      [username]
    );

    if (existingUser.length > 0) {
      return res.status(409).json({
        error: true,
        message: 'Username already exists',
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await connection.query(
      'insert into users(username,password,role) values(?,?,?)',
      [username, hashedPassword, role]
    );

    res.status(201).json({
      error: false,
      message: 'Signup Successful',
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      error: true,
      message: 'Signup Failed',
    });
  }
});

app.post('/login', async (req, res) => {
  const { username, password } = req.body;

  console.log('Login Body=', req.body);

  try {
    const sql = `
      SELECT userID, username, password, role
      FROM users
      WHERE username = ?
      AND is_active = 1
    `;

    const [loginResult] = await connection.query(sql, [username]);

    console.log('Login result=', loginResult);

    if (loginResult.length === 0) {
      return res.status(401).json({
        error: true,
        message: 'Login Failed',
        data: [],
      });
    }

    const user = loginResult[0];

    const isPasswordCorrect = await bcrypt.compare(password, user.password);

    console.log('Password Correct=', isPasswordCorrect);

    // Password incorrect
    if (!isPasswordCorrect) {
      return res.status(401).json({
        error: true,
        message: 'Login Failed',
        data: [],
      });
    }

    const token = jwt.sign(
      {
        userID: user.userID,
        username: user.username,
        role: user.role,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: '1h',
      }
    );

    console.log('JWT Token=', token);

    res.status(200).json({
      error: false,
      message: 'Login Success',
      data: {
        userID: user.userID,
        username: user.username,
        role: user.role,
        token: token,
      },
    });
  } catch (exception) {
    console.log('Login Exception=', exception);

    res.status(500).json({
      error: true,
      message: 'Something went wrong',
    });
  }
});

app.post('/product/add', async (req, res) => {
  const { name, price, detail, image, owner } = req.body;

  if (!name || !price || !detail || !owner) {
    return res.status(400).json({
      error: true,
      message: 'All fields are required',
    });
  }

  try {
    const [users] = await connection.query(
      'select userID from users where username=? and role=? and is_active=1',
      [owner, 'vendor']
    );

    if (users.length === 0) {
      return res.status(403).json({
        error: true,
        message: 'Vendor account not found',
      });
    }

    await connection.query(
      'insert into product(name,price,detail,image,owner,is_active) values(?,?,?,?,?,1)',
      [name, price, detail, image || null, users[0].userID]
    );

    res.status(201).json({
      error: false,
      message: 'Product Upload Success',
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      error: true,
      message: 'Something went wrong',
    });
  }
});

app.get('/product/view', async (req, res) => {
  try {
    const [products] = await connection.query(
      'select * from product where is_active=1'
    );

    res.status(200).json({
      error: false,
      message: 'Product fetch success',
      data: products,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      error: true,
      message: 'Something went wrong',
    });
  }
});

app.get('/product/:pid', async (req, res) => {
  try {
    const [products] = await connection.query(
      'select * from product where pid=? and is_active=1',
      [req.params.pid]
    );

    if (products.length === 0) {
      return res
        .status(404)
        .json({ error: true, message: 'Product not found' });
    }

    res.status(200).json({
      error: false,
      message: 'Product fetch success',
      data: products[0],
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: true, message: 'Something went wrong' });
  }
});

app.put('/product/edit/:pid', async (req, res) => {
  const pid = req.params.pid;
  const { name, price, detail, image, owner } = req.body;

  try {
    const [users] = await connection.query(
      'select userID from users where username=? and role=? and is_active=1',
      [owner, 'vendor']
    );

    if (users.length === 0) {
      return res.status(403).json({
        error: true,
        message: 'Vendor account not found',
      });
    }

    const [result] = await connection.query(
      'update product set name=?, price=?, detail=?, image=? where pid=? and owner=? and is_active=1',
      [name, price, detail, image || null, pid, users[0].userID]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        error: true,
        message: 'Product not found',
      });
    }

    res.status(200).json({
      error: false,
      message: 'Product Update Success',
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      error: true,
      message: 'Something went wrong',
    });
  }
});

app.delete('/product/remove/:pid', async (req, res) => {
  const pid = req.params.pid;
  const { owner } = req.body;

  try {
    const [users] = await connection.query(
      'select userID from users where username=? and role=? and is_active=1',
      [owner, 'vendor']
    );

    if (users.length === 0) {
      return res.status(403).json({
        error: true,
        message: 'Vendor account not found',
      });
    }

    const [result] = await connection.query(
      'update product set is_active=0 where pid=? and owner=?',
      [pid, users[0].userID]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        error: true,
        message: 'Product not found',
      });
    }

    res.status(200).json({
      error: false,
      message: 'Product Delete Success',
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      error: true,
      message: 'Something went wrong',
    });
  }
});

app.post('/cart/add', async (req, res) => {
  const { username, pid, quantity } = req.body;

  try {
    const [existingCart] = await connection.query(
      'select * from cart where username=? and pid=?',
      [username, pid]
    );

    if (existingCart.length > 0) {
      await connection.query(
        'update cart set quantity=quantity+? where username=? and pid=?',
        [quantity || 1, username, pid]
      );
    } else {
      await connection.query(
        'insert into cart(username,pid,quantity) values(?,?,?)',
        [username, pid, quantity || 1]
      );
    }

    res.status(201).json({
      error: false,
      message: 'Product added to cart',
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      error: true,
      message: 'Something went wrong',
    });
  }
});

app.get('/cart/view', async (req, res) => {
  const { username } = req.query;

  try {
    const [cart] = await connection.query(
      `select
        cart.cid,
        cart.pid,
        cart.quantity,
        product.name,
        product.price,
        product.detail
      from cart
      inner join product on cart.pid = product.pid
      where cart.username=?`,
      [username]
    );

    res.status(200).json({
      error: false,
      message: 'Cart fetch success',
      data: cart,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      error: true,
      message: 'Something went wrong',
    });
  }
});

app.put('/cart/update/:cid', async (req, res) => {
  const { quantity } = req.body;
  const cid = req.params.cid;
  try {
    if (!Number.isInteger(quantity) || quantity < 1) {
      return res.status(400).json({ error: true, message: 'Invalid quantity' });
    }
    await connection.query('update cart set quantity=? where cid=?', [
      quantity,
      cid,
    ]);
    res.status(200).json({ error: false, message: 'Cart updated' });
  } catch (exception) {
    console.log(exception);
    res.status(500).json({ error: true, message: 'Something went wrong' });
  }
});

app.delete('/cart/remove/:cid', async (req, res) => {
  const cid = req.params.cid;
  try {
    await connection.query('delete from cart where cid=?', [cid]);
    res.status(200).json({ error: false, message: 'Item removed' });
  } catch (exception) {
    console.log(exception);
    res.status(500).json({ error: true, message: 'Something went wrong' });
  }
});

app.post('/order/place', async (req, res) => {
  const { username } = req.body;

  try {
    const [cart] = await connection.query(
      `select pid, quantity, price
       from cart
       inner join product on cart.pid = product.pid
       where cart.username=?`,
      [username]
    );

    if (cart.length === 0) {
      return res.status(400).json({
        error: true,
        message: 'Cart is empty',
      });
    }

    let subtotal = 0;

    cart.forEach((item) => {
      subtotal += item.price * item.quantity;
    });

    const delivery = subtotal >= 999 ? 0 : 49;
    const total = subtotal + delivery;

    const [orderResult] = await connection.query(
      'insert into orders(username,total,status) values(?,?,?)',
      [username, total, 'Placed']
    );

    const oid = orderResult.insertId;

    for (const item of cart) {
      await connection.query(
        `insert into order_items(oid,pid,quantity,price)
         values(?,?,?,?)`,
        [oid, item.pid, item.quantity, item.price]
      );
    }

    await connection.query('delete from cart where username=?', [username]);

    res.status(201).json({
      error: false,
      message: 'Order placed successfully',
      data: {
        oid: oid,
        subtotal: subtotal,
        delivery: delivery,
        total: total,
      },
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      error: true,
      message: 'Something went wrong',
    });
  }
});

app.get('/order/view', async (req, res) => {
  const { username } = req.query;

  try {
    const [orders] = await connection.query(
      `select
        o.oid,
        o.username,
        o.total,
        o.status,
        o.created_at,
        oi.pid,
        oi.quantity,
        oi.price,
        p.name
      from orders o
      join order_items oi on o.oid = oi.oid
      join product p on oi.pid = p.pid
      where o.username=?
      order by o.created_at desc`,
      [username]
    );

    res.status(200).json({
      error: false,
      message: 'Orders fetch success',
      data: orders,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      error: true,
      message: 'Something went wrong',
    });
  }
});

app.get('/vendor/orders', async (req, res) => {
  const { username } = req.query;

  try {
    const [orders] = await connection.query(
      `select
        o.oid,
        o.username,
        o.total,
        o.status,
        o.created_at,
        oi.pid,
        oi.quantity,
        oi.price,
        p.name
      from orders o
      join order_items oi on o.oid = oi.oid
      join product p on oi.pid = p.pid
      join users u on p.owner = u.userID
      where u.username=? and u.role='vendor'
      order by o.created_at desc`,
      [username]
    );

    res.status(200).json({
      error: false,
      message: 'Orders fetch success',
      data: orders,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      error: true,
      message: 'Something went wrong',
    });
  }
});

app.put('/order/cancel/:oid', async (req, res) => {
  const { username } = req.body;
  const oid = req.params.oid;

  try {
    const [orders] = await connection.query(
      `select oid, status from orders where oid=? and username=?`,
      [oid, username]
    );

    if (orders.length === 0) {
      return res.status(404).json({ error: true, message: 'Order not found' });
    }

    if (!['Placed', 'Processing'].includes(orders[0].status)) {
      return res
        .status(400)
        .json({ error: true, message: 'This order cannot be cancelled now' });
    }

    await connection.query('update orders set status=? where oid=?', [
      'Cancelled',
      oid,
    ]);

    res
      .status(200)
      .json({ error: false, message: 'Order cancelled successfully' });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: true, message: 'Something went wrong' });
  }
});

app.put('/order/status/:oid', async (req, res) => {
  const { status } = req.body;
  const oid = req.params.oid;

  try {
    await connection.query('update orders set status=? where oid=?', [
      status,
      oid,
    ]);

    res.status(200).json({
      error: false,
      message: 'Order status updated',
    });
  } catch (exception) {
    console.log(exception);

    res.status(500).json({
      error: true,
      message: 'Something went wrong',
    });
  }
});

app.get('/vendor/products', async (req, res) => {
  const { owner } = req.query;

  try {
    const [products] = await connection.query(
      `select p.*
       from product p
       join users u on p.owner=u.userID
       where u.username=? and u.role='vendor' and p.is_active=1
       order by p.pid desc`,
      [owner]
    );

    res.status(200).json({
      error: false,
      message: 'Products fetch success',
      data: products,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      error: true,
      message: 'Something went wrong',
    });
  }
});

console.log('Server is waiting for requests...');

app.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
});
