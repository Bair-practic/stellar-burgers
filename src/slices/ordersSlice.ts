import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { TOrder } from '@utils-types';
import { getOrderByNumberApi, getOrdersApi } from '../utils/burger-api';

type TInitialState = {
  userOrders: TOrder[] | null;
  orderByNumber: TOrder | null;
  loading: boolean;
};

export const initialState: TInitialState = {
  userOrders: null,
  orderByNumber: null,
  loading: false
};

export const fetchUserOrders = createAsyncThunk(
  'orders/getUserOrders',
  async () => getOrdersApi()
);

export const getOrderByNumber = createAsyncThunk(
  'orders/getOrderByNumber',
  async (number: number) => {
    const response = await getOrderByNumberApi(number);
    if (response.success && response.orders && response.orders.length > 0) {
      return response.orders[0];
    }
    return Promise.reject(new Error('Order not found'));
  }
);

const ordersSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {
    removeUserOrders(state) {
      state.userOrders = null;
    }
  },
  selectors: {
    selectUserOrders: (state) => state.userOrders,
    selectOrderByNumber: (state) => state.orderByNumber,
    selectOrdersLoading: (state) => state.loading
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserOrders.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchUserOrders.rejected, (state) => {
        state.loading = false;
      })
      .addCase(fetchUserOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.userOrders = action.payload;
      })
      .addCase(getOrderByNumber.pending, (state) => {
        state.loading = true;
      })
      .addCase(getOrderByNumber.rejected, (state) => {
        state.loading = false;
        state.orderByNumber = null;
      })
      .addCase(getOrderByNumber.fulfilled, (state, action) => {
        state.loading = false;
        state.orderByNumber = action.payload;
      });
  }
});

export const { removeUserOrders } = ordersSlice.actions;

export const selectUserOrders = (
  state: import('../services/store').RootState
) => state.orders.userOrders;
export const selectOrderByNumber = (
  state: import('../services/store').RootState
) => state.orders.orderByNumber;
export const selectOrdersLoading = (
  state: import('../services/store').RootState
) => state.orders.loading;

export default ordersSlice.reducer;
