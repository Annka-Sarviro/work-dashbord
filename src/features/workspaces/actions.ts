'use server';

import { cookies } from 'next/headers';
import { Account, Client, Databases, Query } from 'node-appwrite';
import { AUTH_COOKIE } from '../auth/constants';
import { DATABASE_ID, MEMBER_ID, WORKSPACES_ID } from '@/config';
import { getMember } from '../members/utils';
import { Workspace } from './types';

export const getWorkspaces = async () => {
    try {
        const client = new Client()
            .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!)
            .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT!);

        const session = await cookies().get(AUTH_COOKIE);

        if (!session) return { document: [], total: 0 };
        client.setSession(session.value);
        const databases = new Databases(client);
        const account = new Account(client);
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
        const client = new Client()
            .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!)
            .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT!);

        const session = await cookies().get(AUTH_COOKIE);

        if (!session) return null;
        client.setSession(session.value);
        const databases = new Databases(client);
        const account = new Account(client);
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
