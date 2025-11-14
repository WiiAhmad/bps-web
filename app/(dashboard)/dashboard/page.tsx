import { getCurrentUser } from '../action';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, MapPin, FileText, Activity } from 'lucide-react';

export default async function DashboardPage() {
    const user = await getCurrentUser();

    const stats = [
        {
            title: 'Total Keluarga',
            value: '0',
            description: 'Jumlah keluarga terdaftar',
            icon: Users,
        },
        {
            title: 'Data MFD',
            value: '0',
            description: 'Master File Desa',
            icon: MapPin,
        },
        {
            title: 'Laporan',
            value: '0',
            description: 'Laporan yang dibuat',
            icon: FileText,
        },
        {
            title: 'Aktivitas',
            value: '0',
            description: 'Aktivitas hari ini',
            icon: Activity,
        },
    ];

    return (
        <div className="flex flex-col gap-6">
            <div>
                <h2 className="text-3xl font-bold tracking-tight">
                    Welcome back, {user?.nama}!
                </h2>
                <p className="text-muted-foreground">
                    Here&apos;s what&apos;s happening with your data today.
                </p>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {stats.map((stat) => (
                    <Card key={stat.title}>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                {stat.title}
                            </CardTitle>
                            <stat.icon className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stat.value}</div>
                            <p className="text-xs text-muted-foreground">
                                {stat.description}
                            </p>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <Card className="col-span-4">
                    <CardHeader>
                        <CardTitle>Overview</CardTitle>
                        <CardDescription>
                            Your dashboard overview and recent activities
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="pl-2">
                        <div className="flex h-[200px] items-center justify-center text-muted-foreground">
                            Dashboard content will be displayed here
                        </div>
                    </CardContent>
                </Card>

                <Card className="col-span-3">
                    <CardHeader>
                        <CardTitle>Recent Activity</CardTitle>
                        <CardDescription>
                            Your recent actions and updates
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="flex h-[200px] items-center justify-center text-muted-foreground">
                            No recent activity
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
