import axiosInstance from '../api/axiosInstance';

/**
 * Intelligently syncs frontend cart to backend by only updating what changed
 * @param {Array} items - Array of cart items with {id, name, price, quantity}
 * @returns {Promise} - Promise that resolves when all items are synced
 */
export const syncCartToBackend = async (items) => {
  try {
    // Step 1: Get current backend cart
    const cartResponse = await axiosInstance.get('cart/');
    const backendItems = cartResponse.data.items || [];

    // Step 2: Create maps for efficient lookup
    // Frontend: key by product.id, value is {id, quantity}
    const frontendMap = new Map();
    items.forEach(item => {
      frontendMap.set(item.id, { id: item.id, quantity: item.quantity });
    });

    // Backend: key by product.id, value is {cartItemId, productId, quantity}
    const backendMap = new Map();
    backendItems.forEach(item => {
      backendMap.set(item.product.id, {
        cartItemId: item.id,
        productId: item.product.id,
        quantity: item.quantity
      });
    });

    // Step 3: Determine what operations are needed
    const operations = {
      toUpdate: [], // Items that exist in both but quantities differ
      toAdd: [],    // Items that only exist in frontend
      toDelete: []  // Items that only exist in backend
    };

    // Check frontend items
    frontendMap.forEach((frontendItem, productId) => {
      const backendItem = backendMap.get(productId);
      if (backendItem) {
        // Item exists in both - check if quantity needs updating
        if (backendItem.quantity !== frontendItem.quantity) {
          operations.toUpdate.push({
            cartItemId: backendItem.cartItemId,
            productId: productId,
            quantity: frontendItem.quantity
          });
        }
        // If quantities match, no action needed
      } else {
        // Item only exists in frontend - needs to be added
        operations.toAdd.push({
          productId: productId,
          quantity: frontendItem.quantity
        });
      }
    });

    // Check backend items that don't exist in frontend
    backendMap.forEach((backendItem, productId) => {
      if (!frontendMap.has(productId)) {
        // Item only exists in backend - needs to be deleted
        operations.toDelete.push(backendItem.cartItemId);
      }
    });

    // Step 4: Execute operations in parallel where possible
    const promises = [];

    // Update existing items (delete old, add new with correct quantity)
    // This is more reliable than PATCH since the backend handles merging in perform_create
    operations.toUpdate.forEach(item => {
      promises.push(
        axiosInstance.delete(`cart/items/${item.cartItemId}/`)
          .then(() => axiosInstance.post('cart/items/', {
            product_id: item.productId,
            quantity: item.quantity
          }))
          .catch(err => {
            console.error(`Failed to update cart item ${item.cartItemId}:`, err);
            throw err;
          })
      );
    });

    // Add new items (POST)
    operations.toAdd.forEach(item => {
      promises.push(
        axiosInstance.post('cart/items/', {
          product_id: item.productId,
          quantity: item.quantity
        }).catch(err => {
          console.error(`Failed to add cart item ${item.productId}:`, err);
          throw err;
        })
      );
    });

    // Delete removed items (DELETE)
    operations.toDelete.forEach(cartItemId => {
      promises.push(
        axiosInstance.delete(`cart/items/${cartItemId}/`).catch(err => {
          // If item doesn't exist (404), that's okay - it's already deleted
          if (err.response?.status === 404) {
            console.warn(`Cart item ${cartItemId} not found (already deleted)`);
            return Promise.resolve(); // Don't throw for 404 on delete
          }
          console.error(`Failed to delete cart item ${cartItemId}:`, err);
          throw err;
        })
      );
    });

    // Wait for all operations to complete
    await Promise.all(promises);

    const changes = {
      updated: operations.toUpdate.length,
      added: operations.toAdd.length,
      deleted: operations.toDelete.length
    };
    console.log('Cart synced to backend:', changes);
  } catch (error) {
    console.error('Error syncing cart to backend:', error);
    throw error;
  }
};

