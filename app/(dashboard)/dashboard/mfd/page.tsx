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
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';

// Server Actions
import {
    createMFDAction,
    updateMFDAction,
    deleteMFDAction,
    getMFDsAction,
} from './actions';

// MFD type definition
type MFD = {
    id: number;
    namaProvinsi: string;
    kodeProvinsi: string;
    namaKabupaten: string;
    kodeKabupaten: string;
    namaKecamatan: string;
    kodeKecamatan: string;
    namaDesa: string;
    kodeDesa: string;
    namaDusun: string;
    kodeDusun: string;
    namaSLS: string;
    kodeSLS: string;
    namaSubSLS: string;
    kodeSubSLS: string;
};

// Validation Schemas
const createMFDSchema = z.object({
    namaProvinsi: z.string().min(2, 'Province name must be at least 2 characters'),
    kodeProvinsi: z.string().min(1, 'Province code is required'),
    namaKabupaten: z.string().min(2, 'District name must be at least 2 characters'),
    kodeKabupaten: z.string().min(1, 'District code is required'),
    namaKecamatan: z.string().min(2, 'Sub-district name must be at least 2 characters'),
    kodeKecamatan: z.string().min(1, 'Sub-district code is required'),
    namaDesa: z.string().min(2, 'Village name must be at least 2 characters'),
    kodeDesa: z.string().min(1, 'Village code is required'),
    namaDusun: z.string().min(2, 'Hamlet name must be at least 2 characters'),
    kodeDusun: z.string().min(1, 'Hamlet code is required'),
    namaSLS: z.string().min(2, 'SLS name must be at least 2 characters'),
    kodeSLS: z.string().min(1, 'SLS code is required'),
    namaSubSLS: z.string().min(2, 'Sub-SLS name must be at least 2 characters'),
    kodeSubSLS: z.string().min(1, 'Sub-SLS code is required'),
});

const updateMFDSchema = z.object({
    id: z.string(),
    namaProvinsi: z.string().min(2, 'Province name must be at least 2 characters'),
    kodeProvinsi: z.string().min(1, 'Province code is required'),
    namaKabupaten: z.string().min(2, 'District name must be at least 2 characters'),
    kodeKabupaten: z.string().min(1, 'District code is required'),
    namaKecamatan: z.string().min(2, 'Sub-district name must be at least 2 characters'),
    kodeKecamatan: z.string().min(1, 'Sub-district code is required'),
    namaDesa: z.string().min(2, 'Village name must be at least 2 characters'),
    kodeDesa: z.string().min(1, 'Village code is required'),
    namaDusun: z.string().min(2, 'Hamlet name must be at least 2 characters'),
    kodeDusun: z.string().min(1, 'Hamlet code is required'),
    namaSLS: z.string().min(2, 'SLS name must be at least 2 characters'),
    kodeSLS: z.string().min(1, 'SLS code is required'),
    namaSubSLS: z.string().min(2, 'Sub-SLS name must be at least 2 characters'),
    kodeSubSLS: z.string().min(1, 'Sub-SLS code is required'),
});

type CreateMFDFormData = z.infer<typeof createMFDSchema>;
type UpdateMFDFormData = z.infer<typeof updateMFDSchema>;

