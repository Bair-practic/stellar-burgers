import { Preloader } from '@ui';
import { ProfileOrdersUI } from '@ui-pages';
import { FC, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../services/store';
import { fetchIngredients } from '../../slices/ingredientsSlice';
import {
  fetchUserOrders,
  removeUserOrders,
  selectUserOrders
} from '../../slices/ordersSlice';

export const ProfileOrders: FC = () => {
  const dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(fetchUserOrders());
  }, [dispatch]);
  const orders = useAppSelector(selectUserOrders);

  if (!orders) {
    return <Preloader />;
  }

  return <ProfileOrdersUI orders={orders} />;
};
