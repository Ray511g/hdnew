"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
    LayoutDashboard as BarChart3,
    ShoppingCart as POSIcon,
    Package as InventoryIcon,
    Handshake as VendorIcon,
    ClipboardList as StockIcon,
    BookOpen as LedgerIcon,
    TrendingUp as ProfitIcon,
    UserCog as StaffIcon,
    Scale as TaxIcon,
    Settings as ConfigIcon,
    Menu,
    X,
    Hammer
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

const menuItems = [
    { icon: BarChart3, label: 'Dashboard', href: '/' },
    { icon: POSIcon, label: 'POS Terminal', href: '/pos' },
    { icon: InventoryIcon, label: 'Inventory & Audit', href: '/inventory' },
    { icon: VendorIcon, label: 'Vendor Network', href: '/vendors' },
    { icon: StockIcon, label: 'Stock Inward / PO', href: '/po' },
    { icon: LedgerIcon, label: 'Contractor Ledger', href: '/ledger' },
    { icon: ProfitIcon, label: 'Profit & Loss', href: '/profit' },
    { icon: StaffIcon, label: 'Staff Control', href: '/staff' },
    { icon: TaxIcon, label: 'Tax & Reports', href: '/reports' },
    { icon: ConfigIcon, label: 'Business Config', href: '/settings' },
];

export default function Sidebar() {
    const pathname = usePathname();
    const [isMobileOpen, setIsMobileOpen] = useState(false);
    const [isCollapsed, setIsCollapsed] = useState(false);

    // Close mobile menu on route change
    useEffect(() => {
        setIsMobileOpen(false);
    }, [pathname]);

    const SidebarContent = () => (
        <div className="flex flex-col h-full">
            {/* Logo Section */}
            <div className="p-8 flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-[#f59e0b] flex items-center justify-center text-white shadow-lg shadow-orange-500/20 flex-shrink-0">
                    <Hammer size={24} />
                </div>
                {(!isCollapsed || isMobileOpen) && (
                    <div className="font-outfit text-2xl font-black tracking-tight flex items-center">
                        <span className="text-white">Hardware</span>
                        <span className="text-[#f59e0b]">PRO</span>
                    </div>
                )}
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-4 space-y-1 mt-6">
                {menuItems.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                        <Link key={item.href} href={item.href}>
                            <div className={cn(
                                "flex items-center gap-4 p-4 rounded-2xl transition-all group relative duration-200",
                                isActive
                                    ? "bg-white/[0.05] text-[#f59e0b] shadow-[inset_0_1px_0_0_rgba(255,255,255,0.05)]"
                                    : "text-slate-400 hover:text-white hover:bg-white/[0.02]"
                            )}>
                                <item.icon size={22} className={cn(
                                    "transition-colors flex-shrink-0",
                                    isActive ? "text-[#f59e0b]" : "group-hover:text-white"
                                )} />
                                {(!isCollapsed || isMobileOpen) && (
                                    <span className="font-bold text-[15px] tracking-tight">{item.label}</span>
                                )}

                                {/* Active Indicator Bar */}
                                {isActive && !isMobileOpen && !isCollapsed && (
                                    <motion.div
                                        layoutId="sidebar-nav-indicator"
                                        className="absolute left-0 w-1 h-6 bg-[#f59e0b] rounded-r-full"
                                    />
                                )}
                            </div>
                        </Link>
                    );
                })}
            </nav>

            {/* User Info / Footer */}
            <div className="p-6 border-t border-white/5">
                <div className={cn(
                    "bg-white/[0.03] rounded-2xl p-4 flex items-center gap-3 transition-all",
                    isCollapsed && !isMobileOpen ? "justify-center px-2" : ""
                )}>
                    <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center text-slate-400 font-black text-xs flex-shrink-0">
                        HD
                    </div>
                    {(!isCollapsed || isMobileOpen) && (
                        <div className="flex-1 overflow-hidden">
                            <p className="text-xs font-black text-white truncate uppercase">Live Admin</p>
                            <p className="text-[10px] text-slate-500 font-bold truncate">Branch #450</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );

    return (
        <>
            {/* Mobile Toggle Button */}
            <button
                onClick={() => setIsMobileOpen(!isMobileOpen)}
                className="lg:hidden fixed top-6 right-6 z-[60] w-12 h-12 rounded-2xl bg-orange-500 flex items-center justify-center text-white shadow-xl shadow-orange-500/20"
            >
                {isMobileOpen ? <X size={24} /> : <Menu size={24} />}
            </button>

            {/* Sidebar Desktop */}
            <aside className={cn(
                "hidden lg:flex flex-col h-screen bg-[#0e1624] border-r border-white/5 transition-all duration-300 z-50 sticky top-0",
                isCollapsed ? "w-24" : "w-80"
            )}>
                <SidebarContent />

                {/* Desktop Collapse Toggle */}
                <button
                    onClick={() => setIsCollapsed(!isCollapsed)}
                    className="absolute -right-4 top-10 w-8 h-8 bg-[#0e1624] border border-white/10 rounded-full flex items-center justify-center text-slate-400 hover:text-white shadow-xl transition-all z-[60]"
                >
                    {isCollapsed ? <Menu size={14} /> : <X size={14} />}
                </button>
            </aside>

            {/* Mobile Sidebar Overlay */}
            <AnimatePresence>
                {isMobileOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsMobileOpen(false)}
                            className="lg:hidden fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-[50]"
                        />
                        <motion.div
                            initial={{ x: "-100%" }}
                            animate={{ x: 0 }}
                            exit={{ x: "-100%" }}
                            transition={{ type: "spring", damping: 25, stiffness: 200 }}
                            className="lg:hidden fixed inset-y-0 left-0 w-[85%] max-w-sm bg-[#0e1624] border-r border-white/5 z-[55] shadow-2xl"
                        >
                            <SidebarContent />
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </>
    );
}

