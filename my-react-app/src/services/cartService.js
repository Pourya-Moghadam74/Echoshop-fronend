import axiosInstance from '../api/axiosInstance';

/**
 * Cart Service - Handles all backend cart operations
 * Best Practice: Centralized API layer for cart operations
 */

/**
 * Get the current cart from backend
 * @returns {Promise<Object>} Cart data with items, itemCount, subtotal
 */
export const getCart = async () => {
  try {
    const response = await axiosInstance.get('cart/');
    const cartData = response.data;

    // Transform backend format to frontend format
    const items = (cartData.items || []).map(item => ({
      id: item.product.id,
      name: item.product.name,
      price: parseFloat(item.product.price),
      quantity: item.quantity,
    }));

    return {
      items,
      itemCount: items.length,
      subtotal: parseFloat(cartData.subtotal || 0),
    };
  } catch (error) {
    console.error('Error fetching cart:', error);
    // Return empty cart on error
    return {
      items: [],
      itemCount: 0,
      subtotal: 0.00,
    };
  }
};

/**
 * Add item to cart on backend
 * @param {number} productId - Product ID
 * @param {number} quantity - Quantity to add
 * @returns {Promise<Object>} Created/updated cart item
 */
export const addItemToCart = async (productId, quantity = 1) => {
  try {
    const response = await axiosInstance.post('cart/items/', {
      product_id: productId,
      quantity: quantity,
    });
    return response.data;
  } catch (error) {
    console.error('Error adding item to cart:', error);
    throw error;
  }
};

/**
 * Update cart item quantity on backend
 * @param {number} cartItemId - Cart item ID
 * @param {number} quantity - New quantity
 * @returns {Promise<Object>} Updated cart item
 */
export const updateCartItem = async (cartItemId, quantity) => {
  try {
    // Since PATCH might not work reliably, we'll delete and recreate
    // This is handled by the sync function
    const response = await axiosInstance.patch(`cart/items/${cartItemId}/`, {
      quantity: quantity,
    });
    return response.data;
  } catch (error) {
    // If PATCH fails, we'll handle it in sync
    throw error;
  }
};

/**
 * Remove item from cart on backend
 * @param {number} cartItemId - Cart item ID
 * @returns {Promise<void>}
 */
export const removeItemFromCart = async (cartItemId) => {
  try {
    await axiosInstance.delete(`cart/items/${cartItemId}/`);
  } catch (error) {
    // Ignore 404 (item already deleted)
    if (error.response?.status !== 404) {
      console.error('Error removing item from cart:', error);
      throw error;
    }
  }
};

/**
 * Clear entire cart on backend
 * @returns {Promise<void>}
 */
export const clearCartOnBackend = async () => {
  try {
    const cart = await getCart();
    if (cart.items.length > 0) {
      const deletePromises = cart.items.map(async (item) => {
        // We need the backend cart item ID, so fetch full cart first
        const fullCart = await axiosInstance.get('cart/');
        const backendItem = fullCart.data.items.find(
          bi => bi.product.id === item.id
        );
        if (backendItem) {
          await removeItemFromCart(backendItem.id);
        }
      });
      await Promise.all(deletePromises);
    }
  } catch (error) {
    console.error('Error clearing cart on backend:', error);
    throw error;
  }
};

/**
 * Sync frontend cart state to backend (replace backend cart with frontend state)
 * Best Practice: Complete replacement ensures consistency
 * @param {Array} frontendItems - Frontend cart items
 * @returns {Promise<void>}
 */
export const syncCartToBackend = async (frontendItems = []) => {
  try {
    // Step 1: Get current backend cart
    const backendCart = await axiosInstance.get('cart/');
    const backendItems = backendCart.data.items || [];

    // Step 2: Delete all existing backend items
    if (backendItems.length > 0) {
      const deletePromises = backendItems.map(item =>
        axiosInstance.delete(`cart/items/${item.id}/`).catch(err => {
          // Ignore 404 errors (item already deleted)
          if (err.response?.status !== 404) {
            throw err;
          }
        })
      );
      await Promise.all(deletePromises);
    }

    // Step 3: Add all frontend items
    if (frontendItems.length > 0) {
      const addPromises = frontendItems.map(item =>
        axiosInstance.post('cart/items/', {
          product_id: item.id,
          quantity: item.quantity,
        })
      );
      await Promise.all(addPromises);
    }
  } catch (error) {
    console.error('Error syncing cart to backend:', error);
    throw error;
  }
};

