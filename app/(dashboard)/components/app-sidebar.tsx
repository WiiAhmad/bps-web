"use client"

import * as React from "react"
import {
    Shield,
    LayoutDashboard,
    Users,
    Settings,
    Frame,
    PieChart,
    Map,
} from "lucide-react"

import { NavMain } from "./nav-items"
import { NavProjects } from "./nav-projects"
import { NavUser } from "./nav-user"
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarRail,
    SidebarMenu,
    SidebarMenuItem,
    SidebarMenuButton,
} from "@/components/ui/sidebar"

// Navigation data structure
const data = {
    navMain: [
        {
            title: "Dashboard",
            url: "/dashboard",
            icon: LayoutDashboard,
            isActive: true,
            items: [
                {
                    title: "Overview",
                    url: "/dashboard",
                },
                {
                    title: "Analytics",
                    url: "/dashboard/analytics",
                },
            ],
        },
        {
            title: "Users",
            url: "/dashboard/users",
            icon: Users,
            items: [
                {
                    title: "All Users",
                    url: "/dashboard/users",
                },
            ],
        },
        {
            title: "Master File Desa",
            url: "/dashboard/mfd",
            icon: Users,
            items: [
                {
                    title: "Default mfd",
                    url: "/dashboard/mfd",
                },
            ],
        },
        {
            title: "Access Control",
            url: "/dashboard/access-control",
            icon: Shield,
            items: [
                {
                    title: "Permissions",
                    url: "/dashboard/access-control/permissions",
                },
                {
                    title: "Roles",
                    url: "/dashboard/access-control/roles",
                },
                {
                    title: "Policies",
                    url: "/dashboard/access-control/policies",
                },
            ],
        },
        {
            title: "Settings",
            url: "/dashboard/settings",
            icon: Settings,
            items: [
                {
                    title: "General",
                    url: "/dashboard/settings",
                },
                {
                    title: "Profile",
                    url: "/dashboard/profile",
                },
                {
                    title: "Security",
                    url: "/dashboard/settings/security",
                },
            ],
        },
    ],
    projects: [
        {
            name: "Reports",
            url: "/dashboard/reports",
            icon: Frame,
        },
        {
            name: "Analytics",
            url: "/dashboard/analytics",
            icon: PieChart,
        },
        {
            name: "Activity Log",
            url: "/dashboard/activity",
            icon: Map,
        },
    ],
}

interface AppSidebarProps extends React.ComponentProps<typeof Sidebar> {
    user: {
        id: number
        nama: string
        email: string
        photo?: string
        role: string
    }
}

export function AppSidebar({ user, ...props }: AppSidebarProps) {
    return (
        <Sidebar collapsible="icon" {...props}>
            <SidebarHeader className="border-b">
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <a href="/dashboard">
                                <div className="flex aspect-square size-10 items-center justify-center rounded-lg text-sidebar-primary-foreground border rounded">
                                    <Shield className="size-6" />
                                </div>
                                <div className="grid flex-1 text-left text-sm leading-tight">
                                    <span className="truncate font-semibold">
                                        Dashboard
                                    </span>
                                    {/* <span className="truncate text-xs">
                                        Access Control System
                                    </span> */}
                                </div>
                            </a>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>
            <SidebarContent>
                <NavMain items={data.navMain} />
                <NavProjects projects={data.projects} />
            </SidebarContent>
            <SidebarFooter>
                <NavUser user={user} />
            </SidebarFooter>
            <SidebarRail />
        </Sidebar>
    )
}
