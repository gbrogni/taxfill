import { useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { Header } from '@/components/header';
import { isAuthenticated } from '@/context/auth';

export function AppLayout() {
    const navigate = useNavigate();
    const isAuth: string | undefined = isAuthenticated();

    useEffect(() => {
        if (!isAuth) {
            navigate('/auth/sign-in');
        }
    }, [isAuth, navigate]);

    if (!isAuth) {
        return null;
    }

    return (
        <div className="flex min-h-screen flex-col antialiased">
            <Header />
            <div className="flex flex-1 flex-col gap-4 p-8 pt-6">
                <Outlet />
            </div>
        </div>
    );
}