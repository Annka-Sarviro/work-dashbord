import { getCurrent } from '@/features/auth/actions';
import { UserButton } from '@/features/auth/components/UserButton';
import { CreateWorkspaceForm } from '@/features/workspaces/components/create-workspace-form';
import { redirect } from 'next/navigation';

export default async function Home() {
    const user = await getCurrent();

    if (!user) redirect('/sign-in');

    return (
        <div className="border rounded-md border-neutral-500">
            <CreateWorkspaceForm />
        </div>
    );
}