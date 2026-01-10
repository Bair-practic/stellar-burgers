import { BurgerConstructorUI } from '@ui';
import { TIngredient } from '@utils-types';
import { FC, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../services/store';
import {
  clearConstructor,
  selectConstructorItems
} from '../../slices/constructorSlice';
import {
  closeOrderRequest,
  fetchNewOrder,
  selectOrderModalData,
  selectOrderRequest
} from '../../slices/orderSlice';
import { selectIsAuthenticated } from '../../slices/userSlice';

export const BurgerConstructor: FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const orderRequest = useAppSelector(selectOrderRequest);
  const constructorItems = useAppSelector(selectConstructorItems);
  const orderModalData = useAppSelector(selectOrderModalData);

  const onOrderClick = () => {
    if (!isAuthenticated) {
      return navigate('/login', { replace: true });
    }

    if (constructorItems?.bun?._id && constructorItems.ingredients.length) {
      const ingredientsIds = constructorItems.ingredients.map(
        (item) => item._id
      );
      dispatch(
        fetchNewOrder([
          constructorItems.bun._id,
          ...ingredientsIds,
          constructorItems.bun._id
        ])
      );
    }
  };
  const closeOrderModal = () => {
    dispatch(closeOrderRequest());
    dispatch(clearConstructor());
  };

  const price = useMemo(
    () =>
      (constructorItems?.bun ? constructorItems.bun.price! * 2 : 0) +
      (constructorItems?.ingredients || []).reduce(
        (s: number, v: TIngredient) => s + v.price,
        0
      ),
    [constructorItems]
  );

  if (!constructorItems) {
    return null;
  }

  return (
    <BurgerConstructorUI
      price={price}
      orderRequest={orderRequest}
      constructorItems={constructorItems}
      orderModalData={orderModalData}
      onOrderClick={onOrderClick}
      closeOrderModal={closeOrderModal}
    />
  );
};
