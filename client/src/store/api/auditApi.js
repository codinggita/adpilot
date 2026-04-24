import { apiSlice } from './apiSlice';

export const auditApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    runAudit: builder.mutation({
      query: () => ({ url: '/audit/run', method: 'POST' }),
      invalidatesTags: ['Audit', 'Notification'],
    }),
    getAuditById: builder.query({
      query: (auditId) => `/audit/${auditId}`,
      providesTags: (result, error, id) => [{ type: 'Audit', id }],
    }),
    getAuditHistory: builder.query({
      query: ({ page = 1, limit = 10 } = {}) => `/audit/history?page=${page}&limit=${limit}`,
      providesTags: ['Audit'],
    }),
    applyRecommendation: builder.mutation({
      query: ({ auditId, recId }) => ({ url: `/audit/${auditId}/recommendations/${recId}/apply`, method: 'POST' }),
      invalidatesTags: ['Audit', 'Notification', 'Campaign'],
    }),
    dismissRecommendation: builder.mutation({
      query: ({ auditId, recId }) => ({ url: `/audit/${auditId}/recommendations/${recId}/dismiss`, method: 'POST' }),
      invalidatesTags: ['Audit'],
    }),
    applyAllRecommendations: builder.mutation({
      query: ({ auditId, priority }) => ({ url: `/audit/${auditId}/apply-all?priority=${priority || 'all'}`, method: 'POST' }),
      invalidatesTags: ['Audit', 'Notification', 'Campaign'],
    }),
  }),
});

export const {
  useRunAuditMutation,
  useGetAuditByIdQuery,
  useGetAuditHistoryQuery,
  useApplyRecommendationMutation,
  useDismissRecommendationMutation,
  useApplyAllRecommendationsMutation,
} = auditApi;
