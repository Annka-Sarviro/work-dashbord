import { FcGoogle } from 'react-icons/fc';
import { FaGithub } from 'react-icons/fa';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';

import { DottedSeparator } from '@/components/dotted-separator';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import Link from 'next/link';

const formSchema = z.object({
    name: z.string().trim().min(1, 'Required'),
    email: z.string().email(),
    password: z.string().min(8, 'Minimum of 8 required'),
});

export const SignUpCard = () => {
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: '',
            email: '',
            password: '',
        },
    });

    const onSubmit = (values: z.infer<typeof formSchema>) => {
        console.log({ values });
    };
    return (
        <Card className="w-full h-full md:w-[487 px] border-none shadow-none">
            <CardHeader className="flex items-center justify-center text-center p-7">
                <CardTitle className="text-2xl">Sign Up!</CardTitle>
                <CardDescription>
                    By signing up, ypu agree to our{' '}
                    <Link href="/privacy">
                        <span className="text-blue-700 transition-colors hover:text-blue-800">
                            Privacy Policy
                        </span>
                    </Link>{' '}
                    and{' '}
                    <Link href="/terms">
                        <span className="text-blue-700 transition-colors hover:text-blue-800">
                            Terms of Service
                        </span>
                    </Link>
                </CardDescription>
            </CardHeader>
            <div className="px-7">
                <DottedSeparator />
            </div>
            <CardContent className="p-7">
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                            name="name"
                            control={form.control}
                            render={({ field }) => (
                                <FormItem>
                                    <FormControl>
                                        <Input {...field} placeholder="Enter your name" />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            name="email"
                            control={form.control}
                            render={({ field }) => (
                                <FormItem>
                                    <FormControl>
                                        <Input {...field} placeholder="Enter email address" />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            name="password"
                            control={form.control}
                            render={({ field }) => (
                                <FormItem>
                                    <FormControl>
                                        <Input
                                            {...field}
                                            placeholder="Enter password"
                                            type="password"
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button disabled={false} size="lg" className="w-full">
                            SignUp
                        </Button>
                    </form>
                </Form>
            </CardContent>

            <div className="px-7">
                <DottedSeparator />
            </div>
            <CardContent className="p-7 flex flex-col gap-y-4">
                <Button variant="secondary" size="lg" disabled={false} className="w-full">
                    <FcGoogle className="mr-2 size-5" />
                    SignUp with Google
                </Button>
                <Button variant="secondary" size="lg" disabled={false} className="w-full">
                    <FaGithub className="mr-2 size-5" />
                    SignUp with GitHub
                </Button>
            </CardContent>

            <div className="px-7">
                <DottedSeparator />
            </div>

            <CardContent className="p-7 flex items-center justify-center">
                <p>
                    Already have an account?
                    <Link href="/sign-in">
                        {' '}
                        <span className="text-blue-700 hover:text-blue-800 transition-colors">
                            Sign In
                        </span>
                    </Link>
                </p>
            </CardContent>
        </Card>
    );
};
