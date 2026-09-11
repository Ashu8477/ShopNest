const productImages = {
  product:
    'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=700&q=80',
  'Wireless Mouse':
    'https://images.unsplash.com/photo-1527814050087-3793815479db?auto=format&fit=crop&w=700&q=80',
  'Mechanical Keyboard':
    'https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=700&q=80',
  'USB-C Hub':
    'https://images.unsplash.com/photo-1625842268584-8f3296236761?auto=format&fit=crop&w=700&q=80',
  'Laptop Stand':
    'https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=700&q=80',
  'Bluetooth Speaker':
    'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?auto=format&fit=crop&w=700&q=80',
  Webcam:
    'https://images.unsplash.com/photo-1587825140708-dfaf72ae4b04?auto=format&fit=crop&w=700&q=80',
  'Laptop Backpack':
    'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=700&q=80',
  'Smart Watch':
    'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=700&q=80',
  'Wireless Headphones':
    'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=700&q=80',
  'Desk Lamp':
    'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=700&q=80',
  'Mobile Stand':
    'https://images.unsplash.com/photo-1601524909162-ae8725290836?auto=format&fit=crop&w=700&q=80',
  'Power Bank':
    'https://images.unsplash.com/photo-1609592424995-f5f7f5f6d3f?auto=format&fit=crop&w=700&q=80',
};

function getProductImage(product) {
  if (product && product.image) {
    return product.image;
  }

  return (
    productImages[product?.name] ||
    'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&w=700&q=80'
  );
}
