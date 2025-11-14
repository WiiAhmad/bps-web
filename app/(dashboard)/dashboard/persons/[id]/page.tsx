'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { ArrowLeftIcon, PencilIcon, PlusIcon, TrashIcon, ChevronDownIcon, ChevronUpIcon } from 'lucide-react';

// UI Components
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
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
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from '@/components/ui/collapsible';

// Components
import { KeluargaDialog } from '../components/keluarga-dialog';
import { AnggotaKeluargaDialog } from '../components/anggota-keluarga-dialog';
import { KetPetugasDialog } from '../components/ket-petugas-dialog';
import { KetenagakerjaanDialog } from '../components/ketenagakerjaan-dialog';
import { HousingDialog } from '../components/housing-dialog';
import { HousingBlok2Dialog } from '../components/housing-blok2-dialog';
import { BantuanDialog } from '../components/bantuan-dialog';
import { DisabilitasDialog } from '../components/disabilitas-dialog';

// Server Actions
import {
    getKeluargaDetailAction,
    deleteAnggotaKeluargaAction,
    createKetPetugasAction,
    updateKetPetugasAction,
    deleteKetPetugasAction,
    createKetenagakerjaanAction,
    updateKetenagakerjaanAction,
    deleteKetenagakerjaanAction,
    createKeteranganPerumahanAction,
    updateKeteranganPerumahanAction,
    deleteKeteranganPerumahanAction,
    createKeteranganPerumahanBlok2Action,
    updateKeteranganPerumahanBlok2Action,
    deleteKeteranganPerumahanBlok2Action,
    createBantuanAction,
    updateBantuanAction,
    deleteBantuanAction,
    createDisabilitasAction,
    updateDisabilitasAction,
    deleteDisabilitasAction,
} from './actions';

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

type AnggotaKeluarga = {
    id: number;
    idKeluarga: number;
    nomorUrut: number;
    namaLengkap: string;
    NIK: string;
    jenisKelamin: number;
    hubunganKeluarga: number;
    statusKawin: number;
    tempatLahir: string;
    tanggalLahir: string;
    umur: number;
    agama: number;
    kartuIdentitas: number;
    domisili: number;
    partisipasiSekolah: number;
    tingkatPendidikan: number;
    kelasTertinggi: number | null;
    ijazahTertinggi: number | null;
};

type KetPetugas = {
    id: number;
    idKeluarga: number;
    tanggalPendataan: string;
    namaPendata: string;
    kodePendata: number;
    tanggalPemeriksaan: string;
    namaPemeriksa: string;
    kodePemeriksa: number;
    hasilPendataan: string;
};

type Ketenagakerjaan = {
    id: number;
    idAnggotaKeluarga: number;
    bekerja: string | null;
    lapanganUsaha: string | null;
    statusPekerjaan: string | null;
    kegiatanUtama: string | null;
    lengkap: string | null;
};

type KeteranganPerumahan = {
    id: number;
    idKeluarga: number;
    luasLantai: number | null;
    statusBangunan: string | null;
    buktiKepemilikan: string | null;
    sumberAirMinum: string | null;
    fasilitasBAB: string | null;
    peneranganUtama: string | null;
    daya: string | null;
};

type KeteranganPerumahanBlok2 = {
    id: number;
    idKeluarga: number;
    luasPertanianSawah: number | null;
    luasPertanianKebun: number | null;
    luasPertanianKolam: number | null;
    ayam: number | null;
    kambing: number | null;
    sapi: number | null;
};

type Bantuan = {
    id: number;
    idKeluarga: number;
    idAnggotaKeluarga: number;
    bantuan1tahunTerakhir: number | null;
    bantuanPKH: number | null;
    bantuanBPNT: number | null;
    bantuanBOS: number | null;
    bantuanBAPANAS: number | null;
    bantuanStunting: number | null;
    bantuanKIS: number | null;
    bantuanBLT: number | null;
    bantuanlainnyaStatus: number | null;
    bantuanlainnyaNama: number | null;
};

type Disabilitas = {
    id: number;
    idKeluarga: number;
    idAnggotaKeluarga: number;
    disabilisitas: string | null;
    tunaDaksa: string | null;
    tunaWicara: string | null;
    tunaNetra: string | null;
    tunaLaras: string | null;
    tunaLainnyaStatus: string | null;
    tunaLainnyaNama: string | null;
};

type AnggotaKeluargaWithEmployment = AnggotaKeluarga & {
    ketenagakerjaan: Ketenagakerjaan[];
};

type FamilyDetailData = {
    keluarga: Keluarga;
    anggotaKeluarga: AnggotaKeluargaWithEmployment[];
    ketPetugas: KetPetugas[];
    keteranganPerumahan: KeteranganPerumahan[];
    keteranganPerumahanBlok2: KeteranganPerumahanBlok2[];
    bantuan: Bantuan[];
    disabilitas: Disabilitas[];
};

