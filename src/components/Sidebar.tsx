"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
    LayoutDashboard,
    ShoppingBag,
    Package,
    Users,
    BarChart3,
    Settings,
    CloudSync,
    Wallet,
    Menu,
    X,
    Hammer
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', href: '/' },
    { icon: ShoppingBag, label: 'Sales/POS', href: '/pos' },
    { icon: Package, label: 'Inventory', href: '/inventory' },
    { icon: Wallet, label: 'Payments', href: '/payments' },
    { icon: Users, label: 'Customers', href: '/customers' },
    { icon: CloudSync, label: 'eTIMS Sync', href: '/etims' },
    { icon: BarChart3, label: 'Analytics', href: '/reports' },
    { icon: Settings, label: 'Settings', href: '/settings' },
];

export default function Sidebar() {
    const pathname = usePathname();
    const [isCollapsed, setIsCollapsed] = useState(false);

    return (
        <aside className={cn(
            "h-screen bg-slate-950 border-r border-white/5 flex flex-col transition-all duration-300 relative group",
            isCollapsed ? "w-20" : "w-64"
        )}>
            {/* Logo Section */}
            <div className="p-6 flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-orange-500 flex items-center justify-center text-white shadow-lg shadow-orange-500/20">
                    <Hammer size={24} />
                </div>
                {!isCollapsed && (
                    <motion.div
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="font-black text-white text-xl tracking-tighter"
                    >
                        HPRO <span className="text-orange-500">POS</span>
                    </motion.div>
                )}
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-3 space-y-1 mt-6">
                {menuItems.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                        <Link key={item.href} href={item.href}>
                            <div className={cn(
                                "flex items-center gap-3 p-3 rounded-xl transition-all group relative",
                                isActive
                                    ? "bg-white/5 text-orange-500 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.05)]"
                                    : "text-slate-400 hover:text-white hover:bg-white/[0.02]"
                            )}>
                                <item.icon size={22} className={cn(
                                    "transition-colors",
                                    isActive ? "text-orange-500" : "group-hover:text-white"
                                )} />
                                {!isCollapsed && (
                                    <span className="font-bold text-sm tracking-tight">{item.label}</span>
                                )}

                                {/* Active Indicator */}
                                {isActive && (
                                    <motion.div
                                        layoutId="sidebar-nav-indicator"
                                        className="absolute left-0 w-1 h-6 bg-orange-500 rounded-r-full"
                                    />
                                )}
                            </div>
                        </Link>
                    );
                })}
            </nav>

            {/* User Information / Footer */}
            <div className="p-4 border-t border-white/5">
                <div className={cn(
                    "bg-white/5 rounded-2xl p-4 flex items-center gap-3",
                    isCollapsed ? "justify-center" : ""
                )}>
                    <div className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center text-slate-400 font-black text-xs">
                        AD
                    </div>
                    {!isCollapsed && (
                        <div className="flex-1 overflow-hidden">
                            <p className="text-xs font-black text-white truncate uppercase">Hardware Admin</p>
                            <p className="text-[10px] text-slate-500 font-bold truncate">Live Store #001</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Collapse Toggle */}
            <button
                onClick={() => setIsCollapsed(!isCollapsed)}
                className="absolute -right-4 top-10 w-8 h-8 bg-slate-950 border border-white/10 rounded-full flex items-center justify-center text-slate-400 hover:text-white shadow-xl shadow-black transition-all"
            >
                {isCollapsed ? <Menu size={14} /> : <X size={14} />}
            </button>
        </aside>
    );
}
