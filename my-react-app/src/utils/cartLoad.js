import axiosInstance from '../api/axiosInstance';

/**
 * Fetches cart from the backend API and transforms it to match Redux state format
 * @returns {Promise<Object>} - Promise that resolves to cart data: {items, itemCount, subtotal}
 */
export const loadCartFromBackend = async () => {
  try {
    const response = await axiosInstance.get('cart/');
    const cartData = response.data;

    // Transform backend cart items to match frontend Redux state format
    // Backend format: {id, product: {id, name, price, sku}, attribute, quantity, total_price}
    // Frontend format: {id, name, price, quantity}
    const transformedItems = cartData.items.map(item => ({
      id: item.product.id, // Use product.id as the item id
      name: item.product.name,
      price: parseFloat(item.product.price),
      quantity: item.quantity,
    }));

    return {
      items: transformedItems,
      itemCount: transformedItems.length,
      subtotal: parseFloat(cartData.subtotal || 0),
    };
  } catch (error) {
    console.error('Error loading cart from backend:', error);
    // Return empty cart if there's an error (e.g., no cart exists yet)
    return {
      items: [],
      itemCount: 0,
      subtotal: 0.00,
    };
  }
};

