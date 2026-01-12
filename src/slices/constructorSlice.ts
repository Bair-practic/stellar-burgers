import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
  TConstructorItems,
  TIngredient,
  TIngredientUnique
} from '@utils-types';
import { v4 as uuidv4 } from 'uuid';

type TInitialState = {
  constructorItems: TConstructorItems;
};

export const initialState: TInitialState = {
  constructorItems: {
    bun: {
      price: 0
    },
    ingredients: []
  }
};

const constructorSlice = createSlice({
  name: 'constructor',
  initialState,
  reducers: {
    addIngredient(state, action: PayloadAction<TIngredient>) {
      if (action.payload.type === 'bun') {
        state.constructorItems.bun = action.payload;
      } else {
        state.constructorItems.ingredients.push({
          ...action.payload,
          uniqueId: uuidv4()
        });
      }
    },
    deleteIngredient(state, action: PayloadAction<TIngredientUnique>) {
      const ingredientIndex = state.constructorItems.ingredients.findIndex(
        (item) => item.uniqueId === action.payload.uniqueId
      );
      state.constructorItems.ingredients =
        state.constructorItems.ingredients.filter(
          (_, index) => index !== ingredientIndex
        );
    },
    moveIngredientUp(state, action: PayloadAction<TIngredientUnique>) {
      const ingredientIndex = state.constructorItems.ingredients.findIndex(
        (item) => item.uniqueId === action.payload.uniqueId
      );
      const prevItem = state.constructorItems.ingredients[ingredientIndex - 1];
      state.constructorItems.ingredients.splice(
        ingredientIndex - 1,
        2,
        action.payload,
        prevItem
      );
    },
    moveIngredientDown(state, action: PayloadAction<TIngredientUnique>) {
      const ingredientIndex = state.constructorItems.ingredients.findIndex(
        (item) => item.uniqueId === action.payload.uniqueId
      );
      const nextItem = state.constructorItems.ingredients[ingredientIndex + 1];
      state.constructorItems.ingredients.splice(
        ingredientIndex,
        2,
        nextItem,
        action.payload
      );
    },
    clearConstructor(state) {
      state.constructorItems = {
        bun: {
          price: 0
        },
        ingredients: []
      };
    }
  },
  selectors: {
    selectConstructorItems: (state) => state.constructorItems
  }
});

export const {
  addIngredient,
  deleteIngredient,
  moveIngredientUp,
  moveIngredientDown,
  clearConstructor
} = constructorSlice.actions;

export const selectConstructorItems = (
  state: import('../services/store').RootState
) => state.burgerConstructor.constructorItems;

export default constructorSlice.reducer;
