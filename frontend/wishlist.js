function getWishlist() {
  try {
    return JSON.parse(localStorage.getItem('shopNestWishlist') || '[]');
  } catch {
    return [];
  }
}

function isWishlisted(pid) {
  return getWishlist().some((item) => Number(item.pid) === Number(pid));
}

function toggleWishlist(product) {
  const list = getWishlist();
  const index = list.findIndex(
    (item) => Number(item.pid) === Number(product.pid)
  );
  if (index >= 0) {
    list.splice(index, 1);
  } else {
    list.push({
      pid: product.pid,
      name: product.name,
      price: product.price,
      detail: product.detail,
      image: product.image || '',
    });
  }
  localStorage.setItem('shopNestWishlist', JSON.stringify(list));
  document.dispatchEvent(new CustomEvent('wishlistChanged'));
  return index < 0;
}

function wishlistCount() {
  return getWishlist().length;
}
