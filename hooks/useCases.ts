import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api, CaseCreate } from '@/lib/api/client';

export const CASE_KEYS = {
    all: ['cases'] as const,
    lists: () => [...CASE_KEYS.all, 'list'] as const,
    list: (filters: string) => [...CASE_KEYS.lists(), { filters }] as const,
    details: () => [...CASE_KEYS.all, 'detail'] as const,
    detail: (id: string) => [...CASE_KEYS.details(), id] as const,
};

export function useCases(params: {
    page?: number;
    pageSize?: number;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
    view?: string;
    search?: string;
    case_status?: string;
    businessUnit?: string;
    assignedUser?: string;
}) {
    return useQuery({
        queryKey: CASE_KEYS.list(JSON.stringify(params)),
        queryFn: () => api.cases.list(params),
        placeholderData: (previousData) => previousData, // Keep previous data while fetching new
    });
}

export function useCase(id: string) {
    return useQuery({
        queryKey: CASE_KEYS.detail(id),
        queryFn: () => api.cases.get(id),
        enabled: !!id,
    });
}

export function useCreateCase() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data: CaseCreate) => api.cases.create(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: CASE_KEYS.lists() });
        },
    });
}

export function useUpdateCase() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: CaseCreate }) => api.cases.update(id, data),
        onSuccess: (data, variables) => {
            queryClient.invalidateQueries({ queryKey: CASE_KEYS.detail(variables.id) });
            queryClient.invalidateQueries({ queryKey: CASE_KEYS.lists() });
        },
    });
}

export function useDeleteCase() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id: string) => api.cases.delete(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: CASE_KEYS.lists() });
        },
    });
}
