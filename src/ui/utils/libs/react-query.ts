import type { AxiosError } from 'axios';
import type { DefaultOptions, UseMutationOptions, UseQueryOptions } from 'react-query';
import { QueryClient } from 'react-query';

export { queryClient };

export type { ExtractFnReturnType, QueryConfig, MutationConfig };

const queryConfig: DefaultOptions = {
  queries: {
    useErrorBoundary: true,
    refetchOnWindowFocus: false,
    retry: false
  }
};

const queryClient = new QueryClient({ defaultOptions: queryConfig });

type ExtractFnReturnType<FnType extends (...args: any) => any> = Awaited<
  ReturnType<FnType>
>;

type QueryConfig<QueryFnType extends (...args: any) => any> = Omit<
  UseQueryOptions<ExtractFnReturnType<QueryFnType>>,
  'queryKey' | 'queryFn'
>;

type MutationConfig<MutationFnType extends (...args: any) => any> = UseMutationOptions<
  ExtractFnReturnType<MutationFnType>,
  AxiosError,
  Parameters<MutationFnType>[0]
>;
