import {
  AppHeader,
  IngredientDetails,
  Modal,
  OrderInfo,
  ProtectedRoute
} from '@components';
import {
  ConstructorPage,
  Feed,
  ForgotPassword,
  Login,
  NotFound404,
  Profile,
  ProfileOrders,
  Register,
  ResetPassword
} from '@pages';
import { useEffect } from 'react';
import { Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import '../../index.css';
import { useAppDispatch, useAppSelector } from '../../services/store';
import { fetchFeed, selectOrders } from '../../slices/feedSlice';
import {
  fetchIngredients,
  selectIngredients
} from '../../slices/ingredientsSlice';
import { closeModal, selectIsModalOpened } from '../../slices/orderSlice';
import {
  getUserThunk,
  init,
  selectIsAuthenticated,
  selectUserLoading
} from '../../slices/userSlice';
import { deleteCookie, getCookie } from '../../utils/cookie';
import styles from './app.module.css';

export const App = () => {
  const dispatch = useAppDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  const backgroundLocation = location.state?.background;
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const isLoading = useAppSelector(selectUserLoading);
  const ingredients = useAppSelector(selectIngredients);
  const feed = useAppSelector(selectOrders);

  useEffect(() => {
    const token = getCookie('accessToken');
    if (!isAuthenticated && token && !isLoading) {
      dispatch(getUserThunk())
        .unwrap()
        .then(() => {
          dispatch(init());
        })
        .catch((e) => {
          deleteCookie('accessToken');
          localStorage.removeItem('refreshToken');
        });
    } else if (!isLoading) {
      dispatch(init());
    }
  }, [dispatch, isAuthenticated, isLoading]);

  useEffect(() => {
    dispatch(fetchIngredients());
  }, [dispatch]);

  useEffect(() => {
    const path = location.pathname;
    if (path === '/feed' || path.startsWith('/feed/')) {
      dispatch(fetchFeed());
    }
  }, [dispatch, location.pathname]);

  return (
    <div className={styles.app}>
      <AppHeader />
      <Routes location={backgroundLocation || location}>
        <Route path='*' element={<NotFound404 />} />
        <Route path='/' element={<ConstructorPage />} />
        <Route path='/feed' element={<Feed />} />
        <Route
          path='/login'
          element={
            <ProtectedRoute unAuthOnly>
              <Login />
            </ProtectedRoute>
          }
        />
        <Route
          path='/register'
          element={
            <ProtectedRoute unAuthOnly>
              <Register />
            </ProtectedRoute>
          }
        />
        <Route
          path='/forgot-password'
          element={
            <ProtectedRoute unAuthOnly>
              <ForgotPassword />
            </ProtectedRoute>
          }
        />
        <Route
          path='/reset-password'
          element={
            <ProtectedRoute unAuthOnly>
              <ResetPassword />
            </ProtectedRoute>
          }
        />
        <Route
          path='/profile'
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route
          path='/profile/orders'
          element={
            <ProtectedRoute>
              <ProfileOrders />
            </ProtectedRoute>
          }
        />
        <Route path='/feed/:number' element={<OrderInfo />} />
        <Route path='/ingredients/:id' element={<IngredientDetails />} />
        <Route
          path='/profile/orders/:number'
          element={
            <ProtectedRoute>
              <OrderInfo />
            </ProtectedRoute>
          }
        />
      </Routes>

      {backgroundLocation && (
        <Routes location={location}>
          <Route
            path='/ingredients/:id'
            element={
              <Modal
                title={'Описание ингредиента'}
                onClose={() => {
                  dispatch(closeModal());
                  navigate(-1);
                }}
              >
                <IngredientDetails />
              </Modal>
            }
          />
          <Route
            path='/profile/orders/:number'
            element={
              <ProtectedRoute>
                <Modal
                  title={'Заказ'}
                  onClose={() => {
                    dispatch(closeModal());
                    navigate(-1);
                  }}
                >
                  <OrderInfo />
                </Modal>
              </ProtectedRoute>
            }
          />
          <Route
            path='/feed/:number'
            element={
              <Modal
                title={'Заказ'}
                onClose={() => {
                  dispatch(closeModal());
                  navigate(-1);
                }}
              >
                <OrderInfo />
              </Modal>
            }
          />
        </Routes>
      )}
    </div>
  );
};
