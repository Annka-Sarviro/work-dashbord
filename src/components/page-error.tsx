import { AlertTriangle } from 'lucide-react';

interface PageErrorProps {
    message: string;
}

export const PageError = ({ message }: PageErrorProps) => {
    return (
        <div className="flex flex-col items-center justify-center h-full">
            <AlertTriangle className="size-6 mb-2 text-muted-foreground" />
            <p className="text-sm font-medium text-muted-foreground">{message}</p>
        </div>
    );
};
