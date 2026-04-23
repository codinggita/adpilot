import { apiSlice } from './apiSlice';

export const usersApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    updateProfile: builder.mutation({
      query: (data) => ({ url: '/users/me', method: 'PUT', body: data }),
      invalidatesTags: ['User'],
    }),
    changePassword: builder.mutation({
      query: (data) => ({ url: '/users/me/change-password', method: 'POST', body: data }),
    }),
    seedDemoData: builder.mutation({
      query: () => ({ url: '/seed-demo', method: 'POST' }),
    }),
    getAccountStatus: builder.query({
      query: () => '/account-status',
    }),
  }),
});

export const {
  useUpdateProfileMutation,
  useChangePasswordMutation,
  useSeedDemoDataMutation,
  useGetAccountStatusQuery,
} = usersApi;
