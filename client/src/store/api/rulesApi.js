import { apiSlice } from './apiSlice';

export const rulesApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getRules: builder.query({
      query: ({ isActive } = {}) => {
        const params = new URLSearchParams();
        if (isActive !== undefined) params.append('isActive', isActive);
        return `/rules?${params.toString()}`;
      },
      providesTags: ['Rule'],
    }),
    getRuleById: builder.query({
      query: (ruleId) => `/rules/${ruleId}`,
      providesTags: (result, error, id) => [{ type: 'Rule', id }],
    }),
    createRule: builder.mutation({
      query: (data) => ({ url: '/rules', method: 'POST', body: data }),
      invalidatesTags: ['Rule'],
    }),
    updateRule: builder.mutation({
      query: ({ ruleId, ...data }) => ({ url: `/rules/${ruleId}`, method: 'PUT', body: data }),
      invalidatesTags: ['Rule'],
    }),
    toggleRule: builder.mutation({
      query: ({ ruleId, isActive }) => ({ url: `/rules/${ruleId}/toggle`, method: 'PATCH', body: { isActive } }),
      invalidatesTags: ['Rule'],
    }),
    deleteRule: builder.mutation({
      query: (ruleId) => ({ url: `/rules/${ruleId}`, method: 'DELETE' }),
      invalidatesTags: ['Rule'],
    }),
    runRuleNow: builder.mutation({
      query: (ruleId) => ({ url: `/rules/${ruleId}/run-now`, method: 'POST' }),
      invalidatesTags: ['Rule', 'Notification'],
    }),
    getRuleLogs: builder.query({
      query: ({ ruleId, page = 1, limit = 10 }) => `/rules/${ruleId}/logs?page=${page}&limit=${limit}`,
    }),
    getRuleTemplates: builder.query({
      query: () => '/rules/templates',
    }),
  }),
});

export const {
  useGetRulesQuery,
  useGetRuleByIdQuery,
  useCreateRuleMutation,
  useUpdateRuleMutation,
  useToggleRuleMutation,
  useDeleteRuleMutation,
  useRunRuleNowMutation,
  useGetRuleLogsQuery,
  useGetRuleTemplatesQuery,
} = rulesApi;
