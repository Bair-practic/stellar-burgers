import { TIngredient } from '@utils-types';
import { FC, useEffect, useMemo } from 'react';
import { redirect, useParams } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../services/store';
import { selectIngredients } from '../../slices/ingredientsSlice';
import { selectOrders } from '../../slices/feedSlice';
import {
  getOrderByNumber,
  selectOrderByNumber,
  selectUserOrders
} from '../../slices/ordersSlice';
import { OrderInfoUI } from '../ui/order-info';
import { Preloader } from '../ui/preloader';

export const OrderInfo: FC = () => {
  const params = useParams<{ number: string }>();
  const dispatch = useAppDispatch();

  if (!params.number) {
    redirect('/feed');
    return null;
  }

  const orderNumber = parseInt(params.number!);
  const feedOrders = useAppSelector(selectOrders);
  const userOrders = useAppSelector(selectUserOrders);
  const orderByNumber = useAppSelector(selectOrderByNumber);

  const ingredients: TIngredient[] = useAppSelector(selectIngredients);

  useEffect(() => {
    if (!orderNumber) return;

    const orderInFeed = feedOrders.find((item) => item.number === orderNumber);
    const orderInUser = userOrders?.find((item) => item.number === orderNumber);
    const orderByNum =
      orderByNumber && orderByNumber.number === orderNumber
        ? orderByNumber
        : null;

    if (!orderInFeed && !orderInUser && !orderByNum) {
      dispatch(getOrderByNumber(orderNumber));
    }
  }, [dispatch, orderNumber, feedOrders, userOrders, orderByNumber]);

  const orderData =
    feedOrders.find((item) => item.number === orderNumber) ||
    (userOrders && userOrders.find((item) => item.number === orderNumber)) ||
    (orderByNumber && orderByNumber.number === orderNumber
      ? orderByNumber
      : null);

  /* Готовим данные для отображения */
  const orderInfo = useMemo(() => {
    if (!orderData || !ingredients.length) return null;

    const date = new Date(orderData.createdAt);

    type TIngredientsWithCount = {
      [key: string]: TIngredient & { count: number };
    };

    const ingredientsInfo = orderData.ingredients.reduce(
      (acc: TIngredientsWithCount, item) => {
        if (!acc[item]) {
          const ingredient = ingredients.find((ing) => ing._id === item);
          if (ingredient) {
            acc[item] = {
              ...ingredient,
              count: 1
            };
          }
        } else {
          acc[item].count++;
        }

        return acc;
      },
      {}
    );

    const total = Object.values(ingredientsInfo).reduce(
      (acc, item) => acc + item.price * item.count,
      0
    );

    return {
      ...orderData,
      ingredientsInfo,
      date,
      total
    };
  }, [orderData, ingredients]);

  if (!orderInfo) {
    return <Preloader />;
  }

  return (
    <>
      <p
        className='text text_type_digits-default'
        style={{ textAlign: 'center' }}
      >
        #{params.number}
      </p>
      <OrderInfoUI orderInfo={orderInfo} />
    </>
  );
};
