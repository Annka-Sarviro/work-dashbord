import { DottedSeparator } from '@/components/dotted-separator';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PlusIcon } from 'lucide-react';

export const TaskViewSwitcher = () => {
    return (
        <Tabs className="flex-1 w-full border rounded-lg">
            <div className="h-full flex flex-col p-4 overflow-auto">
                <div className="flex flex-col gap-y-2 lg:flex-row justify-between items-center">
                    <TabsList className="w-full lg:w-auto">
                        <TabsTrigger value="table" className="h-8 w-full lg:w-auto">
                            Table
                        </TabsTrigger>
                        <TabsTrigger value="kanban" className="h-8 w-full lg:w-auto">
                            Kanban
                        </TabsTrigger>
                        <TabsTrigger value="calendar" className="h-8 w-full lg:w-auto">
                            Calendar
                        </TabsTrigger>
                    </TabsList>
                    <Button size="sm" className="w-full lg:w-auto">
                        <PlusIcon className="size-4 mr-2" />
                        New
                    </Button>
                </div>
                <DottedSeparator className="my-4" />
                <div>filter</div>
                <DottedSeparator className="my-4" />
                <>
                    <TabsContent value="table" className="mt-0">
                        Data table
                    </TabsContent>
                    <TabsContent value="kanban" className="mt-0">
                        Data kanban
                    </TabsContent>
                    <TabsContent value="calendar" className="mt-0">
                        Data calendar
                    </TabsContent>
                </>
            </div>
        </Tabs>
    );
};
