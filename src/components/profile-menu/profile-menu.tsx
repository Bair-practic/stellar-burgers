import { ProfileMenuUI } from '@ui';
import { FC } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAppDispatch } from '../../services/store';
import { fetchLogout } from '../../slices/userSlice';
import { deleteCookie, getCookie } from '../../utils/cookie';

export const ProfileMenu: FC = () => {
  const { pathname } = useLocation();
  const navigator = useNavigate();
  const dispatch = useAppDispatch();

  const handleLogout = () => {
    const accessToken = getCookie('accessToken');
    const refreshToken = localStorage.getItem('refreshToken');

    localStorage.removeItem('refreshToken');
    deleteCookie('accessToken');

    dispatch(
      fetchLogout({
        accessToken: accessToken || undefined,
        refreshToken: refreshToken || undefined
      })
    )
      .unwrap()
      .finally(() => {
        navigator('/');
      });
  };

  return <ProfileMenuUI handleLogout={handleLogout} pathname={pathname} />;
};
