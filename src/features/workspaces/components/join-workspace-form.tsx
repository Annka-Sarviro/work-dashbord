'use client';

import { DottedSeparator } from '@/components/dotted-separator';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import { useJoinWorkspace } from '../api/use-join-workspace';
import { useInviteCode } from '../hooks/use-invite-code';
import { useWorkspaceId } from '../hooks/use-workspace-id';
import { useRouter } from 'next/navigation';

interface JoinWorkspaceFormProps {
    initialValues: {
        name: string;
    };
}
export const JoinWorkspaceForm = ({ initialValues }: JoinWorkspaceFormProps) => {
    const inviteCode = useInviteCode();
    const workspaceId = useWorkspaceId();
    const { mutate, isPending } = useJoinWorkspace();
    const router = useRouter();
    const onSubmit = () => {
        mutate(
            {
                param: { workspaceId },
                json: {
                    code: inviteCode,
                },
            },
            {
                onSuccess: ({ data }) => {
                    router.push(`/workspaces/${data.$id}`);
                },
            }
        );
    };
    return (
        <Card className="w-full h-full border-none shadow-none">
            <CardHeader className="p-7">
                <CardTitle className="text-xl font-bold">Join workspace</CardTitle>
                <CardDescription>
                    You&apos;ve been invite to join <strong>{initialValues.name}</strong> workspace
                </CardDescription>
            </CardHeader>
            <div className="px-7">
                <DottedSeparator />{' '}
            </div>

            <CardContent className="px-7">
                <div className="flex flex-col gap-2 ld:flex-row items-center justify-between">
                    <Button
                        disabled={isPending}
                        asChild
                        size="lg"
                        variant="secondary"
                        type="button"
                        className="w-full lg:w-fit"
                    >
                        <Link href="/"> Cancel</Link>
                    </Button>
                    <Button
                        disabled={isPending}
                        size="lg"
                        type="button"
                        className="w-full lg:w-fit"
                        onClick={onSubmit}
                    >
                        Join Workspace
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
};
