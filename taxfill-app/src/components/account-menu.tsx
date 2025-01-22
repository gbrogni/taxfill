import { useMutation } from '@tanstack/react-query';
import { LogOut } from 'lucide-react';
import { signOut } from '@/context/auth';
import { Button } from './ui/button';
import { Dialog, DialogClose, DialogContent, DialogTrigger } from './ui/dialog';
import { useNavigate } from 'react-router-dom';

export function AccountMenu() {
    const navigate = useNavigate();
    const { } = useMutation({
        mutationFn: signOut,
    });

    const handleConfirmLogout = async () => {
        signOut(navigate);
    };

    return (
        <Dialog>
            <DialogTrigger>
                <LogOut className="h-6 w-6" />
            </DialogTrigger>
            <DialogContent>
                <p>Você tem certeza que deseja sair?</p>
                <Button onClick={handleConfirmLogout}>Confirmar</Button>
                <DialogClose>Cancelar</DialogClose>
            </DialogContent>
        </Dialog>
    );
}