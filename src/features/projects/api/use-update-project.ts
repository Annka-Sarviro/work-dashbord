import { useMutation, useQueryClient } from '@tanstack/react-query';
import { InferRequestType, InferResponseType } from 'hono';

import { toast } from 'sonner';
import { client } from '@/lib/rpc';
import { useRouter } from 'next/navigation';

type ResponseType = InferResponseType<(typeof client.api.projects)[':projectId']['$patch'], 200>;
type RequestType = InferRequestType<(typeof client.api.projects)[':projectId']['$patch']>;

export const useUpdateProject = () => {
    const queryClient = useQueryClient();
    const router = useRouter();
    const mutation = useMutation<ResponseType, Error, RequestType>({
        mutationFn: async ({ form, param }) => {
            const response = await client.api.projects[':projectId'].$patch({ form, param });
            if (!response.ok) {
                throw new Error('Something wrong');
            }
            return await response.json();
        },
        onSuccess: ({ data }) => {
            toast.success('Project updated');
            router.refresh();
            queryClient.invalidateQueries({ queryKey: ['projects'] });
            queryClient.invalidateQueries({ queryKey: ['project', data.$id] });
        },
        onError: () => {
            toast.error('Failed to update project');
        },
    });
    return mutation;
};