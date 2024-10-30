import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

import { ExternalLinkIcon, PencilIcon, TrashIcon } from 'lucide-react';
import { useDeleteTask } from '../api/use-delete-task';
import { useConfirm } from '@/hooks/use-confirm';
import { useRouter } from 'next/navigation';
import { useWorkspaceId } from '@/features/workspaces/hooks/use-workspace-id';
import { useEditTaskModal } from '../hooks/use-edit-task-modal';

interface TaskActionProps {
    id: string;
    projectId: string;
    children: React.ReactNode;
}

export const TaskAction = ({ id, projectId, children }: TaskActionProps) => {
    const router = useRouter();
    const workspaceId = useWorkspaceId();
    const { mutate, isPending } = useDeleteTask();

    const { open } = useEditTaskModal();
    const [DeleteDialog, confirmDelete] = useConfirm(
        'Delete Task',
        'This action cannot be undone',
        'destructive'
    );

    const onDelete = async () => {
        const ok = await confirmDelete();
        if (!ok) return;

        mutate({ param: { taskId: id } });
    };

    const onOpenTask = async () => {
        router.push(`/workspaces/${workspaceId}/tasks/${id}`);
    };
    const onOpenProject = async () => {
        router.push(`/workspaces/${workspaceId}/projects/${projectId}`);
    };
    return (
        <div className="flex justify-end">
            <DeleteDialog />
            <DropdownMenu modal={false}>
                <DropdownMenuTrigger asChild>{children}</DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                    <DropdownMenuItem onClick={onOpenTask} className="font-medium p-[10px]">
                        <ExternalLinkIcon className="size-4 mr-2 stroke-2" />
                        Task Details
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={onOpenProject} className="font-medium p-[10px]">
                        <ExternalLinkIcon className="size-4 mr-2 stroke-2" />
                        Open Project
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => open(id)} className="font-medium p-[10px]">
                        <PencilIcon className="size-4 mr-2 stroke-2" />
                        Edit Task
                    </DropdownMenuItem>

                    <DropdownMenuItem
                        onClick={onDelete}
                        disabled={isPending}
                        className="font-medium p-[10px] text-amber-700 focus:text-amber-700"
                    >
                        <TrashIcon className="size-4 mr-2 stroke-2" />
                        Delete task
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    );
};
