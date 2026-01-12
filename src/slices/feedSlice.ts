import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { TOrder } from '@utils-types';
import { getFeedsApi } from '../utils/burger-api';

type TInitialState = {
  orders: TOrder[];
  totalOrders: number;
  ordersToday: number;
  loading: boolean;
};

export const initialState: TInitialState = {
  orders: [],
  totalOrders: 0,
  ordersToday: 0,
  loading: false
};

export const fetchFeed = createAsyncThunk('feed/getAll', async () =>
  getFeedsApi()
);

const feedSlice = createSlice({
  name: 'feed',
  initialState,
  reducers: {
    removeOrders(state) {
      state.orders.length = 0;
    }
  },
  selectors: {
    selectOrders: (state) => state.orders,
    selectTotalOrders: (state) => state.totalOrders,
    selectTodayOrders: (state) => state.ordersToday,
    selectFeedLoading: (state) => state.loading
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchFeed.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchFeed.rejected, (state) => {
        state.loading = false;
      })
      .addCase(fetchFeed.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload.orders;
        state.totalOrders = action.payload.total;
        state.ordersToday = action.payload.totalToday;
      });
  }
});

export const { removeOrders } = feedSlice.actions;

export const selectOrders = (state: import('../services/store').RootState) =>
  state.feed.orders;
export const selectTotalOrders = (
  state: import('../services/store').RootState
) => state.feed.totalOrders;
export const selectTodayOrders = (
  state: import('../services/store').RootState
) => state.feed.ordersToday;
export const selectFeedLoading = (
  state: import('../services/store').RootState
) => state.feed.loading;

export default feedSlice.reducer;
