import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ProductListParams, CartItem, CartState } from '../TypesCheck/productCartTypes';

export const CartSlide = createSlice({
    name: 'cart',
    initialState: {
        cart: [],
        length: 0,
    },
    reducers: {
        addToCart: (state: CartItem, action: PayloadAction<ProductListParams>) => {
            const existingItem = state.cart.find(item => item._id === action.payload._id);
            if (!existingItem) {
                state.cart.push(action.payload);
            }
        },
        increaseQuantity: (state: CartItem, action: PayloadAction<ProductListParams>) => {
            const existingItem = state.cart.find(item => item._id === action.payload._id);
            if (existingItem) {
                existingItem.quantity++;
            }
        },
        clearCart: (state) => {
            state.cart = [];
            state.length = 0;
        },
        decreaseQuantity: (state: CartItem, action: PayloadAction<ProductListParams>) => {
            const existingItem = state.cart.find(item => item._id === action.payload._id);
            if (existingItem) {
                existingItem.quantity--;
            }
        },
        removeFromCart: (state: CartItem, action: PayloadAction<string>) => {
            const removeItem = state.cart.filter(item => item._id !== action.payload);
            state.cart = removeItem;
        },
    },
});

export const { addToCart, increaseQuantity, decreaseQuantity, removeFromCart, clearCart } = CartSlide.actions;
export default CartSlide.reducer;
