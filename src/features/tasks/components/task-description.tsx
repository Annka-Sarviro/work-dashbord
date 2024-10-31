import { Button } from '@/components/ui/button';
import { Task } from '../type';
import { PencilIcon, XIcon } from 'lucide-react';
import { DottedSeparator } from '@/components/dotted-separator';
import { OverviewProperty } from './overview-property';
import { MemberAvatar } from '@/features/members/components/member-avatar';
import { TaskDate } from './task-date';
import { Badge } from '@/components/ui/badge';
import { snakeCaseToTitleCase } from '@/lib/utils';
import { useEditTaskModal } from '../hooks/use-edit-task-modal';
import { useUpdateTask } from '../api/use-update-task';
import { useState } from 'react';
import { Textarea } from '@/components/ui/textarea';

interface TaskDescriptionProps {
    task: Task;
}

export const TaskDescription = ({ task }: TaskDescriptionProps) => {
    const { mutate, isPending } = useUpdateTask();
    const [isEditing, setIsEditing] = useState(false);
    const [value, setValue] = useState(task.description);

    const handleSave = () => {
        mutate({
            json: { description: value },
            param: {
                taskId: task.$id,
            },
        });
    };

    return (
        <div className="p-4 border rounded-lg">
            <div className="flex items-center justify-between">
                <p className="text-lg font-semibold">Description</p>
                <Button onClick={() => setIsEditing(prev => !prev)} size="sm" variant="secondary">
                    {isEditing ? (
                        <XIcon className="size-4 mr-2" />
                    ) : (
                        <PencilIcon className="size-4 mr-2" />
                    )}
                    {isEditing ? 'Cancel' : 'Edit'}
                </Button>
            </div>
            <DottedSeparator className="my-4" />
            {isEditing ? (
                <div className="flex flex-col gap-y-4">
                    <Textarea
                        placeholder="Add a description"
                        value={value}
                        rows={4}
                        onChange={e => setValue(e.target.value)}
                        disabled={isPending}
                    />
                    <Button
                        onClick={handleSave}
                        disabled={isPending}
                        size="sm"
                        className="w-git ml-auto"
                    >
                        {isPending ? 'Saving' : 'Save changes'}
                    </Button>
                </div>
            ) : (
                <div>
                    {task.description || (
                        <span className="text-muted-foreground"> No description set</span>
                    )}
                </div>
            )}
        </div>
    );
};
