"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, AlertCircle, Database, Settings, Map as MapIcon, Leaf, LogOut } from "lucide-react";

export function Sidebar() {
    const pathname = usePathname();

    const navItems = [
        { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
        { name: "Map View", href: "/map", icon: MapIcon },
        { name: "Alerts", href: "/alerts", icon: AlertCircle },
        { name: "Database", href: "/database", icon: Database },
        { name: "Settings", href: "/settings", icon: Settings },
    ];

    return (
        <div className="flex h-screen w-64 flex-col bg-slate-900 border-r border-slate-800">
            <div className="flex h-16 items-center px-6 border-b border-slate-800 shrink-0">
                <Leaf className="w-6 h-6 text-emerald-500 mr-3" />
                <span className="text-lg font-bold text-slate-100 tracking-tight">Blue Carbon</span>
            </div>

            <div className="flex-1 py-6 px-4 space-y-1 overflow-y-auto">
                {navItems.map((item) => {
                    const isActive = pathname === item.href || (pathname.startsWith(item.href) && item.href !== "/");
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${isActive
                                    ? "bg-emerald-500/10 text-emerald-400"
                                    : "text-slate-400 hover:text-slate-100 hover:bg-slate-800/50"
                                }`}
                        >
                            <item.icon className={`w-5 h-5 ${isActive ? "text-emerald-400" : "text-slate-500"}`} />
                            {item.name}
                        </Link>
                    );
                })}
            </div>

            <div className="p-4 border-t border-slate-800">
                <button className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm font-medium text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors">
                    <LogOut className="w-5 h-5 text-slate-500 group-hover:text-rose-400" />
                    Sign out
                </button>
            </div>
        </div>
    );
}
