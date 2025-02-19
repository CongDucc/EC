import axios from 'axios';
import { ProductListParams, CategoryParams } from '../TypesCheck/HomeProp';
import { Platform } from 'react-native';

interface ICatProps {
    setGetCategory: React.Dispatch<React.SetStateAction<CategoryParams[]>>;
}

interface IProdByCatProps {
    setGetProductsByCatID: React.Dispatch<React.SetStateAction<ProductListParams[]>>;
    catID: string;
}

// For Android Emulator, use 10.0.2.2 instead of localhost
const BASE_URL = Platform.OS === 'android'
    ? 'http://10.0.2.2:9000'
    : 'http://localhost:9000';

const api = axios.create({
    baseURL: BASE_URL,
    timeout: 5000, // 5 second timeout
    headers: {
        'Content-Type': 'application/json'
    }
});

export const fetchCategories = async ({ setGetCategory }: ICatProps) => {
    try {
        const response = await api.get('/category');
        console.log('Categories response:', response.data);
        if (response.data) {
            setGetCategory(response.data);
        }
    } catch (error: any) {
        console.error('Error fetching categories:', {
            message: error.message,
            status: error.response?.status,
            data: error.response?.data
        });
        throw error;
    }
};

export const fetchProductsByCatID = async ({ setGetProductsByCatID, catID }: IProdByCatProps) => {
    try {
        const response = await api.get(`/product/category/${catID}`);
        console.log('Products response:', response.data);
        if (response.data) {
            setGetProductsByCatID(response.data);
        }
    } catch (error: any) {
        console.error('Error fetching products:', {
            message: error.message,
            status: error.response?.status,
            data: error.response?.data,
            catID
        });
        // Set empty array instead of throwing error to handle gracefully
        setGetProductsByCatID([]);
        throw error;
    }
};