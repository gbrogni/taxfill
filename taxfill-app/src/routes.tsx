import { createBrowserRouter } from 'react-router-dom';
import { AppLayout } from './pages/_layouts/app';
import { AuthLayout } from './pages/_layouts/auth';
import { SignIn } from './pages/auth/sign-in';
import { SignUp } from './pages/auth/sign-up';
import { NotFound } from './pages/404';
import { ErrorPage } from './pages/error';
import { Home } from './pages/app/home';
import { Declaration } from './pages/app/declarations/declaration';
import { DeclarationsList } from './pages/app/declarations/declaration-list';

export const router = createBrowserRouter([
    {
        path: '/',
        element: <AppLayout />,
        errorElement: <ErrorPage />,
        children: [
            {
                path: '/',
                element: (<Home />),
            },
            {
                path: 'declarations',
                element: <DeclarationsList />,
            }
        ],
    },
    {
        path: 'auth',
        element: <AuthLayout />,
        children: [
            {
                path: 'sign-in',
                element: <SignIn />,
            },
            {
                path: 'sign-up',
                element: <SignUp />,
            },
        ],
    },
    {
        path: '*',
        element: <NotFound />,
    },
]);