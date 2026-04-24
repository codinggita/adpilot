import { apiSlice } from './apiSlice';

export const analyticsApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getOverview: builder.query({
      query: ({ period = '30', startDate, endDate } = {}) => {
        const params = new URLSearchParams();
        params.append('period', period);
        if (startDate) params.append('startDate', startDate);
        if (endDate) params.append('endDate', endDate);
        return `/analytics/overview?${params.toString()}`;
      },
      providesTags: ['Analytics'],
    }),
    getTrends: builder.query({
      query: ({ period = '30' } = {}) => `/analytics/trends?period=${period}`,
      providesTags: ['Analytics'],
    }),
    getCampaignBreakdown: builder.query({
      query: ({ period = '30' } = {}) => `/analytics/campaigns?period=${period}`,
      providesTags: ['Analytics', 'Campaign'],
    }),
  }),
});

export const {
  useGetOverviewQuery,
  useGetTrendsQuery,
  useGetCampaignBreakdownQuery,
} = analyticsApi;
