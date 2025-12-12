import axiosInstance from '../../api/axiosInstance';

export const fetchCategories = async () => {
  try {
    const res = await axiosInstance.get('categories/');
    const data = res?.data;

    if (Array.isArray(data)) return data;
    if (Array.isArray(data?.results)) return data.results;
    if (Array.isArray(data?.categories)) return data.categories;

    return [];
  } catch (err) {
    console.error('Error fetching categories:', err);
    throw err; // let the thunk catch and surface the message
  }
};
