USE acme26_jun;

UPDATE product
SET detail = CASE pid
  WHEN 1 THEN 'Everyday laptop for work, study and entertainment'
  WHEN 2 THEN 'Comfortable wireless mouse for everyday use'
  WHEN 3 THEN 'RGB mechanical keyboard with blue switches'
  WHEN 4 THEN 'Multi-port USB-C hub for laptops'
  WHEN 5 THEN 'Adjustable aluminium laptop stand'
  WHEN 6 THEN 'Portable speaker with clear sound'
  WHEN 7 THEN 'Full HD webcam for meetings and streaming'
  WHEN 8 THEN 'Lightweight backpack for laptops and accessories'
  WHEN 9 THEN 'Smart watch with fitness and notification features'
  ELSE detail
END
WHERE pid IN (1,2,3,4,5,6,7,8,9);

INSERT INTO product (name, price, detail, owner, is_active)
VALUES
('Wireless Headphones', 2499, 'Over-ear headphones with clear audio and soft ear cushions', 19, 1),
('Desk Lamp', 899, 'Compact LED desk lamp for study and work', 19, 1),
('Mobile Stand', 499, 'Simple adjustable stand for phones and small tablets', 19, 1),
('Power Bank', 1299, '10000mAh power bank for everyday travel', 19, 1);

INSERT INTO cart (username, pid, quantity)
VALUES
('customer', 4, 1),
('customer', 6, 2);

INSERT INTO orders (username, total, status)
VALUES ('customer', 3398, 'Delivered');
SET @order_id = LAST_INSERT_ID();

INSERT INTO order_items (oid, pid, quantity, price)
VALUES
(@order_id, 2, 1, 599),
(@order_id, 3, 1, 2499),
(@order_id, 4, 1, 300);

INSERT INTO orders (username, total, status)
VALUES ('customer', 2499, 'Processing');
SET @order_id = LAST_INSERT_ID();

INSERT INTO order_items (oid, pid, quantity, price)
VALUES
(@order_id, 6, 1, 1799),
(@order_id, 7, 1, 700);
