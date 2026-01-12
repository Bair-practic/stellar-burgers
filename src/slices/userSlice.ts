import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TUser } from '@utils-types';
import {
  getUserApi,
  loginUserApi,
  logoutApi,
  registerUserApi,
  TLoginData,
  TRegisterData,
  updateUserApi
} from '../utils/burger-api';

type TInitialState = {
  user: TUser;
  isAuthenticated: boolean;
  isInit: boolean;
  errorText: string;
  loading: boolean;
};

export const initialState: TInitialState = {
  user: {
    name: '',
    email: ''
  },
  isAuthenticated: false,
  isInit: false,
  errorText: '',
  loading: false
};

export const fetchLoginUser = createAsyncThunk(
  'user/login',
  async (data: TLoginData) => loginUserApi(data)
);

export const fetchRegisterUser = createAsyncThunk(
  'user/register',
  async (data: TRegisterData) => registerUserApi(data)
);

export const getUserThunk = createAsyncThunk('user/get', async () =>
  getUserApi()
);

export const fetchLogout = createAsyncThunk(
  'user/logout',
  async (params?: { accessToken?: string; refreshToken?: string }) =>
    logoutApi(params?.accessToken, params?.refreshToken)
);

export const fetchUpdateUser = createAsyncThunk(
  'user/update',
  async (user: Partial<TRegisterData>) => updateUserApi(user)
);

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    init(state) {
      state.isInit = true;
    },
    setErrorText(state, action: PayloadAction<string>) {
      state.errorText = action.payload;
    },
    removeErrorText(state) {
      state.errorText = '';
    }
  },
  selectors: {
    selectUser: (state) => state.user,
    selectIsAuthenticated: (state) => state.isAuthenticated,
    selectIsInit: (state) => state.isInit,
    selectErrorText: (state) => state.errorText,
    selectUserLoading: (state) => state.loading
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchLoginUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchLoginUser.rejected, (state, action) => {
        state.loading = false;
        state.errorText = action.error.message!;
      })
      .addCase(fetchLoginUser.fulfilled, (state) => {
        state.loading = false;
        state.isAuthenticated = true;
      })
      .addCase(fetchRegisterUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchRegisterUser.rejected, (state, action) => {
        state.loading = false;
        state.errorText = action.error.message!;
      })
      .addCase(fetchRegisterUser.fulfilled, (state) => {
        state.loading = false;
        state.isAuthenticated = true;
      })
      .addCase(getUserThunk.pending, (state) => {
        state.loading = true;
      })
      .addCase(getUserThunk.rejected, (state) => {
        state.loading = false;
        state.isAuthenticated = false;
        state.user = { name: '', email: '' };
      })
      .addCase(getUserThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.user.name = action.payload.user.name;
        state.user.email = action.payload.user.email;
        state.isAuthenticated = true;
      })
      .addCase(fetchLogout.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchLogout.rejected, (state) => {
        state.loading = false;
      })
      .addCase(fetchLogout.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload.success) {
          state.user = { name: '', email: '' };
          state.isAuthenticated = false;
        }
      })
      .addCase(fetchUpdateUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchUpdateUser.rejected, (state) => {
        state.loading = false;
      })
      .addCase(fetchUpdateUser.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload.success) {
          state.user.name = action.payload.user.name;
          state.user.email = action.payload.user.email;
        }
      });
  }
});

export const { init, setErrorText, removeErrorText } = userSlice.actions;

export const selectUser = (state: import('../services/store').RootState) =>
  state.user.user;
export const selectIsAuthenticated = (
  state: import('../services/store').RootState
) => state.user.isAuthenticated;
export const selectIsInit = (state: import('../services/store').RootState) =>
  state.user.isInit;
export const selectErrorText = (state: import('../services/store').RootState) =>
  state.user.errorText;
export const selectUserLoading = (
  state: import('../services/store').RootState
) => state.user.loading;

export default userSlice.reducer;
