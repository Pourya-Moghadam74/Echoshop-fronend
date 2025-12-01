import axiosInstance from '../api/axiosInstance';

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


export const updateUserAddresses = async (addressData) => {
    try {
        const response = await axiosInstance.patch(`addresses/1/`, addressData);
        return response.data;
    } catch (error) {
        console.error('Error updating user addresses:', error);
        throw error;
    }
};