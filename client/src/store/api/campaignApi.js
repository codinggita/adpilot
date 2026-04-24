import { apiSlice } from './apiSlice';

export const campaignApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getCampaigns: builder.query({
      query: ({ status, type, page = 1, limit = 20, sortBy, sortOrder } = {}) => {
        const params = new URLSearchParams();
        if (status && status !== 'all') params.append('status', status);
        if (type) params.append('type', type);
        if (page) params.append('page', page);
        if (limit) params.append('limit', limit);
        if (sortBy) params.append('sortBy', sortBy);
        if (sortOrder) params.append('sortOrder', sortOrder);
        return `/campaigns?${params.toString()}`;
      },
      providesTags: ['Campaign'],
    }),
    getCampaignById: builder.query({
      query: (id) => `/campaigns/${id}`,
      providesTags: (result, error, id) => [{ type: 'Campaign', id }],
    }),
    getCampaignMetrics: builder.query({
      query: ({ id, startDate, endDate }) => {
        const params = new URLSearchParams();
        if (startDate) params.append('startDate', startDate);
        if (endDate) params.append('endDate', endDate);
        return `/campaigns/${id}/metrics?${params.toString()}`;
      },
    }),
    pauseCampaign: builder.mutation({
      query: (id) => ({ url: `/campaigns/${id}/pause`, method: 'PATCH' }),
      invalidatesTags: ['Campaign', 'Analytics'],
    }),
    enableCampaign: builder.mutation({
      query: (id) => ({ url: `/campaigns/${id}/enable`, method: 'PATCH' }),
      invalidatesTags: ['Campaign', 'Analytics'],
    }),
    updateBudget: builder.mutation({
      query: ({ id, dailyBudget }) => ({ url: `/campaigns/${id}/budget`, method: 'PATCH', body: { dailyBudget } }),
      invalidatesTags: ['Campaign', 'Analytics'],
    }),
  }),
});

export const {
  useGetCampaignsQuery,
  useGetCampaignByIdQuery,
  useGetCampaignMetricsQuery,
  usePauseCampaignMutation,
  useEnableCampaignMutation,
  useUpdateBudgetMutation,
} = campaignApi;
