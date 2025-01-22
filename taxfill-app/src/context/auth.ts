import Cookies from 'js-cookie';
import { NavigateFunction } from 'react-router-dom';
import { signIn as authenticate } from '@/api/sign-in';

export function isAuthenticated() {
  return Cookies.get('access_token');
}

export const signIn = async (email: string, password: string) => {
  try {
    const token = await authenticate({ email, password });
    Cookies.set('access_token', token, {
      path: '/',
      expires: 7
    });
  } catch (error) {
    throw new Error(`Failed to authenticate: ${error}`);
  }
};

export const signOut = async (navigate: NavigateFunction) => {
  try {
    Cookies.remove('access_token');
    navigate('/auth/sign-in');
  } catch (error) {
    throw new Error(`Failed to sign out: ${error}`);
  }
};