import { NavBar } from '@/components/navbar';
import { Sidebar } from '@/components/sidebar';
import { CreateProjectModal } from '@/features/projects/components/create-project-modal';
import { CreateWorkspaceModal } from '@/features/workspaces/components/create-workspace-modal';

interface DashboardLayoutProps {
    children: React.ReactNode;
}

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
    return (
        <div className="min-h-screen">
            <CreateWorkspaceModal />
            <CreateProjectModal />
            <div className="flex h-full w-full">
                <div className="overflow-y-auto h-full fixed left-0 top-0 hidden lg:block lg:w-[264px]">
                    <Sidebar />
                </div>

                <div className="lg:pl-[264px] w-full">
                    <div className="mx-auto max-w-screen-2xl h-full w-full">
                        <NavBar />
                        <main className="h-full py-8 px-6 flex flex-col">{children}</main>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DashboardLayout;
