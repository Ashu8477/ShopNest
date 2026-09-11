USE acme26_jun;

ALTER TABLE product
ADD COLUMN image TEXT NULL AFTER detail;

UPDATE product SET image='https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=700&q=80' WHERE pid=1;
UPDATE product SET image='https://images.unsplash.com/photo-1527814050087-3793815479db?auto=format&fit=crop&w=700&q=80' WHERE pid=2;
UPDATE product SET image='https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=700&q=80' WHERE pid=3;
UPDATE product SET image='https://images.unsplash.com/photo-1625842268584-8f3296236761?auto=format&fit=crop&w=700&q=80' WHERE pid=4;
UPDATE product SET image='https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=700&q=80' WHERE pid=5;
UPDATE product SET image='https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?auto=format&fit=crop&w=700&q=80' WHERE pid=6;
UPDATE product SET image='https://images.unsplash.com/photo-1587825140708-dfaf72ae4b04?auto=format&fit=crop&w=700&q=80' WHERE pid=7;
UPDATE product SET image='https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=700&q=80' WHERE pid=8;
UPDATE product SET image='https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=700&q=80' WHERE pid=9;
UPDATE product SET image='https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=700&q=80' WHERE name='Wireless Headphones';
UPDATE product SET image='https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=700&q=80' WHERE name='Desk Lamp';
UPDATE product SET image='https://images.unsplash.com/photo-1601524909162-ae8725290836?auto=format&fit=crop&w=700&q=80' WHERE name='Mobile Stand';
UPDATE product SET image='https://images.unsplash.com/photo-1609592424995-f5f7f5f6d3f?auto=format&fit=crop&w=700&q=80' WHERE name='Power Bank';
