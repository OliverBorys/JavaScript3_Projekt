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

const CART_ITEMS_KEY = 'cartItems';
const CART_UPDATED_EVENT = 'cartUpdated';

export interface CartItem {
  id: number;
  productName: string;
  price: number;
  quantity: number;
  brand?: string;
  image?: string;
}

export function getCartItems(): CartItem[] {
  return JSON.parse(localStorage.getItem(CART_ITEMS_KEY) || '[]');
}

export function saveCartItems(cartItems: CartItem[], openCart = false): void {
  localStorage.setItem(CART_ITEMS_KEY, JSON.stringify(cartItems));
  window.dispatchEvent(new CustomEvent(CART_UPDATED_EVENT, { detail: { openCart } }));
}

export function addToCart(product: Omit<CartItem, 'quantity'>): void {
  let cartItems = getCartItems();
  const existingItem = cartItems.find(item => item.id === product.id);

  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cartItems.push({ ...product, quantity: 1 });
  }

  saveCartItems(cartItems, false);
}

export function removeFromCart(productId: number): void {
  const updated = getCartItems().filter(item => item.id !== productId);
  saveCartItems(updated, true);
}

export function updateCartQuantity(productId: number, quantity: number): void {
  const updated = getCartItems().map(item =>
    item.id === productId ? { ...item, quantity: Math.max(1, quantity) } : item
  );
  saveCartItems(updated, false);
}

export function clearCart(): void {
  localStorage.removeItem(CART_ITEMS_KEY);
  saveCartItems([], true);
}


const ORDER_HISTORY_KEY = 'orderHistory';

export interface Order {
  id: number;
  date: string;
  items: CartItem[];
  customer: {
    firstName: string;
    lastName: string;
    email: string;
    mobilePhone: string;
    address: string;
    city: string;
    postalCode: string;
    paymentMethod: string;
  };
}

export function getOrderHistory(): Order[] {
  return JSON.parse(localStorage.getItem(ORDER_HISTORY_KEY) || '[]');
}

export function saveOrder(order: Order): void {
  const orders = getOrderHistory();
  orders.push(order);
  localStorage.setItem(ORDER_HISTORY_KEY, JSON.stringify(orders));
}

export function clearOrderHistory(): void {
  localStorage.removeItem(ORDER_HISTORY_KEY);
}
