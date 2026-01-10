import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { TOrder } from '@utils-types';
import { getOrdersApi } from '../utils/burger-api';

type TInitialState = {
  userOrders: TOrder[] | null;
  loading: boolean;
};

export const initialState: TInitialState = {
  userOrders: null,
  loading: false
};

export const fetchUserOrders = createAsyncThunk(
  'orders/getUserOrders',
  async () => getOrdersApi()
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
      });
  }
});

export const { removeUserOrders } = ordersSlice.actions;

export const selectUserOrders = (
  state: import('../services/store').RootState
) => state.orders.userOrders;
export const selectOrdersLoading = (
  state: import('../services/store').RootState
) => state.orders.loading;

export default ordersSlice.reducer;