export default function FamilyDetailPage() {
    const params = useParams();
    const router = useRouter();
    const keluargaId = Number(params.id);

    // State Management
    const [familyData, setFamilyData] = useState<FamilyDetailData | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Dialog States
    const [isKeluargaDialogOpen, setIsKeluargaDialogOpen] = useState(false);
    const [isAnggotaDialogOpen, setIsAnggotaDialogOpen] = useState(false);
    const [isDeleteAnggotaDialogOpen, setIsDeleteAnggotaDialogOpen] = useState(false);
    const [selectedAnggota, setSelectedAnggota] = useState<AnggotaKeluarga | null>(null);
    const [isDeletingAnggota, setIsDeletingAnggota] = useState(false);

    // Additional Data Dialog States
    const [isKetPetugasDialogOpen, setIsKetPetugasDialogOpen] = useState(false);
    const [isKetenagakerjaanDialogOpen, setIsKetenagakerjaanDialogOpen] = useState(false);
    const [isHousingDialogOpen, setIsHousingDialogOpen] = useState(false);
    const [isHousingBlok2DialogOpen, setIsHousingBlok2DialogOpen] = useState(false);
    const [isBantuanDialogOpen, setIsBantuanDialogOpen] = useState(false);
    const [isDisabilitasDialogOpen, setIsDisabilitasDialogOpen] = useState(false);

    const [selectedKetPetugas, setSelectedKetPetugas] = useState<KetPetugas | null>(null);
    const [selectedKetenagakerjaan, setSelectedKetenagakerjaan] = useState<Ketenagakerjaan | null>(null);
    const [selectedHousing, setSelectedHousing] = useState<KeteranganPerumahan | null>(null);
    const [selectedHousingBlok2, setSelectedHousingBlok2] = useState<KeteranganPerumahanBlok2 | null>(null);
    const [selectedBantuan, setSelectedBantuan] = useState<Bantuan | null>(null);
    const [selectedDisabilitas, setSelectedDisabilitas] = useState<Disabilitas | null>(null);

    // Delete Dialog States
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [deleteTarget, setDeleteTarget] = useState<{ type: string; id: number; name: string } | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);

    // Collapsible Section States
    const [isKetPetugasOpen, setIsKetPetugasOpen] = useState(false);
    const [isKetenagakerjaanOpen, setIsKetenagakerjaanOpen] = useState(false);
    const [isHousingOpen, setIsHousingOpen] = useState(false);
    const [isHousingBlok2Open, setIsHousingBlok2Open] = useState(false);
    const [isBantuanOpen, setIsBantuanOpen] = useState(false);
    const [isDisabilitasOpen, setIsDisabilitasOpen] = useState(false);

    // Data Fetching
    const fetchFamilyDetail = async () => {
        try {
            setIsLoading(true);
            setError(null);

            const formData = new FormData();
            formData.append('id', keluargaId.toString());

            const result = await getKeluargaDetailAction(formData);

            if (result.success && result.data) {
                setFamilyData(result.data as FamilyDetailData);
            } else {
                setError(result.error || 'Failed to load family details');
                toast.error(result.error || 'Failed to load family details');
            }
        } catch (error) {
            console.error('Error fetching family detail:', error);
            setError('An unexpected error occurred');
            toast.error('An unexpected error occurred');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (!keluargaId || isNaN(keluargaId)) {
            setError('Invalid family ID');
            setIsLoading(false);
            return;
        }

        fetchFamilyDetail();
    }, [keluargaId]);

    // Navigation Handlers
    const handleBackToFamilies = () => {
        router.push('/dashboard/persons');
    };

    // Anggota Keluarga Handlers
    const handleAddAnggota = () => {
        setSelectedAnggota(null);
        setIsAnggotaDialogOpen(true);
    };

    const handleEditAnggota = (anggota: AnggotaKeluarga) => {
        setSelectedAnggota(anggota);
        setIsAnggotaDialogOpen(true);
    };

    const handleDeleteAnggota = (anggota: AnggotaKeluarga) => {
        setSelectedAnggota(anggota);
        setIsDeleteAnggotaDialogOpen(true);
    };

    const onDeleteAnggotaConfirm = async () => {
        if (!selectedAnggota) return;

        setIsDeletingAnggota(true);
        try {
            const formData = new FormData();
            formData.append('id', selectedAnggota.id.toString());

            const result = await deleteAnggotaKeluargaAction(formData);

            if (result.success) {
                toast.success(result.message || 'Family member deleted successfully');
                setIsDeleteAnggotaDialogOpen(false);
                setSelectedAnggota(null);
                await fetchFamilyDetail();
            } else {
                toast.error(result.error || 'Failed to delete family member');
            }
        } catch (error) {
            console.error('Error deleting anggota keluarga:', error);
            toast.error('An unexpected error occurred');
        } finally {
            setIsDeletingAnggota(false);
        }
    };

    // Format MFD location display
    const formatMFDLocation = (mfd: MFDInfo | null) => {
        if (!mfd) return 'N/A';
        return `${mfd.namaProvinsi} - ${mfd.namaKabupaten} - ${mfd.namaDesa}`;
    };

    // Format gender display
    const formatGender = (jenisKelamin: number) => {
        return jenisKelamin === 1 ? 'Male' : jenisKelamin === 2 ? 'Female' : 'N/A';
    };

    // Format family relationship
    const formatHubunganKeluarga = (hubungan: number) => {
        const relationships: Record<number, string> = {
            1: 'Head of Family',
            2: 'Spouse',
            3: 'Child',
            4: 'Son/Daughter-in-law',
            5: 'Grandchild',
            6: 'Parent',
            7: 'Parent-in-law',
            8: 'Sibling',
            9: 'Other',
        };
        return relationships[hubungan] || 'N/A';
    };

    // Format education level
    const formatTingkatPendidikan = (tingkat: number) => {
        const levels: Record<number, string> = {
            1: 'No Education',
            2: 'Not Completed Elementary',
            3: 'Elementary',
            4: 'Junior High',
            5: 'Senior High',
            6: 'Diploma I/II',
            7: 'Diploma III/Academy',
            8: 'Diploma IV/Bachelor',
            9: 'Master',
            10: 'Doctorate',
        };
        return levels[tingkat] || 'N/A';
    };

    // Get anggota name by ID
    const getAnggotaName = (idAnggota: number) => {
        const anggota = familyData?.anggotaKeluarga.find((a) => a.id === idAnggota);
        return anggota ? `${anggota.namaLengkap} (${anggota.NIK})` : 'N/A';
    };

    // Format date
    const formatDate = (dateString: string) => {
        if (!dateString) return 'N/A';
        const date = new Date(dateString);
        return date.toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' });
    };

    // Delete handler for additional data
    const handleDelete = (type: string, id: number, name: string) => {
        setDeleteTarget({ type, id, name });
        setIsDeleteDialogOpen(true);
    };

    // Wrapper functions to convert data objects to FormData for server actions
    const handleKetPetugasSubmit = async (data: any) => {
        const formData = new FormData();
        Object.entries(data).forEach(([key, value]) => {
            if (value !== undefined && value !== null) {
                formData.append(key, String(value));
            }
        });
        const result = data.id
            ? await updateKetPetugasAction({} as any, formData)
            : await createKetPetugasAction({} as any, formData);
        return {
            success: 'success' in result ? result.success : false,
            error: result.error,
            message: 'message' in result ? result.message : undefined,
        };
    };

    const handleKetenagakerjaanSubmit = async (data: any) => {
        const formData = new FormData();
        Object.entries(data).forEach(([key, value]) => {
            if (value !== undefined && value !== null) {
                formData.append(key, String(value));
            }
        });
        const result = data.id
            ? await updateKetenagakerjaanAction({} as any, formData)
            : await createKetenagakerjaanAction({} as any, formData);
        return {
            success: 'success' in result ? result.success : false,
            error: result.error,
            message: 'message' in result ? result.message : undefined,
        };
    };

    const handleHousingSubmit = async (data: any) => {
        const formData = new FormData();
        Object.entries(data).forEach(([key, value]) => {
            if (value !== undefined && value !== null) {
                formData.append(key, String(value));
            }
        });
        const result = data.id
            ? await updateKeteranganPerumahanAction({} as any, formData)
            : await createKeteranganPerumahanAction({} as any, formData);
        return {
            success: 'success' in result ? result.success : false,
            error: result.error,
            message: 'message' in result ? result.message : undefined,
        };
    };

    const handleHousingBlok2Submit = async (data: any) => {
        const formData = new FormData();
        Object.entries(data).forEach(([key, value]) => {
            if (value !== undefined && value !== null) {
                formData.append(key, String(value));
            }
        });
        const result = data.id
            ? await updateKeteranganPerumahanBlok2Action({} as any, formData)
            : await createKeteranganPerumahanBlok2Action({} as any, formData);
        return {
            success: 'success' in result ? result.success : false,
            error: result.error,
            message: 'message' in result ? result.message : undefined,
        };
    };

    const handleBantuanSubmit = async (data: any) => {
        const formData = new FormData();
        Object.entries(data).forEach(([key, value]) => {
            if (value !== undefined && value !== null) {
                formData.append(key, String(value));
            }
        });
        const result = data.id
            ? await updateBantuanAction({} as any, formData)
            : await createBantuanAction({} as any, formData);
        return {
            success: 'success' in result ? result.success : false,
            error: result.error,
            message: 'message' in result ? result.message : undefined,
        };
    };

    const handleDisabilitasSubmit = async (data: any) => {
        const formData = new FormData();
        Object.entries(data).forEach(([key, value]) => {
            if (value !== undefined && value !== null) {
                formData.append(key, String(value));
            }
        });
        const result = data.id
            ? await updateDisabilitasAction({} as any, formData)
            : await createDisabilitasAction({} as any, formData);
        return {
            success: 'success' in result ? result.success : false,
            error: result.error,
            message: 'message' in result ? result.message : undefined,
        };
    };

    const onDeleteConfirm = async () => {
        if (!deleteTarget) return;

        setIsDeleting(true);
        try {
            const formData = new FormData();
            formData.append('id', deleteTarget.id.toString());

            let result;
            switch (deleteTarget.type) {
                case 'ketPetugas':
                    result = await deleteKetPetugasAction(formData);
                    break;
                case 'ketenagakerjaan':
                    result = await deleteKetenagakerjaanAction(formData);
                    break;
                case 'housing':
                    result = await deleteKeteranganPerumahanAction(formData);
                    break;
                case 'housingBlok2':
                    result = await deleteKeteranganPerumahanBlok2Action(formData);
                    break;
                case 'bantuan':
                    result = await deleteBantuanAction(formData);
                    break;
                case 'disabilitas':
                    result = await deleteDisabilitasAction(formData);
                    break;
                default:
                    throw new Error('Invalid delete type');
            }

            if (result.success) {
                toast.success(result.message || 'Record deleted successfully');
                setIsDeleteDialogOpen(false);
                setDeleteTarget(null);
                await fetchFamilyDetail();
            } else {
                toast.error(result.error || 'Failed to delete record');
            }
        } catch (error) {
            console.error('Error deleting record:', error);
            toast.error('An unexpected error occurred');
        } finally {
            setIsDeleting(false);
        }
    };

    // Loading State
    if (isLoading) {
        return (
            <div className="space-y-6">
                <div className="flex items-center gap-4">
                    <Skeleton className="h-9 w-32" />
                    <Skeleton className="h-8 flex-1" />
                </div>
                <Card>
                    <CardHeader>
                        <Skeleton className="h-6 w-48" />
                    </CardHeader>
                    <CardContent className="space-y-3">
                        {[...Array(6)].map((_, i) => (
                            <Skeleton key={i} className="h-4 w-full" />
                        ))}
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <Skeleton className="h-6 w-48" />
                    </CardHeader>
                    <CardContent>
                        <Skeleton className="h-64 w-full" />
                    </CardContent>
                </Card>
            </div>
        );
    }

    // Error State
    if (error || !familyData) {
        return (
            <div className="space-y-6">
                <Button variant="outline" onClick={handleBackToFamilies}>
                    <ArrowLeftIcon />
                    Back to Families
                </Button>
                <Card>
                    <CardContent className="p-8 text-center">
                        <p className="text-destructive">{error || 'Family not found'}</p>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Page Header with Back Button */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                <Button 
                    variant="outline" 
                    onClick={handleBackToFamilies}
                    aria-label="Back to families list"
                    className="min-h-[44px]"
                >
                    <ArrowLeftIcon aria-hidden="true" />
                    Back to Families
                </Button>
                <h1 className="text-2xl font-bold">Family Details</h1>
            </div>

            {/* Family Information Section */}
            <Card>
                <CardHeader>
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                        <CardTitle>Family Information</CardTitle>
                        <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => setIsKeluargaDialogOpen(true)}
                            aria-label="Edit family information"
                            className="w-full sm:w-auto min-h-[44px]"
                        >
                            <PencilIcon aria-hidden="true" />
                            Edit Family
                        </Button>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <p className="text-sm font-medium text-muted-foreground">Family Head Name</p>
                            <p className="text-base font-semibold">{familyData.keluarga.namaKepalaKeluarga}</p>
                        </div>
                        <div>
                            <p className="text-sm font-medium text-muted-foreground">Number of Members</p>
                            <Badge variant="secondary" className="mt-1">
                                {familyData.keluarga.anggotaKeluarga} member(s)
                            </Badge>
                        </div>
                        <div>
                            <p className="text-sm font-medium text-muted-foreground">Family Card Number</p>
                            <p className="text-base font-mono">{familyData.keluarga.nomorKartuKeluarga}</p>
                        </div>
                        <div>
                            <p className="text-sm font-medium text-muted-foreground">MFD Location</p>
                            <p className="text-base">{formatMFDLocation(familyData.keluarga.mfd)}</p>
                        </div>
                        <div className="md:col-span-2">
                            <p className="text-sm font-medium text-muted-foreground">Address</p>
                            <p className="text-base">{familyData.keluarga.alamat}</p>
                        </div>
                        {familyData.keluarga.catatan && (
                            <div className="md:col-span-2">
                                <p className="text-sm font-medium text-muted-foreground">Notes</p>
                                <p className="text-base">{familyData.keluarga.catatan}</p>
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>

            {/* Anggota Keluarga Section */}
            <Card>
                <CardHeader>
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                        <div>
                            <CardTitle>Family Members</CardTitle>
                            <CardDescription>
                                {familyData.anggotaKeluarga.length} member(s)
                            </CardDescription>
                        </div>
                        <Button 
                            onClick={handleAddAnggota}
                            aria-label="Add new family member"
                            className="w-full sm:w-auto min-h-[44px]"
                        >
                            <PlusIcon aria-hidden="true" />
                            Add Family Member
                        </Button>
                    </div>
                </CardHeader>
                <CardContent>
                    {familyData.anggotaKeluarga.length === 0 ? (
                        <div 
                            className="p-8 text-center text-muted-foreground"
                            role="status"
                            aria-live="polite"
                        >
                            No family members found. Click "Add Family Member" to create one.
                        </div>
                    ) : (
                        <div className="rounded-md border overflow-x-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead scope="col" className="w-16">No.</TableHead>
                                        <TableHead scope="col">Full Name</TableHead>
                                        <TableHead scope="col">NIK</TableHead>
                                        <TableHead scope="col" className="hidden md:table-cell">Gender</TableHead>
                                        <TableHead scope="col" className="hidden lg:table-cell">Relationship</TableHead>
                                        <TableHead scope="col" className="hidden md:table-cell">Age</TableHead>
                                        <TableHead scope="col" className="hidden xl:table-cell">Education</TableHead>
                                        <TableHead scope="col" className="text-right">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {familyData.anggotaKeluarga.map((anggota) => (
                                        <TableRow key={anggota.id}>
                                            <TableCell className="font-medium">{anggota.nomorUrut}</TableCell>
                                            <TableCell>
                                                <div className="font-medium">{anggota.namaLengkap}</div>
                                                {/* Show age on mobile */}
                                                <div className="md:hidden text-xs text-muted-foreground mt-1">
                                                    {anggota.umur} years old
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="font-mono text-sm">{anggota.NIK}</div>
                                            </TableCell>
                                            <TableCell className="hidden md:table-cell">
                                                {formatGender(anggota.jenisKelamin)}
                                            </TableCell>
                                            <TableCell className="hidden lg:table-cell">
                                                {formatHubunganKeluarga(anggota.hubunganKeluarga)}
                                            </TableCell>
                                            <TableCell className="hidden md:table-cell">
                                                <Badge variant="secondary">{anggota.umur} years</Badge>
                                            </TableCell>
                                            <TableCell className="hidden xl:table-cell">
                                                {formatTingkatPendidikan(anggota.tingkatPendidikan)}
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <div className="flex justify-end gap-1 sm:gap-2">
                                                    <Button
                                                        variant="ghost"
                                                        size="icon-sm"
                                                        onClick={() => handleEditAnggota(anggota)}
                                                        aria-label={`Edit ${anggota.namaLengkap}`}
                                                        className="min-w-[44px] min-h-[44px]"
                                                    >
                                                        <PencilIcon aria-hidden="true" />
                                                    </Button>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon-sm"
                                                        onClick={() => handleDeleteAnggota(anggota)}
                                                        aria-label={`Delete ${anggota.namaLengkap}`}
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
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Additional Data Sections */}
            <div className="space-y-4">
                <h2 className="text-xl font-bold">Additional Information</h2>

                {/* Ket Petugas Section */}
                <Collapsible open={isKetPetugasOpen} onOpenChange={setIsKetPetugasOpen}>
                    <Card>
                        <CollapsibleTrigger 
                            className="w-full min-h-[44px]"
                            aria-expanded={isKetPetugasOpen}
                            aria-controls="ket-petugas-content"
                        >
                            <CardHeader>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <CardTitle>Survey Officer Information</CardTitle>
                                        <Badge variant="secondary">
                                            {familyData.ketPetugas.length} record(s)
                                        </Badge>
                                    </div>
                                    {isKetPetugasOpen ? (
                                        <ChevronUpIcon aria-hidden="true" />
                                    ) : (
                                        <ChevronDownIcon aria-hidden="true" />
                                    )}
                                </div>
                            </CardHeader>
                        </CollapsibleTrigger>
                        <CollapsibleContent id="ket-petugas-content">
                            <CardContent>
                                {familyData.ketPetugas.length === 0 ? (
                                    <div 
                                        className="p-4 text-center text-muted-foreground"
                                        role="status"
                                    >
                                        No survey officer information found.
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        {familyData.ketPetugas.map((petugas) => (
                                            <Card key={petugas.id}>
                                                <CardContent className="pt-6">
                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                        <div>
                                                            <p className="text-sm font-medium text-muted-foreground">
                                                                Data Collection Date
                                                            </p>
                                                            <p className="text-base">
                                                                {formatDate(petugas.tanggalPendataan)}
                                                            </p>
                                                        </div>
                                                        <div>
                                                            <p className="text-sm font-medium text-muted-foreground">
                                                                Data Collector
                                                            </p>
                                                            <p className="text-base">
                                                                {petugas.namaPendata} (Code: {petugas.kodePendata})
                                                            </p>
                                                        </div>
                                                        <div>
                                                            <p className="text-sm font-medium text-muted-foreground">
                                                                Inspection Date
                                                            </p>
                                                            <p className="text-base">
                                                                {formatDate(petugas.tanggalPemeriksaan)}
                                                            </p>
                                                        </div>
                                                        <div>
                                                            <p className="text-sm font-medium text-muted-foreground">
                                                                Inspector
                                                            </p>
                                                            <p className="text-base">
                                                                {petugas.namaPemeriksa} (Code: {petugas.kodePemeriksa})
                                                            </p>
                                                        </div>
                                                        <div className="md:col-span-2">
                                                            <p className="text-sm font-medium text-muted-foreground">
                                                                Survey Result
                                                            </p>
                                                            <p className="text-base">{petugas.hasilPendataan}</p>
                                                        </div>
                                                    </div>
                                                    <div className="flex flex-col sm:flex-row gap-2 mt-4">
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            onClick={() => {
                                                                setSelectedKetPetugas(petugas);
                                                                setIsKetPetugasDialogOpen(true);
                                                            }}
                                                            className="min-h-[44px]"
                                                        >
                                                            <PencilIcon aria-hidden="true" />
                                                            Edit
                                                        </Button>
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            onClick={() =>
                                                                handleDelete(
                                                                    'ketPetugas',
                                                                    petugas.id,
                                                                    'Survey Officer Information'
                                                                )
                                                            }
                                                            className="min-h-[44px]"
                                                        >
                                                            <TrashIcon aria-hidden="true" />
                                                            Delete
                                                        </Button>
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        ))}
                                    </div>
                                )}
                                <div className="mt-4">
                                    <Button
                                        size="sm"
                                        onClick={() => {
                                            setSelectedKetPetugas(null);
                                            setIsKetPetugasDialogOpen(true);
                                        }}
                                        aria-label="Add survey officer information"
                                        className="min-h-[44px]"
                                    >
                                        <PlusIcon aria-hidden="true" />
                                        Add Survey Officer Info
                                    </Button>
                                </div>
                            </CardContent>
                        </CollapsibleContent>
                    </Card>
                </Collapsible>

                {/* Ketenagakerjaan Section */}
                <Collapsible open={isKetenagakerjaanOpen} onOpenChange={setIsKetenagakerjaanOpen}>
                    <Card>
                        <CollapsibleTrigger 
                            className="w-full min-h-[44px]"
                            aria-expanded={isKetenagakerjaanOpen}
                            aria-controls="ketenagakerjaan-content"
                        >
                            <CardHeader>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <CardTitle>Employment Data</CardTitle>
                                        <Badge variant="secondary">
                                            {familyData.anggotaKeluarga.reduce(
                                                (acc, a) => acc + (a.ketenagakerjaan?.length || 0),
                                                0
                                            )}{' '}
                                            record(s)
                                        </Badge>
                                    </div>
                                    {isKetenagakerjaanOpen ? (
                                        <ChevronUpIcon aria-hidden="true" />
                                    ) : (
                                        <ChevronDownIcon aria-hidden="true" />
                                    )}
                                </div>
                            </CardHeader>
                        </CollapsibleTrigger>
                        <CollapsibleContent id="ketenagakerjaan-content">
                            <CardContent>
                                {familyData.anggotaKeluarga.every((a) => !a.ketenagakerjaan?.length) ? (
                                    <div 
                                        className="p-4 text-center text-muted-foreground"
                                        role="status"
                                    >
                                        No employment data found.
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        {familyData.anggotaKeluarga.map((anggota) =>
                                            anggota.ketenagakerjaan?.map((employment) => (
                                                <Card key={employment.id}>
                                                    <CardContent className="pt-6">
                                                        <div className="mb-4">
                                                            <Badge variant="outline">
                                                                {anggota.namaLengkap}
                                                            </Badge>
                                                        </div>
                                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                            <div>
                                                                <p className="text-sm font-medium text-muted-foreground">
                                                                    Working Status
                                                                </p>
                                                                <p className="text-base">
                                                                    {employment.bekerja || 'N/A'}
                                                                </p>
                                                            </div>
                                                            <div>
                                                                <p className="text-sm font-medium text-muted-foreground">
                                                                    Business Field
                                                                </p>
                                                                <p className="text-base">
                                                                    {employment.lapanganUsaha || 'N/A'}
                                                                </p>
                                                            </div>
                                                            <div>
                                                                <p className="text-sm font-medium text-muted-foreground">
                                                                    Employment Status
                                                                </p>
                                                                <p className="text-base">
                                                                    {employment.statusPekerjaan || 'N/A'}
                                                                </p>
                                                            </div>
                                                            <div>
                                                                <p className="text-sm font-medium text-muted-foreground">
                                                                    Main Activity
                                                                </p>
                                                                <p className="text-base">
                                                                    {employment.kegiatanUtama || 'N/A'}
                                                                </p>
                                                            </div>
                                                            <div>
                                                                <p className="text-sm font-medium text-muted-foreground">
                                                                    Complete Status
                                                                </p>
                                                                <p className="text-base">
                                                                    {employment.lengkap || 'N/A'}
                                                                </p>
                                                            </div>
                                                        </div>
                                                        <div className="flex flex-col sm:flex-row gap-2 mt-4">
                                                            <Button
                                                                variant="outline"
                                                                size="sm"
                                                                onClick={() => {
                                                                    setSelectedKetenagakerjaan(employment);
                                                                    setIsKetenagakerjaanDialogOpen(true);
                                                                }}
                                                                className="min-h-[44px]"
                                                            >
                                                                <PencilIcon aria-hidden="true" />
                                                                Edit
                                                            </Button>
                                                            <Button
                                                                variant="outline"
                                                                size="sm"
                                                                onClick={() =>
                                                                    handleDelete(
                                                                        'ketenagakerjaan',
                                                                        employment.id,
                                                                        `Employment Data for ${anggota.namaLengkap}`
                                                                    )
                                                                }
                                                                className="min-h-[44px]"
                                                            >
                                                                <TrashIcon aria-hidden="true" />
                                                                Delete
                                                            </Button>
                                                        </div>
                                                    </CardContent>
                                                </Card>
                                            ))
                                        )}
                                    </div>
                                )}
                                <div className="mt-4">
                                    <Button
                                        size="sm"
                                        onClick={() => {
                                            setSelectedKetenagakerjaan(null);
                                            setIsKetenagakerjaanDialogOpen(true);
                                        }}
                                        aria-label="Add employment data"
                                        className="min-h-[44px]"
                                    >
                                        <PlusIcon aria-hidden="true" />
                                        Add Employment Data
                                    </Button>
                                </div>
                            </CardContent>
                        </CollapsibleContent>
                    </Card>
                </Collapsible>

                {/* Housing Characteristics Section */}
                <Collapsible open={isHousingOpen} onOpenChange={setIsHousingOpen}>
                    <Card>
                        <CollapsibleTrigger 
                            className="w-full min-h-[44px]"
                            aria-expanded={isHousingOpen}
                            aria-controls="housing-content"
                        >
                            <CardHeader>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <CardTitle>Housing Characteristics</CardTitle>
                                        <Badge variant="secondary">
                                            {familyData.keteranganPerumahan.length} record(s)
                                        </Badge>
                                    </div>
                                    {isHousingOpen ? (
                                        <ChevronUpIcon aria-hidden="true" />
                                    ) : (
                                        <ChevronDownIcon aria-hidden="true" />
                                    )}
                                </div>
                            </CardHeader>
                        </CollapsibleTrigger>
                        <CollapsibleContent id="housing-content">
                            <CardContent>
                                {familyData.keteranganPerumahan.length === 0 ? (
                                    <div 
                                        className="p-4 text-center text-muted-foreground"
                                        role="status"
                                    >
                                        No housing characteristics found.
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        {familyData.keteranganPerumahan.map((housing) => (
                                            <Card key={housing.id}>
                                                <CardContent className="pt-6">
                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                        <div>
                                                            <p className="text-sm font-medium text-muted-foreground">
                                                                Floor Area (m²)
                                                            </p>
                                                            <p className="text-base">
                                                                {housing.luasLantai || 'N/A'}
                                                            </p>
                                                        </div>
                                                        <div>
                                                            <p className="text-sm font-medium text-muted-foreground">
                                                                Building Status
                                                            </p>
                                                            <p className="text-base">
                                                                {housing.statusBangunan || 'N/A'}
                                                            </p>
                                                        </div>
                                                        <div>
                                                            <p className="text-sm font-medium text-muted-foreground">
                                                                Ownership Proof
                                                            </p>
                                                            <p className="text-base">
                                                                {housing.buktiKepemilikan || 'N/A'}
                                                            </p>
                                                        </div>
                                                        <div>
                                                            <p className="text-sm font-medium text-muted-foreground">
                                                                Water Source
                                                            </p>
                                                            <p className="text-base">
                                                                {housing.sumberAirMinum || 'N/A'}
                                                            </p>
                                                        </div>
                                                        <div>
                                                            <p className="text-sm font-medium text-muted-foreground">
                                                                Toilet Facility
                                                            </p>
                                                            <p className="text-base">
                                                                {housing.fasilitasBAB || 'N/A'}
                                                            </p>
                                                        </div>
                                                        <div>
                                                            <p className="text-sm font-medium text-muted-foreground">
                                                                Main Lighting
                                                            </p>
                                                            <p className="text-base">
                                                                {housing.peneranganUtama || 'N/A'}
                                                            </p>
                                                        </div>
                                                        <div>
                                                            <p className="text-sm font-medium text-muted-foreground">
                                                                Electricity Power
                                                            </p>
                                                            <p className="text-base">{housing.daya || 'N/A'}</p>
                                                        </div>
                                                    </div>
                                                    <div className="flex flex-col sm:flex-row gap-2 mt-4">
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            onClick={() => {
                                                                setSelectedHousing(housing);
                                                                setIsHousingDialogOpen(true);
                                                            }}
                                                            className="min-h-[44px]"
                                                        >
                                                            <PencilIcon aria-hidden="true" />
                                                            Edit
                                                        </Button>
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            onClick={() =>
                                                                handleDelete(
                                                                    'housing',
                                                                    housing.id,
                                                                    'Housing Characteristics'
                                                                )
                                                            }
                                                            className="min-h-[44px]"
                                                        >
                                                            <TrashIcon aria-hidden="true" />
                                                            Delete
                                                        </Button>
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        ))}
                                    </div>
                                )}
                                <div className="mt-4">
                                    <Button
                                        size="sm"
                                        onClick={() => {
                                            setSelectedHousing(null);
                                            setIsHousingDialogOpen(true);
                                        }}
                                        aria-label="Add housing characteristics"
                                        className="min-h-[44px]"
                                    >
                                        <PlusIcon aria-hidden="true" />
                                        Add Housing Characteristics
                                    </Button>
                                </div>
                            </CardContent>
                        </CollapsibleContent>
                    </Card>
                </Collapsible>

                {/* Agricultural & Livestock Section */}
                <Collapsible open={isHousingBlok2Open} onOpenChange={setIsHousingBlok2Open}>
                    <Card>
                        <CollapsibleTrigger 
                            className="w-full min-h-[44px]"
                            aria-expanded={isHousingBlok2Open}
                            aria-controls="housing-blok2-content"
                        >
                            <CardHeader>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <CardTitle>Agricultural & Livestock Data</CardTitle>
                                        <Badge variant="secondary">
                                            {familyData.keteranganPerumahanBlok2.length} record(s)
                                        </Badge>
                                    </div>
                                    {isHousingBlok2Open ? (
                                        <ChevronUpIcon aria-hidden="true" />
                                    ) : (
                                        <ChevronDownIcon aria-hidden="true" />
                                    )}
                                </div>
                            </CardHeader>
                        </CollapsibleTrigger>
                        <CollapsibleContent id="housing-blok2-content">
                            <CardContent>
                                {familyData.keteranganPerumahanBlok2.length === 0 ? (
                                    <div 
                                        className="p-4 text-center text-muted-foreground"
                                        role="status"
                                    >
                                        No agricultural & livestock data found.
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        {familyData.keteranganPerumahanBlok2.map((blok2) => (
                                            <Card key={blok2.id}>
                                                <CardContent className="pt-6">
                                                    <div className="mb-4">
                                                        <h4 className="font-semibold">Agricultural Land</h4>
                                                    </div>
                                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                                                        <div>
                                                            <p className="text-sm font-medium text-muted-foreground">
                                                                Rice Field Area (m²)
                                                            </p>
                                                            <p className="text-base">
                                                                {blok2.luasPertanianSawah || 'N/A'}
                                                            </p>
                                                        </div>
                                                        <div>
                                                            <p className="text-sm font-medium text-muted-foreground">
                                                                Garden Area (m²)
                                                            </p>
                                                            <p className="text-base">
                                                                {blok2.luasPertanianKebun || 'N/A'}
                                                            </p>
                                                        </div>
                                                        <div>
                                                            <p className="text-sm font-medium text-muted-foreground">
                                                                Pond Area (m²)
                                                            </p>
                                                            <p className="text-base">
                                                                {blok2.luasPertanianKolam || 'N/A'}
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <div className="mb-4">
                                                        <h4 className="font-semibold">Livestock</h4>
                                                    </div>
                                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                                        <div>
                                                            <p className="text-sm font-medium text-muted-foreground">
                                                                Chickens
                                                            </p>
                                                            <p className="text-base">{blok2.ayam || 0}</p>
                                                        </div>
                                                        <div>
                                                            <p className="text-sm font-medium text-muted-foreground">
                                                                Goats
                                                            </p>
                                                            <p className="text-base">{blok2.kambing || 0}</p>
                                                        </div>
                                                        <div>
                                                            <p className="text-sm font-medium text-muted-foreground">
                                                                Cattle
                                                            </p>
                                                            <p className="text-base">{blok2.sapi || 0}</p>
                                                        </div>
                                                    </div>
                                                    <div className="flex flex-col sm:flex-row gap-2 mt-4">
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            onClick={() => {
                                                                setSelectedHousingBlok2(blok2);
                                                                setIsHousingBlok2DialogOpen(true);
                                                            }}
                                                            className="min-h-[44px]"
                                                        >
                                                            <PencilIcon aria-hidden="true" />
                                                            Edit
                                                        </Button>
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            onClick={() =>
                                                                handleDelete(
                                                                    'housingBlok2',
                                                                    blok2.id,
                                                                    'Agricultural & Livestock Data'
                                                                )
                                                            }
                                                            className="min-h-[44px]"
                                                        >
                                                            <TrashIcon aria-hidden="true" />
                                                            Delete
                                                        </Button>
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        ))}
                                    </div>
                                )}
                                <div className="mt-4">
                                    <Button
                                        size="sm"
                                        onClick={() => {
                                            setSelectedHousingBlok2(null);
                                            setIsHousingBlok2DialogOpen(true);
                                        }}
                                        aria-label="Add agricultural and livestock data"
                                        className="min-h-[44px]"
                                    >
                                        <PlusIcon aria-hidden="true" />
                                        Add Agricultural & Livestock Data
                                    </Button>
                                </div>
                            </CardContent>
                        </CollapsibleContent>
                    </Card>
                </Collapsible>

                {/* Assistance Programs Section */}
                <Collapsible open={isBantuanOpen} onOpenChange={setIsBantuanOpen}>
                    <Card>
                        <CollapsibleTrigger 
                            className="w-full min-h-[44px]"
                            aria-expanded={isBantuanOpen}
                            aria-controls="bantuan-content"
                        >
                            <CardHeader>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <CardTitle>Assistance Programs</CardTitle>
                                        <Badge variant="secondary">
                                            {familyData.bantuan.length} record(s)
                                        </Badge>
                                    </div>
                                    {isBantuanOpen ? (
                                        <ChevronUpIcon aria-hidden="true" />
                                    ) : (
                                        <ChevronDownIcon aria-hidden="true" />
                                    )}
                                </div>
                            </CardHeader>
                        </CollapsibleTrigger>
                        <CollapsibleContent id="bantuan-content">
                            <CardContent>
                                {familyData.bantuan.length === 0 ? (
                                    <div 
                                        className="p-4 text-center text-muted-foreground"
                                        role="status"
                                    >
                                        No assistance programs found.
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        {familyData.bantuan.map((bantuan) => (
                                            <Card key={bantuan.id}>
                                                <CardContent className="pt-6">
                                                    <div className="mb-4">
                                                        <p className="text-sm font-medium text-muted-foreground">
                                                            Recipient
                                                        </p>
                                                        <Badge variant="outline">
                                                            {getAnggotaName(bantuan.idAnggotaKeluarga)}
                                                        </Badge>
                                                    </div>
                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                        <div>
                                                            <p className="text-sm font-medium text-muted-foreground">
                                                                Assistance in Last Year
                                                            </p>
                                                            <p className="text-base">
                                                                {bantuan.bantuan1tahunTerakhir ? 'Yes' : 'No'}
                                                            </p>
                                                        </div>
                                                        <div>
                                                            <p className="text-sm font-medium text-muted-foreground">
                                                                PKH
                                                            </p>
                                                            <p className="text-base">
                                                                {bantuan.bantuanPKH ? 'Yes' : 'No'}
                                                            </p>
                                                        </div>
                                                        <div>
                                                            <p className="text-sm font-medium text-muted-foreground">
                                                                BPNT
                                                            </p>
                                                            <p className="text-base">
                                                                {bantuan.bantuanBPNT ? 'Yes' : 'No'}
                                                            </p>
                                                        </div>
                                                        <div>
                                                            <p className="text-sm font-medium text-muted-foreground">
                                                                BOS
                                                            </p>
                                                            <p className="text-base">
                                                                {bantuan.bantuanBOS ? 'Yes' : 'No'}
                                                            </p>
                                                        </div>
                                                        <div>
                                                            <p className="text-sm font-medium text-muted-foreground">
                                                                BAPANAS
                                                            </p>
                                                            <p className="text-base">
                                                                {bantuan.bantuanBAPANAS ? 'Yes' : 'No'}
                                                            </p>
                                                        </div>
                                                        <div>
                                                            <p className="text-sm font-medium text-muted-foreground">
                                                                Stunting
                                                            </p>
                                                            <p className="text-base">
                                                                {bantuan.bantuanStunting ? 'Yes' : 'No'}
                                                            </p>
                                                        </div>
                                                        <div>
                                                            <p className="text-sm font-medium text-muted-foreground">
                                                                KIS
                                                            </p>
                                                            <p className="text-base">
                                                                {bantuan.bantuanKIS ? 'Yes' : 'No'}
                                                            </p>
                                                        </div>
                                                        <div>
                                                            <p className="text-sm font-medium text-muted-foreground">
                                                                BLT
                                                            </p>
                                                            <p className="text-base">
                                                                {bantuan.bantuanBLT ? 'Yes' : 'No'}
                                                            </p>
                                                        </div>
                                                        {bantuan.bantuanlainnyaStatus && (
                                                            <div className="md:col-span-2">
                                                                <p className="text-sm font-medium text-muted-foreground">
                                                                    Other Assistance
                                                                </p>
                                                                <p className="text-base">
                                                                    {bantuan.bantuanlainnyaNama || 'N/A'}
                                                                </p>
                                                            </div>
                                                        )}
                                                    </div>
                                                    <div className="flex flex-col sm:flex-row gap-2 mt-4">
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            onClick={() => {
                                                                setSelectedBantuan(bantuan);
                                                                setIsBantuanDialogOpen(true);
                                                            }}
                                                            className="min-h-[44px]"
                                                        >
                                                            <PencilIcon aria-hidden="true" />
                                                            Edit
                                                        </Button>
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            onClick={() =>
                                                                handleDelete(
                                                                    'bantuan',
                                                                    bantuan.id,
                                                                    'Assistance Program'
                                                                )
                                                            }
                                                            className="min-h-[44px]"
                                                        >
                                                            <TrashIcon aria-hidden="true" />
                                                            Delete
                                                        </Button>
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        ))}
                                    </div>
                                )}
                                <div className="mt-4">
                                    <Button
                                        size="sm"
                                        onClick={() => {
                                            setSelectedBantuan(null);
                                            setIsBantuanDialogOpen(true);
                                        }}
                                        aria-label="Add assistance program"
                                        className="min-h-[44px]"
                                    >
                                        <PlusIcon aria-hidden="true" />
                                        Add Assistance Program
                                    </Button>
                                </div>
                            </CardContent>
                        </CollapsibleContent>
                    </Card>
                </Collapsible>

                {/* Disability Information Section */}
                <Collapsible open={isDisabilitasOpen} onOpenChange={setIsDisabilitasOpen}>
                    <Card>
                        <CollapsibleTrigger 
                            className="w-full min-h-[44px]"
                            aria-expanded={isDisabilitasOpen}
                            aria-controls="disabilitas-content"
                        >
                            <CardHeader>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <CardTitle>Disability Information</CardTitle>
                                        <Badge variant="secondary">
                                            {familyData.disabilitas.length} record(s)
                                        </Badge>
                                    </div>
                                    {isDisabilitasOpen ? (
                                        <ChevronUpIcon aria-hidden="true" />
                                    ) : (
                                        <ChevronDownIcon aria-hidden="true" />
                                    )}
                                </div>
                            </CardHeader>
                        </CollapsibleTrigger>
                        <CollapsibleContent id="disabilitas-content">
                            <CardContent>
                                {familyData.disabilitas.length === 0 ? (
                                    <div 
                                        className="p-4 text-center text-muted-foreground"
                                        role="status"
                                    >
                                        No disability information found.
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        {familyData.disabilitas.map((disabilitas) => (
                                            <Card key={disabilitas.id}>
                                                <CardContent className="pt-6">
                                                    <div className="mb-4">
                                                        <p className="text-sm font-medium text-muted-foreground">
                                                            Family Member
                                                        </p>
                                                        <Badge variant="outline">
                                                            {getAnggotaName(disabilitas.idAnggotaKeluarga)}
                                                        </Badge>
                                                    </div>
                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                        <div>
                                                            <p className="text-sm font-medium text-muted-foreground">
                                                                Has Disability
                                                            </p>
                                                            <p className="text-base">
                                                                {disabilitas.disabilisitas || 'N/A'}
                                                            </p>
                                                        </div>
                                                        <div>
                                                            <p className="text-sm font-medium text-muted-foreground">
                                                                Physical Disability
                                                            </p>
                                                            <p className="text-base">
                                                                {disabilitas.tunaDaksa || 'N/A'}
                                                            </p>
                                                        </div>
                                                        <div>
                                                            <p className="text-sm font-medium text-muted-foreground">
                                                                Speech Disability
                                                            </p>
                                                            <p className="text-base">
                                                                {disabilitas.tunaWicara || 'N/A'}
                                                            </p>
                                                        </div>
                                                        <div>
                                                            <p className="text-sm font-medium text-muted-foreground">
                                                                Visual Disability
                                                            </p>
                                                            <p className="text-base">
                                                                {disabilitas.tunaNetra || 'N/A'}
                                                            </p>
                                                        </div>
                                                        <div>
                                                            <p className="text-sm font-medium text-muted-foreground">
                                                                Mental Disability
                                                            </p>
                                                            <p className="text-base">
                                                                {disabilitas.tunaLaras || 'N/A'}
                                                            </p>
                                                        </div>
                                                        {disabilitas.tunaLainnyaStatus && (
                                                            <div>
                                                                <p className="text-sm font-medium text-muted-foreground">
                                                                    Other Disability
                                                                </p>
                                                                <p className="text-base">
                                                                    {disabilitas.tunaLainnyaNama || 'N/A'}
                                                                </p>
                                                            </div>
                                                        )}
                                                    </div>
                                                    <div className="flex flex-col sm:flex-row gap-2 mt-4">
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            onClick={() => {
                                                                setSelectedDisabilitas(disabilitas);
                                                                setIsDisabilitasDialogOpen(true);
                                                            }}
                                                            className="min-h-[44px]"
                                                        >
                                                            <PencilIcon aria-hidden="true" />
                                                            Edit
                                                        </Button>
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            onClick={() =>
                                                                handleDelete(
                                                                    'disabilitas',
                                                                    disabilitas.id,
                                                                    'Disability Information'
                                                                )
                                                            }
                                                            className="min-h-[44px]"
                                                        >
                                                            <TrashIcon aria-hidden="true" />
                                                            Delete
                                                        </Button>
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        ))}
                                    </div>
                                )}
                                <div className="mt-4">
                                    <Button
                                        size="sm"
                                        onClick={() => {
                                            setSelectedDisabilitas(null);
                                            setIsDisabilitasDialogOpen(true);
                                        }}
                                        aria-label="Add disability information"
                                        className="min-h-[44px]"
                                    >
                                        <PlusIcon aria-hidden="true" />
                                        Add Disability Information
                                    </Button>
                                </div>
                            </CardContent>
                        </CollapsibleContent>
                    </Card>
                </Collapsible>
            </div>

            {/* Keluarga Edit Dialog */}
            <KeluargaDialog
                open={isKeluargaDialogOpen}
                onOpenChange={setIsKeluargaDialogOpen}
                mode="edit"
                initialData={{
                    id: familyData.keluarga.id,
                    namaKepalaKeluarga: familyData.keluarga.namaKepalaKeluarga,
                    anggotaKeluarga: familyData.keluarga.anggotaKeluarga,
                    nomorKartuKeluarga: familyData.keluarga.nomorKartuKeluarga,
                    alamat: familyData.keluarga.alamat,
                    idMFD: familyData.keluarga.idMFD,
                    catatan: familyData.keluarga.catatan,
                }}
                onSuccess={fetchFamilyDetail}
            />

            {/* Anggota Keluarga Dialog */}
            <AnggotaKeluargaDialog
                open={isAnggotaDialogOpen}
                onOpenChange={setIsAnggotaDialogOpen}
                mode={selectedAnggota ? 'edit' : 'create'}
                idKeluarga={keluargaId}
                initialData={
                    selectedAnggota
                        ? {
                              id: selectedAnggota.id,
                              idKeluarga: selectedAnggota.idKeluarga,
                              nomorUrut: selectedAnggota.nomorUrut,
                              namaLengkap: selectedAnggota.namaLengkap,
                              NIK: selectedAnggota.NIK,
                              jenisKelamin: selectedAnggota.jenisKelamin,
                              hubunganKeluarga: selectedAnggota.hubunganKeluarga,
                              statusKawin: selectedAnggota.statusKawin,
                              tempatLahir: selectedAnggota.tempatLahir,
                              tanggalLahir: new Date(selectedAnggota.tanggalLahir),
                              umur: selectedAnggota.umur,
                              agama: selectedAnggota.agama,
                              kartuIdentitas: selectedAnggota.kartuIdentitas,
                              domisili: selectedAnggota.domisili,
                              partisipasiSekolah: selectedAnggota.partisipasiSekolah,
                              tingkatPendidikan: selectedAnggota.tingkatPendidikan,
                              kelasTertinggi: selectedAnggota.kelasTertinggi ?? undefined,
                              ijazahTertinggi: selectedAnggota.ijazahTertinggi ?? undefined,
                          }
                        : undefined
                }
                onSuccess={fetchFamilyDetail}
            />

            {/* Delete Anggota Confirmation Dialog */}
            <AlertDialog open={isDeleteAnggotaDialogOpen} onOpenChange={setIsDeleteAnggotaDialogOpen}>
                <AlertDialogContent role="alertdialog" aria-labelledby="delete-anggota-title" aria-describedby="delete-anggota-description">
                    <AlertDialogHeader>
                        <AlertDialogTitle id="delete-anggota-title">Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription id="delete-anggota-description">
                            This will delete the family member{' '}
                            <span className="font-semibold">{selectedAnggota?.namaLengkap}</span> (NIK:{' '}
                            {selectedAnggota?.NIK}). This action cannot be undone.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel 
                            disabled={isDeletingAnggota}
                            className="min-h-[44px]"
                        >
                            Cancel
                        </AlertDialogCancel>
                        <AlertDialogAction
                            onClick={onDeleteAnggotaConfirm}
                            disabled={isDeletingAnggota}
                            className="bg-destructive text-white hover:bg-destructive/90 min-h-[44px]"
                            aria-label="Confirm delete family member"
                        >
                            {isDeletingAnggota ? 'Deleting...' : 'Delete'}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            {/* Delete Additional Data Confirmation Dialog */}
            <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                <AlertDialogContent role="alertdialog" aria-labelledby="delete-data-title" aria-describedby="delete-data-description">
                    <AlertDialogHeader>
                        <AlertDialogTitle id="delete-data-title">Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription id="delete-data-description">
                            This will delete <span className="font-semibold">{deleteTarget?.name}</span>. This
                            action cannot be undone.
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
                            aria-label="Confirm delete record"
                        >
                            {isDeleting ? 'Deleting...' : 'Delete'}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            {/* Additional Data Dialogs */}
            <KetPetugasDialog
                open={isKetPetugasDialogOpen}
                onOpenChange={setIsKetPetugasDialogOpen}
                mode={selectedKetPetugas ? 'edit' : 'create'}
                idKeluarga={keluargaId}
                initialData={selectedKetPetugas ? { ...selectedKetPetugas } : undefined}
                onSuccess={fetchFamilyDetail}
                onSubmitAction={handleKetPetugasSubmit}
            />

            <KetenagakerjaanDialog
                open={isKetenagakerjaanDialogOpen}
                onOpenChange={setIsKetenagakerjaanDialogOpen}
                mode={selectedKetenagakerjaan ? 'edit' : 'create'}
                idKeluarga={keluargaId}
                initialData={
                    selectedKetenagakerjaan
                        ? {
                              ...selectedKetenagakerjaan,
                              bekerja: selectedKetenagakerjaan.bekerja ?? undefined,
                              lapanganUsaha: selectedKetenagakerjaan.lapanganUsaha ?? undefined,
                              statusPekerjaan: selectedKetenagakerjaan.statusPekerjaan ?? undefined,
                              kegiatanUtama: selectedKetenagakerjaan.kegiatanUtama ?? undefined,
                              lengkap: selectedKetenagakerjaan.lengkap ?? undefined,
                          }
                        : undefined
                }
                onSuccess={fetchFamilyDetail}
                onSubmitAction={handleKetenagakerjaanSubmit}
            />

            <HousingDialog
                open={isHousingDialogOpen}
                onOpenChange={setIsHousingDialogOpen}
                mode={selectedHousing ? 'edit' : 'create'}
                idKeluarga={keluargaId}
                initialData={
                    selectedHousing
                        ? {
                              ...selectedHousing,
                              luasLantai: selectedHousing.luasLantai ?? undefined,
                              statusBangunan: selectedHousing.statusBangunan ?? undefined,
                              buktiKepemilikan: selectedHousing.buktiKepemilikan ?? undefined,
                              sumberAirMinum: selectedHousing.sumberAirMinum ?? undefined,
                              fasilitasBAB: selectedHousing.fasilitasBAB ?? undefined,
                              peneranganUtama: selectedHousing.peneranganUtama ?? undefined,
                              daya: selectedHousing.daya ?? undefined,
                          }
                        : undefined
                }
                onSuccess={fetchFamilyDetail}
                onSubmitAction={handleHousingSubmit}
            />

            <HousingBlok2Dialog
                open={isHousingBlok2DialogOpen}
                onOpenChange={setIsHousingBlok2DialogOpen}
                mode={selectedHousingBlok2 ? 'edit' : 'create'}
                idKeluarga={keluargaId}
                initialData={
                    selectedHousingBlok2
                        ? {
                              ...selectedHousingBlok2,
                              luasPertanianSawah: selectedHousingBlok2.luasPertanianSawah ?? undefined,
                              luasPertanianKebun: selectedHousingBlok2.luasPertanianKebun ?? undefined,
                              luasPertanianKolam: selectedHousingBlok2.luasPertanianKolam ?? undefined,
                              ayam: selectedHousingBlok2.ayam ?? undefined,
                              kambing: selectedHousingBlok2.kambing ?? undefined,
                              sapi: selectedHousingBlok2.sapi ?? undefined,
                          }
                        : undefined
                }
                onSuccess={fetchFamilyDetail}
                onSubmitAction={handleHousingBlok2Submit}
            />

            <BantuanDialog
                open={isBantuanDialogOpen}
                onOpenChange={setIsBantuanDialogOpen}
                mode={selectedBantuan ? 'edit' : 'create'}
                idKeluarga={keluargaId}
                initialData={
                    selectedBantuan
                        ? {
                              ...selectedBantuan,
                              bantuan1tahunTerakhir: selectedBantuan.bantuan1tahunTerakhir ?? undefined,
                              bantuanPKH: selectedBantuan.bantuanPKH ?? undefined,
                              bantuanBPNT: selectedBantuan.bantuanBPNT ?? undefined,
                              bantuanBOS: selectedBantuan.bantuanBOS ?? undefined,
                              bantuanBAPANAS: selectedBantuan.bantuanBAPANAS ?? undefined,
                              bantuanStunting: selectedBantuan.bantuanStunting ?? undefined,
                              bantuanKIS: selectedBantuan.bantuanKIS ?? undefined,
                              bantuanBLT: selectedBantuan.bantuanBLT ?? undefined,
                              bantuanlainnyaStatus: selectedBantuan.bantuanlainnyaStatus ?? undefined,
                              bantuanlainnyaNama: selectedBantuan.bantuanlainnyaNama ?? undefined,
                          }
                        : undefined
                }
                onSuccess={fetchFamilyDetail}
                onSubmitAction={handleBantuanSubmit}
            />

            <DisabilitasDialog
                open={isDisabilitasDialogOpen}
                onOpenChange={setIsDisabilitasDialogOpen}
                mode={selectedDisabilitas ? 'edit' : 'create'}
                idKeluarga={keluargaId}
                initialData={
                    selectedDisabilitas
                        ? {
                              ...selectedDisabilitas,
                              disabilisitas: selectedDisabilitas.disabilisitas ?? undefined,
                              tunaDaksa: selectedDisabilitas.tunaDaksa ?? undefined,
                              tunaWicara: selectedDisabilitas.tunaWicara ?? undefined,
                              tunaNetra: selectedDisabilitas.tunaNetra ?? undefined,
                              tunaLaras: selectedDisabilitas.tunaLaras ?? undefined,
                              tunaLainnyaStatus: selectedDisabilitas.tunaLainnyaStatus ?? undefined,
                              tunaLainnyaNama: selectedDisabilitas.tunaLainnyaNama ?? undefined,
                          }
                        : undefined
                }
                onSuccess={fetchFamilyDetail}
                onSubmitAction={handleDisabilitasSubmit}
            />
        </div>
    );
}
