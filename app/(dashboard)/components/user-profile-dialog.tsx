'use client'

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { LogOut, Settings } from 'lucide-react';
import { logout } from '../action';

interface UserProfileDialogProps {
    user: {
        nama: string;
        email: string;
        photo?: string;
        role: string;
    };
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function UserProfileDialog({ user, open, onOpenChange }: UserProfileDialogProps) {
    const router = useRouter();
    const [isLoggingOut, setIsLoggingOut] = useState(false);

    const handleLogout = async () => {
        setIsLoggingOut(true);
        try {
            const result = await logout();
            if (result.success) {
                router.push('/');
                router.refresh();
            }
        } catch (error) {
            console.error('Logout failed:', error);
        } finally {
            setIsLoggingOut(false);
        }
    };

    const getInitials = (name: string) => {
        return name
            .split(' ')
            .map(n => n[0])
            .join('')
            .toUpperCase()
            .slice(0, 2);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Account</DialogTitle>
                    <DialogDescription>
                        Manage your account settings and preferences
                    </DialogDescription>
                </DialogHeader>

                <div className="flex flex-col items-center gap-4 py-4">
                    <Avatar className="h-20 w-20">
                        <AvatarImage src={user.photo} alt={user.nama} />
                        <AvatarFallback className="text-lg">
                            {getInitials(user.nama)}
                        </AvatarFallback>
                    </Avatar>

                    <div className="text-center">
                        <h3 className="text-lg font-semibold">{user.nama}</h3>
                        <p className="text-sm text-muted-foreground">{user.email}</p>
                        <p className="text-xs text-muted-foreground mt-1 capitalize">
                            {user.role}
                        </p>
                    </div>
                </div>

                <Separator />

                <div className="flex flex-col gap-2">
                    <Button
                        variant="outline"
                        className="w-full justify-start"
                        onClick={() => {
                            onOpenChange(false);
                            router.push('/dashboard/pengaturan');
                        }}
                    >
                        <Settings className="mr-2 h-4 w-4" />
                        Account Settings
                    </Button>

                    <Button
                        variant="outline"
                        className="w-full justify-start text-destructive hover:text-destructive"
                        onClick={handleLogout}
                        disabled={isLoggingOut}
                    >
                        <LogOut className="mr-2 h-4 w-4" />
                        {isLoggingOut ? 'Logging out...' : 'Logout'}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
