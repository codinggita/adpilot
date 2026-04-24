import { apiSlice } from './apiSlice';

export const reportsApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getReports: builder.query({
      query: ({ type, page = 1, limit = 10 } = {}) => {
        const params = new URLSearchParams();
        if (type) params.append('type', type);
        params.append('page', page);
        params.append('limit', limit);
        return `/reports?${params.toString()}`;
      },
      providesTags: ['Report'],
    }),
    getReportById: builder.query({
      query: (reportId) => `/reports/${reportId}`,
      providesTags: (result, error, id) => [{ type: 'Report', id }],
    }),
    generateReport: builder.mutation({
      query: () => ({ url: '/reports/generate', method: 'POST' }),
      invalidatesTags: ['Report'],
    }),
  }),
});

export const {
  useGetReportsQuery,
  useGetReportByIdQuery,
  useGenerateReportMutation,
} = reportsApi;
