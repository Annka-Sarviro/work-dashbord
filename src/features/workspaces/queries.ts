'use server';

import { Query } from 'node-appwrite';

import { DATABASE_ID, MEMBER_ID, WORKSPACES_ID } from '@/config';
import { getMember } from '../members/utils';
import { Workspace } from './types';
import { createSessionClient } from '@/lib/appwrite';

export const getWorkspaces = async () => {
    try {
        const { account, databases } = await createSessionClient();

        const user = await account.get();

        const members = await databases.listDocuments(DATABASE_ID, MEMBER_ID, [
            Query.equal('userId', user.$id),
        ]);

        if (members.total === 0) {
            return { document: [], total: 0 };
        }

        const membersIds = members.documents.map(member => member.workspaceId);

        const workspaces = await databases.listDocuments(DATABASE_ID, WORKSPACES_ID, [
            Query.orderDesc('$createdAt'),
            Query.contains('$id', membersIds),
        ]);
        return workspaces;
    } catch (error) {
        return { document: [], total: 0 };
    }
};

export const getWorkspace = async ({ workspaceId }: { workspaceId: string }) => {
    try {
        const { account, databases } = await createSessionClient();
        const user = await account.get();
        const member = await getMember({ databases, workspaceId, userId: user.$id });
        if (!member) {
            return null;
        }

        const workspace = await databases.getDocument<Workspace>(
            DATABASE_ID,
            WORKSPACES_ID,
            workspaceId
        );
        return workspace;
    } catch (error) {
        return null;
    }
};

export const getWorkspaceInfo = async ({ workspaceId }: { workspaceId: string }) => {
    try {
        const { databases } = await createSessionClient();

        const workspace = await databases.getDocument<Workspace>(
            DATABASE_ID,
            WORKSPACES_ID,
            workspaceId
        );
        return { name: workspace.name };
    } catch (error) {
        return null;
    }
};
