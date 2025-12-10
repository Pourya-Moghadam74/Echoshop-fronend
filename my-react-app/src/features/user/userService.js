import axiosInstance from '../../api/axiosInstance';

export const fetchUserInfo = async () => {
    try {
        // Fetches the user info API response
        const response = await axiosInstance.get('me/'); 
        const userInfoData = response.data; // Renamed variable
        // Returns the actual data object: { id, username, email, first_name, last_name }
        return userInfoData;
    } catch (error) {
        console.error('Error fetching user info:', error);
        throw error;
    }
};

export const fetchUserAddresses = async () => { // Renamed for clarity
    try {
        // Fetches the address list API response
        const response = await axiosInstance.get('addresses/'); 
        const addressData = response.data; // Renamed variable

        // Returns the actual data object: { count: 1, next: null, results: [...] }
        return addressData; 
        
    } catch (error) {
        console.error('Error fetching user addresses:', error);
        
        throw error;
        
    }
};

export const createUserAddresses = async (addressData) => {
  try {
    const response = await axiosInstance.post('addresses/', addressData); // add payload if required
    return response.data;
  } catch (error) {
    console.error('Error creating user addresses:', error);
    throw error;
  }
};


export const updateUserAddresses = async (addressData) => {
    try {
        const { id, ...address } = addressData;
        console.log('Updating address with data:', address);
        const response = await axiosInstance.put(`addresses/${id}/`, address);
        return response.data;
    } catch (error) {
        console.error('Error updating user addresses:', error);
        throw error;
    }
};