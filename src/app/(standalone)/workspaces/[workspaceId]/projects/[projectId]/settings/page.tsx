import { getCurrent } from '@/features/auth/queries';

import { redirect } from 'next/navigation';
import { ProjectIdSettingsClient } from './client';

interface ProjectIdSettingsPageProps {
    params: {
        projectId: string;
    };
}

const ProjectIdSettingsPage = async ({ params }: ProjectIdSettingsPageProps) => {
    const user = await getCurrent();
    if (!user) redirect('/sign-in');

    return <ProjectIdSettingsClient />;
};

export default ProjectIdSettingsPage;
