import { Declaration } from '@/interfaces/declaration';
import { DeclarationStatus } from '@/interfaces/enums/declaration-status';
import { api } from '@/lib/axios';

export interface FetchDeclarationsQuery {
  year?: number;
  status?: DeclarationStatus;
}

export async function fetchDeclarations(query: FetchDeclarationsQuery, token: string): Promise<Declaration[]> {
  return await api.get<Declaration[]>('/declarations', {
    params: {
      year: query.year,
      status: query.status
    },
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }).then((response) => response.data);
}