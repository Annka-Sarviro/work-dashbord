import { z } from 'zod';
import { TaskStatus } from './type';

export const createTaskSchema = z.object({
    name: z.string().trim().min(1, 'Required'),
    status: z.nativeEnum(TaskStatus, { required_error: 'Required' }),
    workspaceId: z.string().trim().min(1, 'Required'),
    projectId: z.string().trim().min(1, 'Required'),
    assigneeId: z.string().trim().min(1, 'Required'),
    description: z.string().optional(),
    dueDate: z.coerce.date(),
});

export const updateTaskSchema = z.object({
    name: z.string().trim().min(1, 'Required'),
    status: z.nativeEnum(TaskStatus, { required_error: 'Required' }),
    workspaceId: z.string().trim().min(1, 'Required'),
    projectId: z.string().trim().min(1, 'Required'),
    assigneeId: z.string().trim().min(1, 'Required'),
    description: z.string().optional(),
    dueDate: z.coerce.date(),
});
