'use client';

import { useEffect, useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { PencilIcon, TrashIcon, PlusIcon, EyeIcon, SearchIcon, XIcon } from 'lucide-react';

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
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';

// Components
import { KeluargaDialog } from './components/keluarga-dialog';

// Server Actions
import { getKeluargasAction, deleteKeluargaAction } from './actions';

// Types
type MFDInfo = {
    id: number;
    namaProvinsi: string;
    namaKabupaten: string;
    namaDesa: string;
};

type Keluarga = {
    id: number;
    namaKepalaKeluarga: string;
    anggotaKeluarga: number;
    nomorKartuKeluarga: string;
    alamat: string;
    idMFD: number;
    catatan: string;
    mfd: MFDInfo | null;
};

export default function PersonsPage() {
    const router = useRouter();

    // State Management
    const [keluargas, setKeluargas] = useState<Keluarga[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [selectedKeluarga, setSelectedKeluarga] = useState<Keluarga | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);

    // Search and Filter State
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedMFDFilter, setSelectedMFDFilter] = useState<string>('all');

    // Data Fetching
    const fetchKeluargas = async () => {
        try {
            const formData = new FormData();
            const result = await getKeluargasAction(formData);

            if (result.success && result.data) {
                setKeluargas(result.data as Keluarga[]);
            } else {
                toast.error(result.error || 'Failed to load family records');
            }
        } catch (error) {
            console.error('Error fetching keluargas:', error);
            toast.error('Failed to load family records');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchKeluargas();
    }, []);

    // Get unique MFD locations for filter dropdown
    const mfdLocations = useMemo(() => {
        const uniqueMFDs = new Map<number, MFDInfo>();
        keluargas.forEach((keluarga) => {
            if (keluarga.mfd && !uniqueMFDs.has(keluarga.mfd.id)) {
                uniqueMFDs.set(keluarga.mfd.id, keluarga.mfd);
            }
        });
        return Array.from(uniqueMFDs.values());
    }, [keluargas]);

    // Filter and search logic
    const filteredKeluargas = useMemo(() => {
        let filtered = keluargas;

        // Apply search filter
        if (searchQuery.trim()) {
            const query = searchQuery.toLowerCase();
            filtered = filtered.filter(
                (keluarga) =>
                    keluarga.namaKepalaKeluarga.toLowerCase().includes(query) ||
                    keluarga.nomorKartuKeluarga.toLowerCase().includes(query) ||
                    keluarga.alamat.toLowerCase().includes(query)
            );
        }

        // Apply MFD location filter
        if (selectedMFDFilter !== 'all') {
            const mfdId = parseInt(selectedMFDFilter);
            filtered = filtered.filter((keluarga) => keluarga.idMFD === mfdId);
        }

        return filtered;
    }, [keluargas, searchQuery, selectedMFDFilter]);

    // Dialog Handlers
    const handleAddKeluarga = () => {
        setSelectedKeluarga(null);
        setIsDialogOpen(true);
    };

    const handleEditKeluarga = (keluarga: Keluarga) => {
        setSelectedKeluarga(keluarga);
        setIsDialogOpen(true);
    };

    const handleDeleteKeluarga = (keluarga: Keluarga) => {
        setSelectedKeluarga(keluarga);
        setIsDeleteDialogOpen(true);
    };

    const handleViewDetails = (keluarga: Keluarga) => {
        router.push(`/dashboard/persons/${keluarga.id}`);
    };

    const closeDialog = () => {
        setIsDialogOpen(false);
        setSelectedKeluarga(null);
    };

    const handleDialogSuccess = () => {
        fetchKeluargas();
    };

    // Delete Handler
    const onDeleteConfirm = async () => {
        if (!selectedKeluarga) return;

        setIsDeleting(true);
        try {
            const formData = new FormData();
            formData.append('id', selectedKeluarga.id.toString());

            const result = await deleteKeluargaAction(formData);

            if (result.success) {
                toast.success(result.message || 'Family record deleted successfully');
                setIsDeleteDialogOpen(false);
                setSelectedKeluarga(null);
                await fetchKeluargas();
            } else {
                toast.error(result.error || 'Failed to delete family record');
            }
        } catch (error) {
            console.error('Error deleting keluarga:', error);
            toast.error('An unexpected error occurred');
        } finally {
            setIsDeleting(false);
        }
    };

    // Clear filters
    const handleClearFilters = () => {
        setSearchQuery('');
        setSelectedMFDFilter('all');
    };

    const hasActiveFilters = searchQuery.trim() !== '' || selectedMFDFilter !== 'all';

    // Format MFD location display
    const formatMFDLocation = (mfd: MFDInfo | null) => {
        if (!mfd) return 'N/A';
        return `${mfd.namaProvinsi} - ${mfd.namaKabupaten} - ${mfd.namaDesa}`;
    };

    // Loading State
    if (isLoading) {
        return (
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <Skeleton className="h-8 w-48" />
                    <Skeleton className="h-9 w-32" />
                </div>
                <div className="flex gap-4">
                    <Skeleton className="h-10 flex-1" />
                    <Skeleton className="h-10 w-64" />
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
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <h1 className="text-2xl font-bold">Persons Management</h1>
                <Button 
                    onClick={handleAddKeluarga} 
                    aria-label="Add new family"
                    className="w-full sm:w-auto min-h-[44px]"
                >
                    <PlusIcon aria-hidden="true" />
                    Add Family
                </Button>
            </div>

            {/* Search and Filter Bar */}
            <div className="flex flex-col sm:flex-row gap-4">
                {/* Search Input */}
                <div className="relative flex-1">
                    <SearchIcon 
                        className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" 
                        aria-hidden="true"
                    />
                    <Input
                        placeholder="Search by family head name, card number, or address..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-9 min-h-[44px]"
                        aria-label="Search families by name, card number, or address"
                        role="searchbox"
                    />
                </div>

                {/* MFD Location Filter */}
                <div className="flex gap-2">
                    <Select value={selectedMFDFilter} onValueChange={setSelectedMFDFilter}>
                        <SelectTrigger 
                            className="w-full sm:w-64 min-h-[44px]" 
                            aria-label="Filter families by MFD location"
                        >
                            <SelectValue placeholder="All Locations" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Locations</SelectItem>
                            {mfdLocations.map((mfd) => (
                                <SelectItem key={mfd.id} value={mfd.id.toString()}>
                                    {formatMFDLocation(mfd)}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>

                    {/* Clear Filters Button */}
                    {hasActiveFilters && (
                        <Button
                            variant="outline"
                            size="icon"
                            onClick={handleClearFilters}
                            aria-label="Clear all filters"
                            className="min-w-[44px] min-h-[44px]"
                        >
                            <XIcon aria-hidden="true" />
                        </Button>
                    )}
                </div>
            </div>

            {/* Results Count */}
            {hasActiveFilters && (
                <div 
                    className="text-sm text-muted-foreground" 
                    role="status" 
                    aria-live="polite"
                    aria-atomic="true"
                >
                    Showing {filteredKeluargas.length} of {keluargas.length} families
                </div>
            )}

            {/* Keluarga Table */}
            <div className="rounded-md border overflow-x-auto">
                {filteredKeluargas.length === 0 ? (
                    <div 
                        className="p-8 text-center text-muted-foreground"
                        role="status"
                        aria-live="polite"
                    >
                        {hasActiveFilters
                            ? 'No families found matching your search criteria.'
                            : 'No family records found. Click "Add Family" to create one.'}
                    </div>
                ) : (
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead scope="col">Family Head Name</TableHead>
                                <TableHead scope="col" className="hidden md:table-cell">Members</TableHead>
                                <TableHead scope="col">Family Card Number</TableHead>
                                <TableHead scope="col" className="hidden lg:table-cell">Address</TableHead>
                                <TableHead scope="col" className="hidden xl:table-cell">MFD Location</TableHead>
                                <TableHead scope="col" className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredKeluargas.map((keluarga) => (
                                <TableRow key={keluarga.id}>
                                    <TableCell>
                                        <div className="font-medium">{keluarga.namaKepalaKeluarga}</div>
                                        {/* Show members count on mobile */}
                                        <div className="md:hidden text-xs text-muted-foreground mt-1">
                                            {keluarga.anggotaKeluarga} member(s)
                                        </div>
                                    </TableCell>
                                    <TableCell className="hidden md:table-cell">
                                        <Badge variant="secondary">{keluarga.anggotaKeluarga}</Badge>
                                    </TableCell>
                                    <TableCell>
                                        <div className="font-mono text-sm">{keluarga.nomorKartuKeluarga}</div>
                                    </TableCell>
                                    <TableCell className="hidden lg:table-cell">
                                        <div className="max-w-xs truncate" title={keluarga.alamat}>
                                            {keluarga.alamat}
                                        </div>
                                    </TableCell>
                                    <TableCell className="hidden xl:table-cell">
                                        <div className="text-sm">{formatMFDLocation(keluarga.mfd)}</div>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex justify-end gap-1 sm:gap-2">
                                            <Button
                                                variant="ghost"
                                                size="icon-sm"
                                                onClick={() => handleViewDetails(keluarga)}
                                                aria-label={`View details for ${keluarga.namaKepalaKeluarga}`}
                                                className="min-w-[44px] min-h-[44px]"
                                            >
                                                <EyeIcon aria-hidden="true" />
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="icon-sm"
                                                onClick={() => handleEditKeluarga(keluarga)}
                                                aria-label={`Edit ${keluarga.namaKepalaKeluarga}`}
                                                className="min-w-[44px] min-h-[44px]"
                                            >
                                                <PencilIcon aria-hidden="true" />
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="icon-sm"
                                                onClick={() => handleDeleteKeluarga(keluarga)}
                                                aria-label={`Delete ${keluarga.namaKepalaKeluarga}`}
                                                className="min-w-[44px] min-h-[44px]"
                                            >
                                                <TrashIcon aria-hidden="true" />
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                )}
            </div>

            {/* Keluarga Dialog */}
            <KeluargaDialog
                open={isDialogOpen}
                onOpenChange={setIsDialogOpen}
                mode={selectedKeluarga ? 'edit' : 'create'}
                initialData={
                    selectedKeluarga
                        ? {
                              id: selectedKeluarga.id,
                              namaKepalaKeluarga: selectedKeluarga.namaKepalaKeluarga,
                              anggotaKeluarga: selectedKeluarga.anggotaKeluarga,
                              nomorKartuKeluarga: selectedKeluarga.nomorKartuKeluarga,
                              alamat: selectedKeluarga.alamat,
                              idMFD: selectedKeluarga.idMFD,
                              catatan: selectedKeluarga.catatan,
                          }
                        : undefined
                }
                onSuccess={handleDialogSuccess}
            />

            {/* Delete Confirmation Dialog */}
            <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                <AlertDialogContent role="alertdialog" aria-labelledby="delete-dialog-title" aria-describedby="delete-dialog-description">
                    <AlertDialogHeader>
                        <AlertDialogTitle id="delete-dialog-title">Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription id="delete-dialog-description">
                            This will delete the family record for{' '}
                            <span className="font-semibold">{selectedKeluarga?.namaKepalaKeluarga}</span> (Family
                            Card: {selectedKeluarga?.nomorKartuKeluarga}). This action cannot be undone.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel 
                            disabled={isDeleting}
                            className="min-h-[44px]"
                        >
                            Cancel
                        </AlertDialogCancel>
                        <AlertDialogAction
                            onClick={onDeleteConfirm}
                            disabled={isDeleting}
                            className="bg-destructive text-white hover:bg-destructive/90 min-h-[44px]"
                            aria-label="Confirm delete family record"
                        >
                            {isDeleting ? 'Deleting...' : 'Delete'}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}
