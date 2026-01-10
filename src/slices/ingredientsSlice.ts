import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { TIngredient } from '@utils-types';
import { getIngredientsApi } from '../utils/burger-api';

type TInitialState = {
  ingredients: TIngredient[];
  loading: boolean;
};

export const initialState: TInitialState = {
  ingredients: [],
  loading: false
};

export const fetchIngredients = createAsyncThunk(
  'ingredients/getAll',
  async () => getIngredientsApi()
);

const ingredientsSlice = createSlice({
  name: 'ingredients',
  initialState,
  reducers: {},
  selectors: {
    selectIngredients: (state) => state.ingredients,
    selectLoading: (state) => state.loading
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchIngredients.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchIngredients.fulfilled, (state, action) => {
        state.loading = false;
        state.ingredients = action.payload;
      })
      .addCase(fetchIngredients.rejected, (state) => {
        state.loading = false;
      });
  }
});

export const selectIngredients = (
  state: import('../services/store').RootState
) => state.ingredients.ingredients;
export const selectLoading = (state: import('../services/store').RootState) =>
  state.ingredients.loading;

export default ingredientsSlice.reducer;
