const LIKED_PRODUCTS_KEY = 'likedProducts';

export function getLikedProducts(): number[] {
  return JSON.parse(localStorage.getItem(LIKED_PRODUCTS_KEY) || '[]');
}

export function saveLikedProducts(likedProducts: number[]): void {
  localStorage.setItem(LIKED_PRODUCTS_KEY, JSON.stringify(likedProducts));
}

export function toggleLikeProduct(productId: number): number[] {
  let likedProducts = getLikedProducts();
  if (likedProducts.includes(productId)) {
    likedProducts = likedProducts.filter(id => id !== productId);
  } else {
    likedProducts.push(productId);
  }
  saveLikedProducts(likedProducts);
  return likedProducts;
}

export function isProductLiked(productId: number): boolean {
  const likedProducts = getLikedProducts();
  return likedProducts.includes(productId);
}
