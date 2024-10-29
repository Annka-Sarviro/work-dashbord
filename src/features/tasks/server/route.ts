import { zValidator } from '@hono/zod-validator';
import { Hono } from 'hono';
import { createTaskSchema, updateTaskSchema } from '../schemas';
import { sessionMiddleware } from '@/lib/session-middlewaare';
import {
    DATABASE_ID,
    IMAGES_BUCKET_ID,
    MEMBER_ID,
    PROJECTS_ID,
    TASKS_ID,
    WORKSPACES_ID,
} from '@/config';
import { ID, Query } from 'node-appwrite';
import { MemberRole } from '@/features/members/types';
import { generateInviteCode } from '@/lib/utils';
import { getMember } from '@/features/members/utils';
import { z } from 'zod';
import { Task, TaskStatus } from '../type';
import { createAdminClient } from '@/lib/appwrite';
import { Project } from '@/features/projects/types';
// import { Workspace } from '../types';

const app = new Hono()
    .get(
        '/',
        sessionMiddleware,
        zValidator(
            'query',
            z.object({
                workspaceId: z.string(),
                projectId: z.string().nullish(),
                assigneeId: z.string().nullish(),
                status: z.nativeEnum(TaskStatus).nullish(),
                search: z.string().nullish(),
                dueDate: z.string().nullish(),
            })
        ),
        async c => {
            const { users } = await createAdminClient();
            const user = c.get('user');
            const databases = c.get('databases');

            const { workspaceId, projectId, search, status, assigneeId, dueDate } =
                c.req.valid('query');

            const member = await getMember({
                databases,
                workspaceId,
                userId: user.$id,
            });

            if (!member) {
                return c.json({ error: 'Unauthorized' }, 401);
            }

            const query = [Query.equal('workspaceId', workspaceId), Query.orderDesc('$createdAt')];

            if (projectId) {
                console.log('projectId', projectId);
                query.push(Query.equal('projectId', projectId));
            }

            if (status) {
                console.log('status', status);
                query.push(Query.equal('status', status));
            }

            if (assigneeId) {
                console.log('assigneeId', assigneeId);
                query.push(Query.equal('assigneeId', assigneeId));
            }

            if (dueDate) {
                console.log('dueDate', dueDate);
                query.push(Query.equal('dueDate', dueDate));
            }

            if (search) {
                console.log('search', search);
                query.push(Query.equal('name', search));
            }

            const tasks = await databases.listDocuments<Task>(DATABASE_ID, TASKS_ID, query);
            const projectIds = tasks.documents.map(task => task.projectId);
            const assigneeIds = tasks.documents.map(task => task.assigneeId);

            const projects = await databases.listDocuments<Project>(
                DATABASE_ID,
                PROJECTS_ID,
                projectIds.length > 0 ? [Query.contains('$id', projectIds)] : []
            );

            const members = await databases.listDocuments(
                DATABASE_ID,
                MEMBER_ID,
                assigneeIds.length > 0 ? [Query.contains('$id', assigneeIds)] : []
            );

            const assignees = await Promise.all(
                members.documents.map(async member => {
                    const user = await users.get(member.userId);

                    return {
                        ...member,
                        name: user.name,
                        email: user.email,
                    };
                })
            );

            const populatedTasks = tasks.documents.map(task => {
                const project = projects.documents.find(project => project.$id === task.projectId);
                const assignee = assignees.find(assignee => assignee.$id === task.assigneeId);

                return { ...task, project, assignee };
            });
            return c.json({ data: { ...tasks, documents: populatedTasks } });
        }
    )
    .post('/', sessionMiddleware, zValidator('json', createTaskSchema), async c => {
        const databases = c.get('databases');
        const user = c.get('user');

        const { name, status, workspaceId, projectId, assigneeId, dueDate } = c.req.valid('json');

        const member = await getMember({
            databases,
            workspaceId,
            userId: user.$id,
        });

        if (!member) {
            return c.json({ error: 'Unauthorized' }, 401);
        }

        const highestPositionTask = await databases.listDocuments(DATABASE_ID, TASKS_ID, [
            Query.equal('status', status),
            Query.equal('workspaceId', workspaceId),
            Query.orderAsc('position'),
            Query.limit(1),
        ]);

        const newPosition =
            highestPositionTask.documents.length > 0
                ? highestPositionTask.documents[0].position + 1000
                : 1000;

        const task = await databases.createDocument(DATABASE_ID, TASKS_ID, ID.unique(), {
            name,
            status,
            workspaceId,
            projectId,
            dueDate,
            assigneeId,
            position: newPosition,
        });

        return c.json({ data: task });
    });