export default function MFDPage() {
    // State Management
    const [mfds, setMfds] = useState<MFD[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [selectedMFD, setSelectedMFD] = useState<MFD | null>(null);
    const [isSubmitting, startTransition] = useTransition();

    // Form Setup
    const createForm = useForm<CreateMFDFormData>({
        resolver: zodResolver(createMFDSchema),
        defaultValues: {
            namaProvinsi: '',
            kodeProvinsi: '',
            namaKabupaten: '',
            kodeKabupaten: '',
            namaKecamatan: '',
            kodeKecamatan: '',
            namaDesa: '',
            kodeDesa: '',
            namaDusun: '',
            kodeDusun: '',
            namaSLS: '',
            kodeSLS: '',
            namaSubSLS: '',
            kodeSubSLS: '',
        },
    });

    const updateForm = useForm<UpdateMFDFormData>({
        resolver: zodResolver(updateMFDSchema),
        defaultValues: {
            id: '',
            namaProvinsi: '',
            kodeProvinsi: '',
            namaKabupaten: '',
            kodeKabupaten: '',
            namaKecamatan: '',
            kodeKecamatan: '',
            namaDesa: '',
            kodeDesa: '',
            namaDusun: '',
            kodeDusun: '',
            namaSLS: '',
            kodeSLS: '',
            namaSubSLS: '',
            kodeSubSLS: '',
        },
    });

    // Data Fetching
    const fetchMFDs = async () => {
        try {
            const formData = new FormData();
            const result = await getMFDsAction(formData);
            
            if (result.success && result.data) {
                setMfds(result.data as MFD[]);
            } else {
                toast.error(result.error || 'Failed to load MFD records');
            }
        } catch (error) {
            console.error('Error fetching MFDs:', error);
            toast.error('Failed to load MFD records');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchMFDs();
    }, []);

    // Dialog Handlers
    const handleAddMFD = () => {
        setSelectedMFD(null);
        createForm.reset();
        setIsDialogOpen(true);
    };

    const handleEditMFD = (mfd: MFD) => {
        setSelectedMFD(mfd);
        updateForm.reset({
            id: mfd.id.toString(),
            namaProvinsi: mfd.namaProvinsi,
            kodeProvinsi: mfd.kodeProvinsi,
            namaKabupaten: mfd.namaKabupaten,
            kodeKabupaten: mfd.kodeKabupaten,
            namaKecamatan: mfd.namaKecamatan,
            kodeKecamatan: mfd.kodeKecamatan,
            namaDesa: mfd.namaDesa,
            kodeDesa: mfd.kodeDesa,
            namaDusun: mfd.namaDusun,
            kodeDusun: mfd.kodeDusun,
            namaSLS: mfd.namaSLS,
            kodeSLS: mfd.kodeSLS,
            namaSubSLS: mfd.namaSubSLS,
            kodeSubSLS: mfd.kodeSubSLS,
        });
        setIsDialogOpen(true);
    };

    const handleDeleteMFD = (mfd: MFD) => {
        setSelectedMFD(mfd);
        setIsDeleteDialogOpen(true);
    };

    const closeDialog = () => {
        setIsDialogOpen(false);
        setSelectedMFD(null);
        createForm.reset();
        updateForm.reset();
    };

    // Form Submission Handlers
    const onCreateSubmit = async (data: CreateMFDFormData) => {
        startTransition(async () => {
            const formData = new FormData();
            Object.entries(data).forEach(([key, value]) => {
                formData.append(key, value);
            });

            const result = await createMFDAction({}, formData);

            if ('success' in result && result.success) {
                toast.success(result.message || 'MFD record created successfully');
                closeDialog();
                await fetchMFDs();
            } else if ('error' in result) {
                toast.error(result.error || 'Failed to create MFD record');
            }
        });
    };

    const onUpdateSubmit = async (data: UpdateMFDFormData) => {
        startTransition(async () => {
            const formData = new FormData();
            Object.entries(data).forEach(([key, value]) => {
                formData.append(key, value);
            });

            const result = await updateMFDAction({}, formData);

            if ('success' in result && result.success) {
                toast.success(result.message || 'MFD record updated successfully');
                closeDialog();
                await fetchMFDs();
            } else if ('error' in result) {
                toast.error(result.error || 'Failed to update MFD record');
            }
        });
    };

    const onDeleteConfirm = async () => {
        if (!selectedMFD) return;

        startTransition(async () => {
            const formData = new FormData();
            formData.append('id', selectedMFD.id.toString());

            const result = await deleteMFDAction(formData);

            if (result.success) {
                toast.success(result.message || 'MFD record deleted successfully');
                setIsDeleteDialogOpen(false);
                setSelectedMFD(null);
                await fetchMFDs();
            } else {
                toast.error(result.error || 'Failed to delete MFD record');
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
                <h1 className="text-2xl font-bold">MFD Management</h1>
                <Button onClick={handleAddMFD} aria-label="Add new MFD record">
                    <PlusIcon />
                    Add MFD
                </Button>
            </div>

            {/* MFD Table */}
            <div className="rounded-md border">
                {mfds.length === 0 ? (
                    <div className="p-8 text-center text-muted-foreground">
                        No MFD records found. Click "Add MFD" to create one.
                    </div>
                ) : (
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="hidden lg:table-cell">Province</TableHead>
                                <TableHead className="hidden lg:table-cell">District</TableHead>
                                <TableHead className="hidden md:table-cell">Sub-District</TableHead>
                                <TableHead>Village</TableHead>
                                <TableHead>Hamlet</TableHead>
                                <TableHead>SLS</TableHead>
                                <TableHead>Sub-SLS</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {mfds.map((mfd) => (
                                <TableRow key={mfd.id}>
                                    <TableCell className="hidden lg:table-cell">
                                        <div>
                                            <div className="font-medium">{mfd.namaProvinsi}</div>
                                            <Badge variant="outline" className="mt-1">
                                                {mfd.kodeProvinsi}
                                            </Badge>
                                        </div>
                                    </TableCell>
                                    <TableCell className="hidden lg:table-cell">
                                        <div>
                                            <div className="font-medium">{mfd.namaKabupaten}</div>
                                            <Badge variant="outline" className="mt-1">
                                                {mfd.kodeKabupaten}
                                            </Badge>
                                        </div>
                                    </TableCell>
                                    <TableCell className="hidden md:table-cell">
                                        <div>
                                            <div className="font-medium">{mfd.namaKecamatan}</div>
                                            <Badge variant="outline" className="mt-1">
                                                {mfd.kodeKecamatan}
                                            </Badge>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div>
                                            <div className="font-medium">{mfd.namaDesa}</div>
                                            <Badge variant="outline" className="mt-1">
                                                {mfd.kodeDesa}
                                            </Badge>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div>
                                            <div className="font-medium">{mfd.namaDusun}</div>
                                            <Badge variant="outline" className="mt-1">
                                                {mfd.kodeDusun}
                                            </Badge>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div>
                                            <div className="font-medium">{mfd.namaSLS}</div>
                                            <Badge variant="outline" className="mt-1">
                                                {mfd.kodeSLS}
                                            </Badge>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div>
                                            <div className="font-medium">{mfd.namaSubSLS}</div>
                                            <Badge variant="outline" className="mt-1">
                                                {mfd.kodeSubSLS}
                                            </Badge>
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex justify-end gap-2">
                                            <Button
                                                variant="ghost"
                                                size="icon-sm"
                                                onClick={() => handleEditMFD(mfd)}
                                                aria-label={`Edit ${mfd.namaDesa}`}
                                            >
                                                <PencilIcon />
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="icon-sm"
                                                onClick={() => handleDeleteMFD(mfd)}
                                                aria-label={`Delete ${mfd.namaDesa}`}
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

            {/* MFD Form Dialog */}
            <Dialog open={isDialogOpen} onOpenChange={closeDialog}>
                <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>
                            {selectedMFD ? 'Edit MFD Record' : 'Add New MFD Record'}
                        </DialogTitle>
                        <DialogDescription>
                            {selectedMFD
                                ? 'Update MFD information below.'
                                : 'Fill in the details to create a new MFD record.'}
                        </DialogDescription>
                    </DialogHeader>

                    <form
                        onSubmit={
                            selectedMFD
                                ? updateForm.handleSubmit(onUpdateSubmit)
                                : createForm.handleSubmit(onCreateSubmit)
                        }
                        className="space-y-6"
                    >
                        {/* Province Section */}
                        <div className="space-y-4">
                            <div className="border-b pb-2">
                                <h3 className="text-lg font-semibold">Province (Provinsi)</h3>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="namaProvinsi">
                                        Province Name <span className="text-destructive">*</span>
                                    </Label>
                                    <Input
                                        id="namaProvinsi"
                                        {...(selectedMFD
                                            ? updateForm.register('namaProvinsi')
                                            : createForm.register('namaProvinsi'))}
                                        aria-invalid={
                                            selectedMFD
                                                ? !!updateForm.formState.errors.namaProvinsi
                                                : !!createForm.formState.errors.namaProvinsi
                                        }
                                    />
                                    {(selectedMFD
                                        ? updateForm.formState.errors.namaProvinsi
                                        : createForm.formState.errors.namaProvinsi) && (
                                        <p className="text-sm text-destructive">
                                            {selectedMFD
                                                ? updateForm.formState.errors.namaProvinsi?.message
                                                : createForm.formState.errors.namaProvinsi?.message}
                                        </p>
                                    )}
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="kodeProvinsi">
                                        Province Code <span className="text-destructive">*</span>
                                    </Label>
                                    <Input
                                        id="kodeProvinsi"
                                        {...(selectedMFD
                                            ? updateForm.register('kodeProvinsi')
                                            : createForm.register('kodeProvinsi'))}
                                        aria-invalid={
                                            selectedMFD
                                                ? !!updateForm.formState.errors.kodeProvinsi
                                                : !!createForm.formState.errors.kodeProvinsi
                                        }
                                    />
                                    {(selectedMFD
                                        ? updateForm.formState.errors.kodeProvinsi
                                        : createForm.formState.errors.kodeProvinsi) && (
                                        <p className="text-sm text-destructive">
                                            {selectedMFD
                                                ? updateForm.formState.errors.kodeProvinsi?.message
                                                : createForm.formState.errors.kodeProvinsi?.message}
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* District Section */}
                        <div className="space-y-4">
                            <div className="border-b pb-2">
                                <h3 className="text-lg font-semibold">District (Kabupaten)</h3>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="namaKabupaten">
                                        District Name <span className="text-destructive">*</span>
                                    </Label>
                                    <Input
                                        id="namaKabupaten"
                                        {...(selectedMFD
                                            ? updateForm.register('namaKabupaten')
                                            : createForm.register('namaKabupaten'))}
                                        aria-invalid={
                                            selectedMFD
                                                ? !!updateForm.formState.errors.namaKabupaten
                                                : !!createForm.formState.errors.namaKabupaten
                                        }
                                    />
                                    {(selectedMFD
                                        ? updateForm.formState.errors.namaKabupaten
                                        : createForm.formState.errors.namaKabupaten) && (
                                        <p className="text-sm text-destructive">
                                            {selectedMFD
                                                ? updateForm.formState.errors.namaKabupaten?.message
                                                : createForm.formState.errors.namaKabupaten?.message}
                                        </p>
                                    )}
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="kodeKabupaten">
                                        District Code <span className="text-destructive">*</span>
                                    </Label>
                                    <Input
                                        id="kodeKabupaten"
                                        {...(selectedMFD
                                            ? updateForm.register('kodeKabupaten')
                                            : createForm.register('kodeKabupaten'))}
                                        aria-invalid={
                                            selectedMFD
                                                ? !!updateForm.formState.errors.kodeKabupaten
                                                : !!createForm.formState.errors.kodeKabupaten
                                        }
                                    />
                                    {(selectedMFD
                                        ? updateForm.formState.errors.kodeKabupaten
                                        : createForm.formState.errors.kodeKabupaten) && (
                                        <p className="text-sm text-destructive">
                                            {selectedMFD
                                                ? updateForm.formState.errors.kodeKabupaten?.message
                                                : createForm.formState.errors.kodeKabupaten?.message}
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Sub-District Section */}
                        <div className="space-y-4">
                            <div className="border-b pb-2">
                                <h3 className="text-lg font-semibold">Sub-District (Kecamatan)</h3>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="namaKecamatan">
                                        Sub-District Name <span className="text-destructive">*</span>
                                    </Label>
                                    <Input
                                        id="namaKecamatan"
                                        {...(selectedMFD
                                            ? updateForm.register('namaKecamatan')
                                            : createForm.register('namaKecamatan'))}
                                        aria-invalid={
                                            selectedMFD
                                                ? !!updateForm.formState.errors.namaKecamatan
                                                : !!createForm.formState.errors.namaKecamatan
                                        }
                                    />
                                    {(selectedMFD
                                        ? updateForm.formState.errors.namaKecamatan
                                        : createForm.formState.errors.namaKecamatan) && (
                                        <p className="text-sm text-destructive">
                                            {selectedMFD
                                                ? updateForm.formState.errors.namaKecamatan?.message
                                                : createForm.formState.errors.namaKecamatan?.message}
                                        </p>
                                    )}
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="kodeKecamatan">
                                        Sub-District Code <span className="text-destructive">*</span>
                                    </Label>
                                    <Input
                                        id="kodeKecamatan"
                                        {...(selectedMFD
                                            ? updateForm.register('kodeKecamatan')
                                            : createForm.register('kodeKecamatan'))}
                                        aria-invalid={
                                            selectedMFD
                                                ? !!updateForm.formState.errors.kodeKecamatan
                                                : !!createForm.formState.errors.kodeKecamatan
                                        }
                                    />
                                    {(selectedMFD
                                        ? updateForm.formState.errors.kodeKecamatan
                                        : createForm.formState.errors.kodeKecamatan) && (
                                        <p className="text-sm text-destructive">
                                            {selectedMFD
                                                ? updateForm.formState.errors.kodeKecamatan?.message
                                                : createForm.formState.errors.kodeKecamatan?.message}
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Village Section */}
                        <div className="space-y-4">
                            <div className="border-b pb-2">
                                <h3 className="text-lg font-semibold">Village (Desa)</h3>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="namaDesa">
                                        Village Name <span className="text-destructive">*</span>
                                    </Label>
                                    <Input
                                        id="namaDesa"
                                        {...(selectedMFD
                                            ? updateForm.register('namaDesa')
                                            : createForm.register('namaDesa'))}
                                        aria-invalid={
                                            selectedMFD
                                                ? !!updateForm.formState.errors.namaDesa
                                                : !!createForm.formState.errors.namaDesa
                                        }
                                    />
                                    {(selectedMFD
                                        ? updateForm.formState.errors.namaDesa
                                        : createForm.formState.errors.namaDesa) && (
                                        <p className="text-sm text-destructive">
                                            {selectedMFD
                                                ? updateForm.formState.errors.namaDesa?.message
                                                : createForm.formState.errors.namaDesa?.message}
                                        </p>
                                    )}
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="kodeDesa">
                                        Village Code <span className="text-destructive">*</span>
                                    </Label>
                                    <Input
                                        id="kodeDesa"
                                        {...(selectedMFD
                                            ? updateForm.register('kodeDesa')
                                            : createForm.register('kodeDesa'))}
                                        aria-invalid={
                                            selectedMFD
                                                ? !!updateForm.formState.errors.kodeDesa
                                                : !!createForm.formState.errors.kodeDesa
                                        }
                                    />
                                    {(selectedMFD
                                        ? updateForm.formState.errors.kodeDesa
                                        : createForm.formState.errors.kodeDesa) && (
                                        <p className="text-sm text-destructive">
                                            {selectedMFD
                                                ? updateForm.formState.errors.kodeDesa?.message
                                                : createForm.formState.errors.kodeDesa?.message}
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Hamlet Section */}
                        <div className="space-y-4">
                            <div className="border-b pb-2">
                                <h3 className="text-lg font-semibold">Hamlet (Dusun)</h3>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="namaDusun">
                                        Hamlet Name <span className="text-destructive">*</span>
                                    </Label>
                                    <Input
                                        id="namaDusun"
                                        {...(selectedMFD
                                            ? updateForm.register('namaDusun')
                                            : createForm.register('namaDusun'))}
                                        aria-invalid={
                                            selectedMFD
                                                ? !!updateForm.formState.errors.namaDusun
                                                : !!createForm.formState.errors.namaDusun
                                        }
                                    />
                                    {(selectedMFD
                                        ? updateForm.formState.errors.namaDusun
                                        : createForm.formState.errors.namaDusun) && (
                                        <p className="text-sm text-destructive">
                                            {selectedMFD
                                                ? updateForm.formState.errors.namaDusun?.message
                                                : createForm.formState.errors.namaDusun?.message}
                                        </p>
                                    )}
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="kodeDusun">
                                        Hamlet Code <span className="text-destructive">*</span>
                                    </Label>
                                    <Input
                                        id="kodeDusun"
                                        {...(selectedMFD
                                            ? updateForm.register('kodeDusun')
                                            : createForm.register('kodeDusun'))}
                                        aria-invalid={
                                            selectedMFD
                                                ? !!updateForm.formState.errors.kodeDusun
                                                : !!createForm.formState.errors.kodeDusun
                                        }
                                    />
                                    {(selectedMFD
                                        ? updateForm.formState.errors.kodeDusun
                                        : createForm.formState.errors.kodeDusun) && (
                                        <p className="text-sm text-destructive">
                                            {selectedMFD
                                                ? updateForm.formState.errors.kodeDusun?.message
                                                : createForm.formState.errors.kodeDusun?.message}
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* SLS Section */}
                        <div className="space-y-4">
                            <div className="border-b pb-2">
                                <h3 className="text-lg font-semibold">SLS (Satuan Lingkungan Setempat)</h3>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="namaSLS">
                                        SLS Name <span className="text-destructive">*</span>
                                    </Label>
                                    <Input
                                        id="namaSLS"
                                        {...(selectedMFD
                                            ? updateForm.register('namaSLS')
                                            : createForm.register('namaSLS'))}
                                        aria-invalid={
                                            selectedMFD
                                                ? !!updateForm.formState.errors.namaSLS
                                                : !!createForm.formState.errors.namaSLS
                                        }
                                    />
                                    {(selectedMFD
                                        ? updateForm.formState.errors.namaSLS
                                        : createForm.formState.errors.namaSLS) && (
                                        <p className="text-sm text-destructive">
                                            {selectedMFD
                                                ? updateForm.formState.errors.namaSLS?.message
                                                : createForm.formState.errors.namaSLS?.message}
                                        </p>
                                    )}
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="kodeSLS">
                                        SLS Code <span className="text-destructive">*</span>
                                    </Label>
                                    <Input
                                        id="kodeSLS"
                                        {...(selectedMFD
                                            ? updateForm.register('kodeSLS')
                                            : createForm.register('kodeSLS'))}
                                        aria-invalid={
                                            selectedMFD
                                                ? !!updateForm.formState.errors.kodeSLS
                                                : !!createForm.formState.errors.kodeSLS
                                        }
                                    />
                                    {(selectedMFD
                                        ? updateForm.formState.errors.kodeSLS
                                        : createForm.formState.errors.kodeSLS) && (
                                        <p className="text-sm text-destructive">
                                            {selectedMFD
                                                ? updateForm.formState.errors.kodeSLS?.message
                                                : createForm.formState.errors.kodeSLS?.message}
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Sub-SLS Section */}
                        <div className="space-y-4">
                            <div className="border-b pb-2">
                                <h3 className="text-lg font-semibold">Sub-SLS</h3>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="namaSubSLS">
                                        Sub-SLS Name <span className="text-destructive">*</span>
                                    </Label>
                                    <Input
                                        id="namaSubSLS"
                                        {...(selectedMFD
                                            ? updateForm.register('namaSubSLS')
                                            : createForm.register('namaSubSLS'))}
                                        aria-invalid={
                                            selectedMFD
                                                ? !!updateForm.formState.errors.namaSubSLS
                                                : !!createForm.formState.errors.namaSubSLS
                                        }
                                    />
                                    {(selectedMFD
                                        ? updateForm.formState.errors.namaSubSLS
                                        : createForm.formState.errors.namaSubSLS) && (
                                        <p className="text-sm text-destructive">
                                            {selectedMFD
                                                ? updateForm.formState.errors.namaSubSLS?.message
                                                : createForm.formState.errors.namaSubSLS?.message}
                                        </p>
                                    )}
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="kodeSubSLS">
                                        Sub-SLS Code <span className="text-destructive">*</span>
                                    </Label>
                                    <Input
                                        id="kodeSubSLS"
                                        {...(selectedMFD
                                            ? updateForm.register('kodeSubSLS')
                                            : createForm.register('kodeSubSLS'))}
                                        aria-invalid={
                                            selectedMFD
                                                ? !!updateForm.formState.errors.kodeSubSLS
                                                : !!createForm.formState.errors.kodeSubSLS
                                        }
                                    />
                                    {(selectedMFD
                                        ? updateForm.formState.errors.kodeSubSLS
                                        : createForm.formState.errors.kodeSubSLS) && (
                                        <p className="text-sm text-destructive">
                                            {selectedMFD
                                                ? updateForm.formState.errors.kodeSubSLS?.message
                                                : createForm.formState.errors.kodeSubSLS?.message}
                                        </p>
                                    )}
                                </div>
                            </div>
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
                                {selectedMFD ? 'Update MFD' : 'Create MFD'}
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
                            This will delete the MFD record for{' '}
                            <span className="font-semibold">{selectedMFD?.namaDesa}</span> (Village Code: {selectedMFD?.kodeDesa}). This
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
