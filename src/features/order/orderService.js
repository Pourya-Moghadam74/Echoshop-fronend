import axiosInstance from '../../api/axiosInstance';


export const checkoutOrder = async (orderData) => {
  try {
    const response = await axiosInstance.post("/orders/checkout/", orderData);
    return response.data;  // The created order (full serializer)
  } catch (error) {
    console.error("Checkout failed:", error.response?.data || error);
    throw error;
  }
};

export const getUserOrders = async () => {
  try {
    const response = await axiosInstance.get("/orders/");
    return response.data;  // Array of orders or paginated results
  } catch (error) {
    console.error("Failed to fetch orders:", error.response?.data || error);
    throw error;
  }
};


export const getOrderDetails = async (orderId) => {
  try {
    const response = await axiosInstance.get(`/orders/${orderId}/`);
    return response.data;  // Full order with items + history
  } catch (error) {
    console.error("Failed to fetch order details:", error.response?.data || error);
    throw error;
  }
};


