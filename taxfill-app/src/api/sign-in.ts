import { api } from '@/lib/axios';

export interface SignInBody {
  email: string;
  password: string;
}

export async function signIn({ email, password }: SignInBody): Promise<string> {
  const response = await api.post('/sessions', { email, password });
  const { access_token } = response.data;
  return access_token;
}