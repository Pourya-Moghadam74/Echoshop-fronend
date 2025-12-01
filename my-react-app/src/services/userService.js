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