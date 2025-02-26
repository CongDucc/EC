import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from 'redux-persist';
import CartReducer from './redux/CartReducer';
import storage from '@react-native-async-storage/async-storage';

const persistConfig = {
    key: 'root',
    storage,
    version: 1
};

const persistedReducer = persistReducer(persistConfig, CartReducer);

export const store = configureStore({
    reducer: {
        cart: persistedReducer
    },
    middleware: (gotoDefaultMiddleware) => gotoDefaultMiddleware({
        serializableCheck: {
            ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER]
        }
    })
});

export const persistor = persistStore(store);
export type RootState = ReturnType<typeof store.getState>;
