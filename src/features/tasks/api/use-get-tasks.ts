import { client } from '@/lib/rpc';
import { useQuery } from '@tanstack/react-query';
import { TaskStatus } from '../type';

interface useGetTasksProps {
    workspaceId: string;
    projectId?: string | null;
    status?: TaskStatus | null;
    assigneeId?: string | null;
    dueDate?: string | null;
    search?: string | null;
}

export const useGetTasks = ({
    workspaceId,
    search,
    projectId,
    status,
    assigneeId,
    dueDate,
}: useGetTasksProps) => {
    const query = useQuery({
        queryKey: ['tasks', workspaceId, search, projectId, status, assigneeId, dueDate],
        queryFn: async () => {
            const response = await client.api.tasks.$get({
                query: {
                    workspaceId,
                    projectId: projectId ?? undefined,
                    search: search ?? undefined,
                    status: status ?? undefined,
                    assigneeId: assigneeId ?? undefined,
                    dueDate: dueDate ?? undefined,
                },
            });

            if (!response.ok) {
                throw new Error('Failed to fetch tasks');
            }

            const { data } = await response.json();
            return data;
        },
    });

    return query;
};
