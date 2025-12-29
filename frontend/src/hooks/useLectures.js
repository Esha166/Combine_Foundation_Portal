import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import lectureService from '../services/lectureService';

export const useLectures = (params) => {
    return useQuery({
        queryKey: ['lectures', params],
        queryFn: () => lectureService.getLectures(params),
        keepPreviousData: true,
    });
};

export const useLecture = (id) => {
    return useQuery({
        queryKey: ['lecture', id],
        queryFn: () => lectureService.getLectureById(id),
        enabled: !!id,
    });
};

export const usePublicLectures = (params) => {
    return useQuery({
        queryKey: ['public-lectures', params],
        queryFn: () => lectureService.getPublicLectures(params),
    });
};

export const useCreateLecture = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data) => lectureService.createLecture(data),
        onSuccess: () => {
            queryClient.invalidateQueries(['lectures']);
            queryClient.invalidateQueries(['public-lectures']);
        },
    });
};

export const useUpdateLecture = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, data }) => lectureService.updateLecture(id, data),
        onSuccess: (data, variables) => {
            queryClient.invalidateQueries(['lectures']);
            queryClient.invalidateQueries(['public-lectures']);
            queryClient.invalidateQueries(['lecture', variables.id]);
        },
    });
};

export const useDeleteLecture = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id) => lectureService.deleteLecture(id),
        onSuccess: () => {
            queryClient.invalidateQueries(['lectures']);
            queryClient.invalidateQueries(['public-lectures']);
        },
    });
};

export const useToggleLectureStatus = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id) => lectureService.toggleLectureStatus(id),
        onSuccess: (data, variables) => {
            queryClient.invalidateQueries(['lectures']);
            queryClient.invalidateQueries(['public-lectures']);
            queryClient.invalidateQueries(['lecture', variables]); // variables is the id
        },
    });
};
