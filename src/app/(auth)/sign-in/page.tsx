import { getCurrent } from '@/features/auth/actions';
import { SignInCard } from '@/features/auth/components/SignInCard';
import { redirect } from 'next/navigation';

const SignPage = async () => {
    const user = await getCurrent();

    if (user) redirect('/');
    return <SignInCard />;
};

export default SignPage;
