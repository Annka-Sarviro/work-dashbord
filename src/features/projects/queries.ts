'use server';

import { Query } from 'node-appwrite';

import { DATABASE_ID, MEMBER_ID, PROJECTS_ID, WORKSPACES_ID } from '@/config';
import { getMember } from '../members/utils';
import { Project } from './types';
import { createSessionClient } from '@/lib/appwrite';

// export const getWorkspaces = async () => {
//     try {
//         const { account, databases } = await createSessionClient();

//         const user = await account.get();

//         const members = await databases.listDocuments(DATABASE_ID, MEMBER_ID, [
//             Query.equal('userId', user.$id),
//         ]);

//         if (members.total === 0) {
//             return { document: [], total: 0 };
//         }

//         const membersIds = members.documents.map(member => member.workspaceId);

//         const workspaces = await databases.listDocuments(DATABASE_ID, WORKSPACES_ID, [
//             Query.orderDesc('$createdAt'),
//             Query.contains('$id', membersIds),
//         ]);
//         return workspaces;
//     } catch (error) {
//         return { document: [], total: 0 };
//     }
// };

export const getProject = async ({ projectId }: { projectId: string }) => {
    try {
        const { account, databases } = await createSessionClient();
        const user = await account.get();

        const project = await databases.getDocument<Project>(DATABASE_ID, PROJECTS_ID, projectId);

        const member = await getMember({
            databases,
            workspaceId: project.workspaceId,
            userId: user.$id,
        });

        if (!member) {
            return null;
        }

        return project;
    } catch (error) {
        return null;
    }
};

// export const getWorkspaceInfo = async ({ workspaceId }: { workspaceId: string }) => {
//     try {
//         const { databases } = await createSessionClient();

//         const workspace = await databases.getDocument<Project>(
//             DATABASE_ID,
//             WORKSPACES_ID,
//             workspaceId
//         );
//         return { name: workspace.name };
//     } catch (error) {
//         return null;
//     }
// };
