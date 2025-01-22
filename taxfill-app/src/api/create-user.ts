import { api } from '@/lib/axios';

export interface CreateUserBody {
  name: string;
  email: string;
  password: string;
}

export async function createUser({
  name,
  email,
  password,
}: CreateUserBody) {
  await api.post('/accounts', {
    name,
    email,
    password,
  });
}