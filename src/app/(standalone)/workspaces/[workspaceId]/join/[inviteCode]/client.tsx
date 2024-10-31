'use client';

import { PageError } from '@/components/page-error';
import { PageLoader } from '@/components/page-loader';
import { JoinWorkspaceForm } from '@/features/workspaces/components/join-workspace-form';
import { useWorkspaceId } from '@/features/workspaces/hooks/use-workspace-id';

export const WorkspaceIdJoinClient = () => {
    const workspaceId = useWorkspaceId();
    const { data: initialValues, isLoading } = useGetProject({ projectId });

    if (isLoading) {
        return <PageLoader />;
    }

    if (!initialValues) {
        return <PageError message="Project not found" />;
    }
    return (
        <div className="w-full lg:max-w-xl">
            <JoinWorkspaceForm initialValues={initialValues} />
        </div>
    );
};