// .patch(
//     '/:workspaceId',
//     sessionMiddleware,
//     zValidator('form', updateWorkspaceSchema),
//     async c => {
//         const databases = c.get('databases');
//         const storage = c.get('storage');
//         const user = c.get('user');

//         const { workspaceId } = c.req.param();
//         const { name, image } = c.req.valid('form');

//         const member = await getMember({ databases, workspaceId, userId: user.$id });

//         if (!member || member.role !== MemberRole.ADMIN) {
//             return c.json({ error: 'Unauthorized' }, 401);
//         }

//         let uploadedImageUrl: string | undefined;

//         if (image instanceof File) {
//             const file = await storage.createFile(IMAGES_BUCKET_ID, ID.unique(), image);

//             const arrayBuffer = await storage.getFilePreview(IMAGES_BUCKET_ID, file.$id);

//             uploadedImageUrl = `data:image/png;base64,${Buffer.from(arrayBuffer).toString(
//                 'base64'
//             )}`;
//         } else {
//             uploadedImageUrl = image;
//         }
//         const workspace = await databases.updateDocument(
//             DATABASE_ID,
//             WORKSPACES_ID,
//             workspaceId,
//             {
//                 name,
//                 imageUrl: uploadedImageUrl,
//             }
//         );

//         return c.json({ data: workspace });
//     }
// )
// .delete('/:workspaceId', sessionMiddleware, async c => {
//     const databases = c.get('databases');

//     const user = c.get('user');
//     const { workspaceId } = c.req.param();
//     const member = await getMember({ databases, workspaceId, userId: user.$id });

//     if (!member || member.role !== MemberRole.ADMIN) {
//         return c.json({ error: 'Unauthorized' }, 401);
//     }

//     await databases.deleteDocument(DATABASE_ID, WORKSPACES_ID, workspaceId);

//     return c.json({ data: { $id: workspaceId } });
// })
// .post('/:workspaceId/reset-invite-code', sessionMiddleware, async c => {
//     const databases = c.get('databases');

//     const user = c.get('user');
//     const { workspaceId } = c.req.param();
//     const member = await getMember({ databases, workspaceId, userId: user.$id });

//     if (!member || member.role !== MemberRole.ADMIN) {
//         return c.json({ error: 'Unauthorized' }, 401);
//     }

//     const workspace = await databases.updateDocument(DATABASE_ID, WORKSPACES_ID, workspaceId, {
//         inviteCode: generateInviteCode(10),
//     });

//     return c.json({ data: workspace });
// })
// .post(
//     '/:workspaceId/join',
//     sessionMiddleware,
//     zValidator('json', z.object({ code: z.string() })),
//     async c => {
//         const { workspaceId } = c.req.param();
//         const { code } = c.req.valid('json');

//         const databases = c.get('databases');
//         const user = c.get('user');

//         const member = await getMember({ databases, workspaceId, userId: user.$id });

//         if (member) {
//             return c.json({ error: 'Already a member' }, 400);
//         }

//         const workspace = await databases.getDocument<Workspace>(
//             DATABASE_ID,
//             WORKSPACES_ID,
//             workspaceId
//         );

//         if (workspace.inviteCode !== code) {
//             return c.json({ error: 'Invalide invite code' }, 400);
//         }

//         await databases.createDocument(DATABASE_ID, MEMBER_ID, ID.unique(), {
//             workspaceId,
//             userId: user.$id,
//             role: MemberRole.MEMBER,
//         });
//         return c.json({ data: workspace });
//     }
// );
export default app;
