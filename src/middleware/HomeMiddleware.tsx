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

interface IFilterProps {
    setGetProductsByCatID: React.Dispatch<React.SetStateAction<ProductListParams[]>>;
    maxPrice?: number;
}


// For Android Emulator, use 10.0.2.2 instead of localhost
export const getImageUrl = (imagePath: string) => {
    if (!imagePath) return null;

    // If it's already a full URL, replace localhost with IP for Android
    if (imagePath.startsWith('http')) {
        if (Platform.OS === 'android') {
            return imagePath.replace('localhost', '192.168.0.103');
        }
        return imagePath;
    }

    // If it's just a filename, construct the full URL
    const baseUrl = Platform.OS === 'android'
        ? 'http://192.168.0.1034:9000'
        : 'http://localhost:9000';
    return `${baseUrl}/assets/${imagePath}`;
};

const BASE_URL = Platform.OS === 'android'
    ? 'http://192.168.0.103:9000'
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
        let response;
        if (catID) {
            response = await api.get(`/product/category/${catID}`);
        } else {
            response = await api.get(`/product/getAllProducts`);
        }
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

export const fetchProductsByPrice = async ({ setGetProductsByCatID, maxPrice }: IFilterProps) => {
    try {
        const response = await api.get(`/product/filter?maxPrice=${maxPrice}`);
        if (response.data) {
            setGetProductsByCatID(response.data);
        }
    } catch (error: any) {
        console.error('Error fetching products by price:', error);
        setGetProductsByCatID([]);
        throw error;
    }
};