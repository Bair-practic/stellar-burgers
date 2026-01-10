import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TOrder } from '@utils-types';
import { orderBurgerApi } from '../utils/burger-api';

type TInitialState = {
  orderModalData: TOrder | null;
  orderRequest: boolean;
  isModalOpened: boolean;
};

export const initialState: TInitialState = {
  orderModalData: null,
  orderRequest: false,
  isModalOpened: false
};

export const fetchNewOrder = createAsyncThunk(
  'order/newOrder',
  async (data: string[]) => orderBurgerApi(data)
);

const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    closeOrderRequest(state) {
      state.orderRequest = false;
      state.orderModalData = null;
    },
    openModal(state) {
      state.isModalOpened = true;
    },
    closeModal(state) {
      state.isModalOpened = false;
    }
  },
  selectors: {
    selectOrderModalData: (state) => state.orderModalData,
    selectOrderRequest: (state) => state.orderRequest,
    selectIsModalOpened: (state) => state.isModalOpened
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchNewOrder.pending, (state) => {
        state.orderRequest = true;
      })
      .addCase(fetchNewOrder.rejected, (state) => {
        state.orderRequest = false;
      })
      .addCase(fetchNewOrder.fulfilled, (state, action) => {
        state.orderModalData = action.payload.order;
        state.orderRequest = false;
      });
  }
});

export const { closeOrderRequest, openModal, closeModal } = orderSlice.actions;

export const selectOrderModalData = (
  state: import('../services/store').RootState
) => state.order.orderModalData;
export const selectOrderRequest = (
  state: import('../services/store').RootState
) => state.order.orderRequest;
export const selectIsModalOpened = (
  state: import('../services/store').RootState
) => state.order.isModalOpened;

export default orderSlice.reducer;
