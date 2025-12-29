import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import taskService from '../services/taskService';

export const useTasks = (params) => {
    return useQuery({
        queryKey: ['tasks', params],
        queryFn: () => taskService.getAllTasks(params),
        keepPreviousData: true,
    });
};

export const useUserTasks = (userId) => {
    return useQuery({
        queryKey: ['user-tasks', userId],
        queryFn: () => taskService.getUserTasks(userId),
        enabled: !!userId,
    });
};

export const useTask = (id) => {
    return useQuery({
        queryKey: ['task', id],
        queryFn: () => taskService.getTaskById(id),
        enabled: !!id,
    });
};

export const useCreateTask = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data) => taskService.createTask(data),
        onSuccess: () => {
            queryClient.invalidateQueries(['tasks']);
            queryClient.invalidateQueries(['user-tasks']);
        },
    });
};

export const useUpdateTask = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, data }) => taskService.updateTask(id, data),
        onSuccess: (data, variables) => {
            queryClient.invalidateQueries(['tasks']);
            queryClient.invalidateQueries(['user-tasks']);
            queryClient.invalidateQueries(['task', variables.id]);
        },
    });
};

export const useDeleteTask = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id) => taskService.deleteTask(id),
        onSuccess: () => {
            queryClient.invalidateQueries(['tasks']);
            queryClient.invalidateQueries(['user-tasks']);
        },
    });
};

export const useSubmitTask = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, data }) => taskService.submitTask(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries(['tasks']);
            queryClient.invalidateQueries(['user-tasks']);
        },
    });
};

export const useApproveTask = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id) => taskService.approveTask(id),
        onSuccess: () => {
            queryClient.invalidateQueries(['tasks']);
            queryClient.invalidateQueries(['user-tasks']);
        },
    });
};

export const useRejectTask = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, data }) => taskService.rejectTask(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries(['tasks']);
            queryClient.invalidateQueries(['user-tasks']);
        },
    });
};
