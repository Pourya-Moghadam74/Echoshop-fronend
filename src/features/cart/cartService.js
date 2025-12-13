import axiosInstance from '../../api/axiosInstance';

export const getCart = async () => {
  try {
    const response = await axiosInstance.get('api/cart/');
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
      itemCount: items.reduce((count, item) => count + item.quantity, 0),
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


export const addItemToCart = async (productId, quantity = 1) => {
  try {
    const response = await axiosInstance.post('api/cart/items/', {
      product_id: productId,
      quantity: quantity,
    });
    return response.data;
  } catch (error) {
    console.error('Error adding item to cart:', error);
    throw error;
  }
};



export const updateCartItem = async (cartItemId, quantity) => {
  try {
    // Since PATCH might not work reliably, we'll delete and recreate
    // This is handled by the sync function
    const response = await axiosInstance.patch(`api/cart/items/${cartItemId}/`, {
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
    await axiosInstance.delete(`api/cart/items/${cartItemId}/`);
  } catch (error) {
    // Ignore 404 (item already deleted)
    if (error.response?.status !== 404) {
      console.error('Error removing item from cart:', error);
      throw error;
    }
  }
};


export const clearCartOnBackend = async () => {
  try {
    const cart = await getCart();
    if (cart.items.length > 0) {
      const deletePromises = cart.items.map(async (item) => {
        // We need the backend cart item ID, so fetch full cart first
        const fullCart = await axiosInstance.get('api/cart/');
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


let isSyncing = false;

export const syncCartToBackend = async (frontendItems = []) => {
  if (isSyncing) return; // ← prevent duplicate syncs

  isSyncing = true;

  try {
    const backendCart = await axiosInstance.get("api/cart/");
    const backendItems = backendCart.data.items || [];

    // Delete every backend item
    await Promise.all(
      backendItems.map(item =>
        axiosInstance.delete(`api/cart/items/${item.id}/`).catch(err => {
          if (err.response?.status !== 404) throw err;
        })
      )
    );

    // Add items from frontend
    await Promise.all(
      frontendItems.map(item =>
        axiosInstance.post("api/cart/items/", {
          product_id: item.id,
          quantity: item.quantity,
        })
      )
    );

  } finally {
    isSyncing = false;
  }
};


