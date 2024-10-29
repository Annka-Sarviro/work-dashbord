'use client';

import { Loader } from 'lucide-react';

const LoadingPage = () => {
    return (
        <div className="h-screen gap-y-4 flex-col flex items-center justify-center">
            <Loader className="size-6 animate-spin text-muted-foreground" />
        </div>
    );
};

export default LoadingPage;
