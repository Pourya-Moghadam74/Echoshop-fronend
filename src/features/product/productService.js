import axiosInstance from '../../api/axiosInstance';

export const fetchProducts = async (params = {}) => {
  try {
    const res = await axiosInstance.get('api/products/', { params });
    const data = res?.data;
    return data;
  } catch (err) {
    console.error('Error fetching products:', err);
    throw err; // let the thunk catch and surface the message
  }
};

export const fetchProductById = async (productId) => {
  try {
    const res = await axiosInstance.get(`products/${productId}/`);
    return res?.data;
  } catch (err) {
    console.error(`Error fetching product with ID ${productId}:`, err);
    throw err; // let the thunk catch and surface the message
  }
};