"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
    CloudSync,
    ShieldCheck,
    AlertCircle,
    CheckCircle2,
    FileText,
    RefreshCw,
    Download,
    Zap
} from 'lucide-react';
import { useHardwareStore } from '@/store/hardwareStore';
import { cn } from '@/lib/utils';

export default function ETIMSPage() {
    const { sales, businessName } = useHardwareStore();
    const [isSyncing, setIsSyncing] = useState(false);

    const pendingSales = sales.filter(s => s.etimsStatus === 'PENDING');
    const syncedSales = sales.filter(s => s.etimsStatus === 'SYNCED');

    const handleSync = () => {
        setIsSyncing(true);
        setTimeout(() => {
            // This is a simulation of the KRA eTIMS API sync
            setIsSyncing(false);
            alert('Batch synchronization complete. ' + pendingSales.length + ' invoices transmitted to KRA.');
        }, 2500);
    };

    return (
        <div className="space-y-10 animate-in">
            {/* Header */}
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6">
                <div>
                    <div className="flex items-center gap-2 text-blue-400 mb-2 font-black uppercase tracking-[4px] text-[10px]">
                        <ShieldCheck size={14} /> KRA eTIMS VSCU Integration
                    </div>
                    <h1 className="text-5xl font-black text-white font-outfit uppercase tracking-tighter">
                        Tax <span className="text-blue-400">Compliance Hub</span>
                    </h1>
                </div>

                <div className="flex gap-4">
                    <button
                        disabled={isSyncing || pendingSales.length === 0}
                        onClick={handleSync}
                        className="flex items-center gap-2 px-8 py-4 rounded-2xl bg-blue-500 text-white font-black text-xs uppercase tracking-widest shadow-xl shadow-blue-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50"
                    >
                        {isSyncing ? <RefreshCw className="animate-spin" size={18} /> : <Zap size={18} />}
                        Sync Pending Invoices
                    </button>
                </div>
            </div>

            {/* Status Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="glass-card p-8 rounded-[2.5rem] border-blue-500/10">
                    <div className="flex justify-between items-start mb-6">
                        <div className="p-3 rounded-2xl bg-blue-500/10 text-blue-400">
                            <CloudSync size={24} />
                        </div>
                        <span className="flex items-center gap-2 text-emerald-400 text-[10px] font-black uppercase tracking-widest">
                            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" /> Live Link
                        </span>
                    </div>
                    <div className="text-[10px] font-black text-slate-500 uppercase tracking-[2px] mb-1">VSCU Connection</div>
                    <div className="text-2xl font-black text-white font-outfit uppercase tracking-tight">Active & Healthy</div>
                </div>

                <div className="glass-card p-8 rounded-[2.5rem] border-orange-500/10">
                    <div className="p-3 rounded-2xl bg-orange-500/10 text-orange-400 w-fit mb-6">
                        <AlertCircle size={24} />
                    </div>
                    <div className="text-[10px] font-black text-slate-500 uppercase tracking-[2px] mb-1">Pending Transmission</div>
                    <div className="text-2xl font-black text-white font-outfit uppercase tracking-tight">{pendingSales.length} Documents</div>
                </div>

                <div className="glass-card p-8 rounded-[2.5rem] border-emerald-500/10">
                    <div className="p-3 rounded-2xl bg-emerald-500/10 text-emerald-400 w-fit mb-6">
                        <CheckCircle2 size={24} />
                    </div>
                    <div className="text-[10px] font-black text-slate-500 uppercase tracking-[2px] mb-1">Total Certified</div>
                    <div className="text-2xl font-black text-white font-outfit uppercase tracking-tight">{syncedSales.length} Invoices</div>
                </div>
            </div>

            {/* Recent Logs */}
            <div className="glass-card rounded-[3rem] p-10 space-y-8">
                <div className="flex justify-between items-center">
                    <h3 className="text-2xl font-black text-white font-outfit uppercase tracking-tight">Compliance Ledger</h3>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="text-slate-500 text-[10px] uppercase font-black tracking-[2px] border-b border-white/5">
                                <th className="pb-4">CU Invoice Number</th>
                                <th className="pb-4">Internal Ref</th>
                                <th className="pb-4">Transmission Date</th>
                                <th className="pb-4">Status</th>
                                <th className="pb-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {syncedSales.length > 0 ? syncedSales.map(sale => (
                                <tr key={sale.id} className="group">
                                    <td className="py-6 font-mono text-blue-400 font-bold text-sm tracking-tighter">
                                        {sale.etimsInvoiceNumber || `KRA-${sale.id}-VALID`}
                                    </td>
                                    <td className="py-6 text-slate-400 font-bold text-xs">#{sale.id}</td>
                                    <td className="py-6 text-slate-500 text-xs font-black uppercase tracking-widest">
                                        {new Date(sale.timestamp).toLocaleDateString()}
                                    </td>
                                    <td className="py-6">
                                        <div className="flex items-center gap-2">
                                            <CheckCircle2 size={14} className="text-emerald-500" />
                                            <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">Certified</span>
                                        </div>
                                    </td>
                                    <td className="py-6 text-right">
                                        <button className="p-2 rounded-xl bg-white/5 text-slate-500 hover:text-white hover:bg-white/10 transition-all">
                                            <Download size={14} />
                                        </button>
                                    </td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan={5} className="py-20 text-center">
                                        <div className="bg-white/5 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 text-slate-700">
                                            <FileText size={32} />
                                        </div>
                                        <div className="text-slate-600 font-black uppercase tracking-widest text-[10px]">No transmitted documents found</div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
