'use client';

import { useEffect, useState, useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { PencilIcon, TrashIcon, PlusIcon, Loader2Icon } from 'lucide-react';

// UI Components
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';

// Server Actions
import {
    createUserAction,
    updateUserAction,
    deleteUserAction,
    getUsersAction,
} from './actions';
import { getCurrentUser } from '../../action';

// User type definition
type User = {
    id: number;
    nama: string;
    email: string;
    username: string;
    password: string;
    photo: string;
    tanggal_lahir: string;
    NoTelpon: string;
    role: string;
    alamat: string;
    isVerified: number;
    createdAt: string;
    updatedAt: string;
    deleted: number;
};

// Validation Schemas
const createUserSchema = z.object({
    nama: z.string().min(2, 'Name must be at least 2 characters'),
    email: z.string().email('Invalid email address'),
    username: z.string().min(3, 'Username must be at least 3 characters'),
    password: z.string().min(8, 'Password must be at least 8 characters'),
    NoTelpon: z.string().min(1, 'Phone number is required'),
    tanggal_lahir: z.string().min(1, 'Date of birth is required'),
    alamat: z.string().min(1, 'Address is required'),
    role: z.enum(['user', 'admin']),
});

const updateUserSchema = z.object({
    id: z.string(),
    nama: z.string().min(2, 'Name must be at least 2 characters'),
    email: z.string().email('Invalid email address'),
    username: z.string().min(3, 'Username must be at least 3 characters'),
    password: z.string().optional(),
    NoTelpon: z.string().min(1, 'Phone number is required'),
    tanggal_lahir: z.string().min(1, 'Date of birth is required'),
    alamat: z.string().min(1, 'Address is required'),
    role: z.enum(['user', 'admin']),
});

type CreateUserFormData = z.infer<typeof createUserSchema>;
type UpdateUserFormData = z.infer<typeof updateUserSchema>;

export default function UsersPage() {
    // State Management
    const [users, setUsers] = useState<User[]>([]);
    const [currentUser, setCurrentUser] = useState<{ id: number; nama: string; email: string; username: string; photo: string; role: string; } | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [isSubmitting, startTransition] = useTransition();

    // Form Setup
    const createForm = useForm<CreateUserFormData>({
        resolver: zodResolver(createUserSchema),
        defaultValues: {
            nama: '',
            email: '',
            username: '',
            password: '',
            NoTelpon: '',
            tanggal_lahir: '',
            alamat: '',
            role: 'user',
        },
    });

    const updateForm = useForm<UpdateUserFormData>({
        resolver: zodResolver(updateUserSchema),
        defaultValues: {
            id: '',
            nama: '',
            email: '',
            username: '',
            password: '',
            NoTelpon: '',
            tanggal_lahir: '',
            alamat: '',
            role: 'user',
        },
    });

    // Data Fetching
    const fetchUsers = async () => {
        try {
            const formData = new FormData();
            const [usersResult, currentUserData] = await Promise.all([
                getUsersAction(formData),
                getCurrentUser(),
            ]);
            
            if (usersResult.success && usersResult.data) {
                setUsers(usersResult.data);
            } else {
                toast.error(usersResult.error || 'Failed to load users');
            }
            
            setCurrentUser(currentUserData);
        } catch (error) {
            console.error('Error fetching users:', error);
            toast.error('Failed to load users');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    // Helper Functions
    const getInitials = (name: string) => {
        return name
            .split(' ')
            .map((n) => n[0])
            .join('')
            .toUpperCase()
            .slice(0, 2);
    };

    const formatDate = (dateString: string) => {
        try {
            const date = new Date(dateString);
            return date.toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
            });
        } catch {
            return dateString;
        }
    };

    // Dialog Handlers
    const handleAddUser = () => {
        setSelectedUser(null);
        createForm.reset();
        setIsDialogOpen(true);
    };

    const handleEditUser = (user: User) => {
        setSelectedUser(user);
        updateForm.reset({
            id: user.id.toString(),
            nama: user.nama,
            email: user.email,
            username: user.username,
            password: '',
            NoTelpon: user.NoTelpon,
            tanggal_lahir: user.tanggal_lahir,
            alamat: user.alamat,
            role: user.role as 'user' | 'admin',
        });
        setIsDialogOpen(true);
    };

    const handleDeleteUser = (user: User) => {
        setSelectedUser(user);
        setIsDeleteDialogOpen(true);
    };

    const closeDialog = () => {
        setIsDialogOpen(false);
        setSelectedUser(null);
        createForm.reset();
        updateForm.reset();
    };

    // Form Submission Handlers
    const onCreateSubmit = async (data: CreateUserFormData) => {
        startTransition(async () => {
            const formData = new FormData();
            Object.entries(data).forEach(([key, value]) => {
                formData.append(key, value);
            });

            const result = await createUserAction({}, formData);

            if ('success' in result && result.success) {
                toast.success(result.message || 'User created successfully');
                closeDialog();
                await fetchUsers();
            } else if ('error' in result) {
                toast.error(result.error || 'Failed to create user');
            }
        });
    };

    const onUpdateSubmit = async (data: UpdateUserFormData) => {
        startTransition(async () => {
            const formData = new FormData();
            Object.entries(data).forEach(([key, value]) => {
                if (key === 'password' && !value) {
                    return; // Skip empty password
                }
                formData.append(key, value);
            });

            const result = await updateUserAction({}, formData);

            if ('success' in result && result.success) {
                toast.success(result.message || 'User updated successfully');
                closeDialog();
                await fetchUsers();
            } else if ('error' in result) {
                toast.error(result.error || 'Failed to update user');
            }
        });
    };

    const onDeleteConfirm = async () => {
        if (!selectedUser) return;

        startTransition(async () => {
            const formData = new FormData();
            formData.append('id', selectedUser.id.toString());

            const result = await deleteUserAction(formData);

            if (result.success) {
                toast.success(result.message || 'User deleted successfully');
                setIsDeleteDialogOpen(false);
                setSelectedUser(null);
                await fetchUsers();
            } else {
                toast.error(result.error || 'Failed to delete user');
            }
        });
    };

    // Loading State
    if (isLoading) {
        return (
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <Skeleton className="h-8 w-48" />
                    <Skeleton className="h-9 w-32" />
                </div>
                <div className="rounded-md border">
                    <div className="p-4 space-y-3">
                        {[...Array(5)].map((_, i) => (
                            <Skeleton key={i} className="h-12 w-full" />
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {/* Page Header */}
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold">User Management</h1>
                <Button onClick={handleAddUser} aria-label="Add new user">
                    <PlusIcon />
                    Add User
                </Button>
            </div>

            {/* Users Table */}
            <div className="rounded-md border">
                {users.length === 0 ? (
                    <div className="p-8 text-center text-muted-foreground">
                        No users found. Click "Add User" to create one.
                    </div>
                ) : (
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>User</TableHead>
                                <TableHead>Email</TableHead>
                                <TableHead>Username</TableHead>
                                <TableHead>Role</TableHead>
                                <TableHead>Phone</TableHead>
                                <TableHead>Created</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {users.map((user) => (
                                <TableRow key={user.id}>
                                    <TableCell>
                                        <div className="flex items-center gap-3">
                                            <Avatar>
                                                <AvatarImage src={user.photo} alt={user.nama} />
                                                <AvatarFallback>
                                                    {getInitials(user.nama)}
                                                </AvatarFallback>
                                            </Avatar>
                                            <span className="font-medium">{user.nama}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell>{user.email}</TableCell>
                                    <TableCell>{user.username}</TableCell>
                                    <TableCell>
                                        <Badge
                                            variant={
                                                user.role === 'admin' ? 'default' : 'secondary'
                                            }
                                        >
                                            {user.role}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>{user.NoTelpon}</TableCell>
                                    <TableCell>{formatDate(user.createdAt)}</TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex justify-end gap-2">
                                            <Button
                                                variant="ghost"
                                                size="icon-sm"
                                                onClick={() => handleEditUser(user)}
                                                aria-label={`Edit ${user.nama}`}
                                            >
                                                <PencilIcon />
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="icon-sm"
                                                onClick={() => handleDeleteUser(user)}
                                                aria-label={`Delete ${user.nama}`}
                                            >
                                                <TrashIcon />
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                )}
            </div>

            {/* User Form Dialog */}
            <Dialog open={isDialogOpen} onOpenChange={closeDialog}>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>
                            {selectedUser ? 'Edit User' : 'Add New User'}
                        </DialogTitle>
                        <DialogDescription>
                            {selectedUser
                                ? 'Update user information below.'
                                : 'Fill in the details to create a new user.'}
                        </DialogDescription>
                    </DialogHeader>

                    <form
                        onSubmit={
                            selectedUser
                                ? updateForm.handleSubmit(onUpdateSubmit)
                                : createForm.handleSubmit(onCreateSubmit)
                        }
                        className="space-y-4"
                    >
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* Name */}
                            <div className="space-y-2">
                                <Label htmlFor="nama">
                                    Name <span className="text-destructive">*</span>
                                </Label>
                                <Input
                                    id="nama"
                                    {...(selectedUser
                                        ? updateForm.register('nama')
                                        : createForm.register('nama'))}
                                    aria-invalid={
                                        selectedUser
                                            ? !!updateForm.formState.errors.nama
                                            : !!createForm.formState.errors.nama
                                    }
                                />
                                {(selectedUser
                                    ? updateForm.formState.errors.nama
                                    : createForm.formState.errors.nama) && (
                                    <p className="text-sm text-destructive">
                                        {selectedUser
                                            ? updateForm.formState.errors.nama?.message
                                            : createForm.formState.errors.nama?.message}
                                    </p>
                                )}
                            </div>

                            {/* Email */}
                            <div className="space-y-2">
                                <Label htmlFor="email">
                                    Email <span className="text-destructive">*</span>
                                </Label>
                                <Input
                                    id="email"
                                    type="email"
                                    {...(selectedUser
                                        ? updateForm.register('email')
                                        : createForm.register('email'))}
                                    aria-invalid={
                                        selectedUser
                                            ? !!updateForm.formState.errors.email
                                            : !!createForm.formState.errors.email
                                    }
                                />
                                {(selectedUser
                                    ? updateForm.formState.errors.email
                                    : createForm.formState.errors.email) && (
                                    <p className="text-sm text-destructive">
                                        {selectedUser
                                            ? updateForm.formState.errors.email?.message
                                            : createForm.formState.errors.email?.message}
                                    </p>
                                )}
                            </div>

                            {/* Username */}
                            <div className="space-y-2">
                                <Label htmlFor="username">
                                    Username <span className="text-destructive">*</span>
                                </Label>
                                <Input
                                    id="username"
                                    {...(selectedUser
                                        ? updateForm.register('username')
                                        : createForm.register('username'))}
                                    aria-invalid={
                                        selectedUser
                                            ? !!updateForm.formState.errors.username
                                            : !!createForm.formState.errors.username
                                    }
                                />
                                {(selectedUser
                                    ? updateForm.formState.errors.username
                                    : createForm.formState.errors.username) && (
                                    <p className="text-sm text-destructive">
                                        {selectedUser
                                            ? updateForm.formState.errors.username?.message
                                            : createForm.formState.errors.username?.message}
                                    </p>
                                )}
                            </div>

                            {/* Password */}
                            <div className="space-y-2">
                                <Label htmlFor="password">
                                    Password{' '}
                                    {selectedUser ? (
                                        <span className="text-muted-foreground text-xs">
                                            (leave blank to keep current)
                                        </span>
                                    ) : (
                                        <span className="text-destructive">*</span>
                                    )}
                                </Label>
                                <Input
                                    id="password"
                                    type="password"
                                    {...(selectedUser
                                        ? updateForm.register('password')
                                        : createForm.register('password'))}
                                    aria-invalid={
                                        selectedUser
                                            ? !!updateForm.formState.errors.password
                                            : !!createForm.formState.errors.password
                                    }
                                />
                                {(selectedUser
                                    ? updateForm.formState.errors.password
                                    : createForm.formState.errors.password) && (
                                    <p className="text-sm text-destructive">
                                        {selectedUser
                                            ? updateForm.formState.errors.password?.message
                                            : createForm.formState.errors.password?.message}
                                    </p>
                                )}
                            </div>

                            {/* Phone */}
                            <div className="space-y-2">
                                <Label htmlFor="NoTelpon">
                                    Phone Number <span className="text-destructive">*</span>
                                </Label>
                                <Input
                                    id="NoTelpon"
                                    {...(selectedUser
                                        ? updateForm.register('NoTelpon')
                                        : createForm.register('NoTelpon'))}
                                    aria-invalid={
                                        selectedUser
                                            ? !!updateForm.formState.errors.NoTelpon
                                            : !!createForm.formState.errors.NoTelpon
                                    }
                                />
                                {(selectedUser
                                    ? updateForm.formState.errors.NoTelpon
                                    : createForm.formState.errors.NoTelpon) && (
                                    <p className="text-sm text-destructive">
                                        {selectedUser
                                            ? updateForm.formState.errors.NoTelpon?.message
                                            : createForm.formState.errors.NoTelpon?.message}
                                    </p>
                                )}
                            </div>

                            {/* Date of Birth */}
                            <div className="space-y-2">
                                <Label htmlFor="tanggal_lahir">
                                    Date of Birth <span className="text-destructive">*</span>
                                </Label>
                                <Input
                                    id="tanggal_lahir"
                                    type="date"
                                    {...(selectedUser
                                        ? updateForm.register('tanggal_lahir')
                                        : createForm.register('tanggal_lahir'))}
                                    aria-invalid={
                                        selectedUser
                                            ? !!updateForm.formState.errors.tanggal_lahir
                                            : !!createForm.formState.errors.tanggal_lahir
                                    }
                                />
                                {(selectedUser
                                    ? updateForm.formState.errors.tanggal_lahir
                                    : createForm.formState.errors.tanggal_lahir) && (
                                    <p className="text-sm text-destructive">
                                        {selectedUser
                                            ? updateForm.formState.errors.tanggal_lahir?.message
                                            : createForm.formState.errors.tanggal_lahir?.message}
                                    </p>
                                )}
                            </div>

                            {/* Role */}
                            <div className="space-y-2">
                                <Label htmlFor="role">
                                    Role <span className="text-destructive">*</span>
                                </Label>
                                <Select
                                    value={
                                        selectedUser
                                            ? updateForm.watch('role')
                                            : createForm.watch('role')
                                    }
                                    onValueChange={(value) => {
                                        if (selectedUser) {
                                            updateForm.setValue('role', value as 'user' | 'admin');
                                        } else {
                                            createForm.setValue('role', value as 'user' | 'admin');
                                        }
                                    }}
                                >
                                    <SelectTrigger id="role" className="w-full">
                                        <SelectValue placeholder="Select role" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="user">User</SelectItem>
                                        <SelectItem value="admin">Admin</SelectItem>
                                    </SelectContent>
                                </Select>
                                {(selectedUser
                                    ? updateForm.formState.errors.role
                                    : createForm.formState.errors.role) && (
                                    <p className="text-sm text-destructive">
                                        {selectedUser
                                            ? updateForm.formState.errors.role?.message
                                            : createForm.formState.errors.role?.message}
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* Address */}
                        <div className="space-y-2">
                            <Label htmlFor="alamat">
                                Address <span className="text-destructive">*</span>
                            </Label>
                            <textarea
                                id="alamat"
                                rows={3}
                                className="flex min-h-[80px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-base shadow-xs transition-[color,box-shadow] outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                                {...(selectedUser
                                    ? updateForm.register('alamat')
                                    : createForm.register('alamat'))}
                                aria-invalid={
                                    selectedUser
                                        ? !!updateForm.formState.errors.alamat
                                        : !!createForm.formState.errors.alamat
                                }
                            />
                            {(selectedUser
                                ? updateForm.formState.errors.alamat
                                : createForm.formState.errors.alamat) && (
                                <p className="text-sm text-destructive">
                                    {selectedUser
                                        ? updateForm.formState.errors.alamat?.message
                                        : createForm.formState.errors.alamat?.message}
                                </p>
                            )}
                        </div>

                        <DialogFooter>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={closeDialog}
                                disabled={isSubmitting}
                            >
                                Cancel
                            </Button>
                            <Button type="submit" disabled={isSubmitting}>
                                {isSubmitting && <Loader2Icon className="animate-spin" />}
                                {selectedUser ? 'Update User' : 'Create User'}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Delete Confirmation Dialog */}
            <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This will delete the user{' '}
                            <span className="font-semibold">{selectedUser?.nama}</span>. This
                            action cannot be undone.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel disabled={isSubmitting}>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={onDeleteConfirm}
                            disabled={isSubmitting}
                            className="bg-destructive text-white hover:bg-destructive/90"
                        >
                            {isSubmitting && <Loader2Icon className="animate-spin" />}
                            Delete
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}
