import {
  useQuery,
  useMutation,
  useQueryClient,
  Query,
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query';
import React from 'react';
import { api } from './lib/axios';

const queryClient = new QueryClient();

export default function App(){
  return<QueryClientProvider client={queryClient}>
    <Tickets />
  </QueryClientProvider>

}


export const Tickets = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['tickets'],
    queryFn: async () => {
      const response = await api.get('/tickets');
      return response.data;
    },
  });

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return <div>
    Tickets Data:
    {JSON.stringify(data)}; 

  </div>

};
