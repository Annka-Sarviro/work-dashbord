'use client';

import { useQueryState } from 'nuqs';
import { DottedSeparator } from '@/components/dotted-separator';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Divide, Loader, PlusIcon } from 'lucide-react';
import { useCreateTaskModal } from '../hooks/use-create-task-modal';
import { useGetTasks } from '../api/use-get-tasks';
import { useWorkspaceId } from '@/features/workspaces/hooks/use-workspace-id';
import { DataFilters } from './data-filters';
import { useTaskFilters } from '../hooks/use-task-filters';
import { DataTable } from './data-table';
import { columns } from './columns';
import { DataKanban } from './data-kanban';
import { useCallback } from 'react';
import { TaskStatus } from '../type';
import { useBulkUpdateTasks } from '../api/use-bulk-update-tasks';
import { DataCalendar } from './data-calendar';

export const TaskViewSwitcher = () => {
    const [{ status, assigneeId, projectId, dueDate }] = useTaskFilters();
    const { mutate: bulkUpdate } = useBulkUpdateTasks();
    const [view, setView] = useQueryState('task-view', {
        defaultValue: 'table',
    });

    const workspaceId = useWorkspaceId();
    const { open } = useCreateTaskModal();
    const { data: tasks, isLoading: isLoadingTasks } = useGetTasks({
        workspaceId,
        projectId,
        assigneeId,
        status,
        dueDate,
    });

    const onKanbanChange = useCallback(
        (tasks: { $id: string; status: TaskStatus; position: number }[]) => {
            bulkUpdate({ json: { tasks } });
        },
        [bulkUpdate]
    );
    return (
        <Tabs
            defaultValue={view}
            onValueChange={setView}
            className="flex-1 w-full border rounded-lg"
        >
            <div className="h-full flex flex-col p-4 overflow-auto">
                <div className="flex flex-col gap-y-2 lg:flex-row justify-between items-center">
                    <TabsList className="w-full lg:w-auto">
                        <TabsTrigger value="table" className="h-8 w-full lg:w-auto">
                            Table
                        </TabsTrigger>
                        <TabsTrigger value="kanban" className="h-8 w-full lg:w-auto">
                            Kanban
                        </TabsTrigger>
                        <TabsTrigger value="calendar" className="h-8 w-full lg:w-auto">
                            Calendar
                        </TabsTrigger>
                    </TabsList>
                    <Button size="sm" className="w-full lg:w-auto" onClick={open}>
                        <PlusIcon className="size-4 mr-2" />
                        New
                    </Button>
                </div>
                <DottedSeparator className="my-4" />
                <DataFilters />
                <DottedSeparator className="my-4" />
                {isLoadingTasks ? (
                    <div className="w-full border rounded-lg h-[200px] flex flex-col items-center justify-center">
                        <Loader className="size-5 text-muted-foreground animate-spin" />
                    </div>
                ) : (
                    <>
                        <TabsContent value="table" className="mt-0">
                            <DataTable data={tasks?.documents ?? []} columns={columns} />
                        </TabsContent>
                        <TabsContent value="kanban" className="mt-0">
                            <DataKanban data={tasks?.documents ?? []} onChange={onKanbanChange} />
                        </TabsContent>
                        <TabsContent value="calendar" className="mt-0 pb-4 h-full">
                            <DataCalendar data={tasks?.documents ?? []} />
                        </TabsContent>
                    </>
                )}
            </div>
        </Tabs>
    );
};
