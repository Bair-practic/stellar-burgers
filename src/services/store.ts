import { configureStore } from '@reduxjs/toolkit';

import {
  TypedUseSelectorHook,
  useDispatch as dispatchHook,
  useSelector as selectorHook
} from 'react-redux';
import constructorSlice from '../slices/constructorSlice';
import feedSlice from '../slices/feedSlice';
import ingredientsSlice from '../slices/ingredientsSlice';
import orderSlice from '../slices/orderSlice';
import ordersSlice from '../slices/ordersSlice';
import userSlice from '../slices/userSlice';

const store = configureStore({
  reducer: {
    ingredients: ingredientsSlice,
    burgerConstructor: constructorSlice,
    feed: feedSlice,
    order: orderSlice,
    orders: ordersSlice,
    user: userSlice
  },
  devTools: process.env.NODE_ENV !== 'production'
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch: () => AppDispatch = dispatchHook;
export const useAppSelector: TypedUseSelectorHook<RootState> = selectorHook;

export default store;
