import { Preloader } from '@ui';
import { FeedUI } from '@ui-pages';
import { TOrder } from '@utils-types';
import { FC, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../services/store';
import { fetchFeed, removeOrders, selectOrders } from '../../slices/feedSlice';
import { fetchIngredients } from '../../slices/ingredientsSlice';

export const Feed: FC = () => {
  const orders: TOrder[] = useAppSelector(selectOrders);
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(fetchFeed());
  }, [dispatch]);

  if (!orders.length) {
    return <Preloader />;
  }

  return (
    <FeedUI
      orders={orders}
      handleGetFeeds={() => {
        dispatch(removeOrders());
        dispatch(fetchFeed());
      }}
    />
  );
};
