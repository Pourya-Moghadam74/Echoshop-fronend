import axiosInstance from "../../api/axiosInstance";

export const updateUserPassword = async (passwordData) => {
    try {
        const response = await axiosInstance.post('auth/password/change/', passwordData);
        return response.data;
    } catch (error) {
        console.error('Error updating user password:', error);
        throw error;
    }
};