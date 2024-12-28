import api from './api';

export const createPayPalOrder = async (orderData) => {
    try {
        console.log("Calling API:", `${api.defaults.baseURL}/paypal/create-paypal-order`);
        const response = await api.post('/paypal/create-paypal-order', orderData);
        return response.data;
    } catch (error) {
        console.error('Error creating PayPal order:', error.response?.data || error.message);
        throw new Error(error.response?.data?.error || 'Failed to create PayPal order.');
    }
};
