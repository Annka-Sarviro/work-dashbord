'use client';

import { Button } from '@/components/ui/button';
import { AlertTriangle } from 'lucide-react';
import Link from 'next/link';

const ErrorPage = () => {
    return (
        <div className="h-screen gap-y-4 flex-col flex items-center justify-center">
            <AlertTriangle className="size-6" />
            <p className="text-sm "> Something went wrong</p>

            <Button variant="secondary" asChild size="sm">
                <Link href={'/'}>BAck to home</Link>
            </Button>
        </div>
    );
};

export default ErrorPage;
