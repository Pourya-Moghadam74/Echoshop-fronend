import axiosInstance from '../api/axiosInstance';

/**
 * Syncs cart items to the backend API
 * @param {Array} items - Array of cart items with {id, name, price, quantity}
 * @returns {Promise} - Promise that resolves when all items are synced
 */
export const syncCartToBackend = async (items) => {
  if (!items || items.length === 0) {
    return Promise.resolve();
  }

  try {
    // Sync each item to the backend
    // The backend will handle merging items with the same product_id
    const syncPromises = items.map(item => 
      axiosInstance.post('cart/items/', {
        product_id: item.id, // Map frontend 'id' to backend 'product_id'
        quantity: item.quantity,
        // attribute_id is optional, can be added later if needed
      })
    );

    await Promise.all(syncPromises);
    console.log('Cart synced to backend successfully');
  } catch (error) {
    console.error('Error syncing cart to backend:', error);
    throw error;
  }
};

