import { Helmet } from 'react-helmet-async';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { z } from 'zod';
import { useMutation } from '@tanstack/react-query';

import { createUser } from '@/api/create-user';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { PasswordInput } from '@/components/password-input';

const signUpForm = z.object({
    name: z.string(),
    email: z.string().email(),
    password: z.string(),
    confirmPassword: z.string(),
});

type SignUpForm = z.infer<typeof signUpForm>;

export function SignUp() {
    const navigate = useNavigate();

    const {
        register,
        handleSubmit,
        formState: { isSubmitting },
        watch
    } = useForm<SignUpForm>();

    const password: string = watch('password');
    const confirmPassword: string = watch('confirmPassword');

    const { mutateAsync: registerUserFn } = useMutation({
        mutationFn: createUser,
    });

    async function handleSignUp(data: SignUpForm) {
        if (data.password !== data.confirmPassword) {
            toast.error('As senhas não correspondem.');
            return;
        }

        try {
            await registerUserFn({
                name: data.name,
                email: data.email,
                password: data.password,
            });

            toast.success('Usuário cadastrado com sucesso!', {
                action: {
                    label: 'Login',
                    onClick: () => navigate(`/auth/sign-in?email=${data.email}&password=${data.password}`),
                },
            });
        } catch (error) {
            toast.error('Erro ao cadastrar usuário.');
        }
    }

    return (
        <>
            <Helmet title="Cadastro" />
            <div className="p-8">
                <Button variant="ghost" asChild className="absolute right-8 top-8">
                    <Link to="/auth/sign-in">Fazer login</Link>
                </Button>

                <div className="flex w-[350px] flex-col justify-center gap-6">
                    <div className="flex flex-col gap-2 text-center">
                        <h1 className="text-2xl font-semibold tracking-tight">
                            Criar conta grátis
                        </h1>
                        <p className="text-sm text-muted-foreground">
                            Simule sua declaração de imposto de renda!
                        </p>
                    </div>

                    <form className="space-y-4" onSubmit={handleSubmit(handleSignUp)}>
                        <div className="space-y-2">
                            <Label htmlFor="name">Nome</Label>
                            <Input
                                id="name"
                                type="text"
                                {...register('name')}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="email">E-mail</Label>
                            <Input id="email" type="email" {...register('email')} />
                        </div>

                        <div>
                            <Label htmlFor="password">Senha</Label>
                            <PasswordInput
                                id="password"
                                value={password}
                                {...register('password')}
                                autoComplete="new-password"
                            />
                        </div>

                        <div>
                            <Label htmlFor="confirmPassword">Confirmar Senha</Label>
                            <PasswordInput
                                id="confirmPassword"
                                value={confirmPassword}
                                {...register('confirmPassword')}
                                autoComplete="new-password"
                            />
                        </div>

                        <Button disabled={isSubmitting} className="w-full" type="submit">
                            Finalizar cadastro
                        </Button>

                        <p className="px-6 text-center text-sm leading-relaxed text-muted-foreground">
                            Ao continuar, você concorda com nossos{' '}
                            <a href="/terms-of-service" className="underline underline-offset-4">
                                termos de serviço
                            </a>{' '}
                            e{' '}
                            <a href="/privacy-policy" className="underline underline-offset-4">
                                políticas de privacidade
                            </a>
                        </p>
                    </form>
                </div>
            </div>
        </>
    );
}