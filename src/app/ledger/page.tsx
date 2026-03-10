"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    BookOpen,
    Plus,
    Search,
    ArrowUpCircle,
    ArrowDownCircle,
    User,
    Calendar,
    Filter,
    X,
    MessageSquare,
    ChevronRight,
    Download
} from 'lucide-react';
import { useHardwareStore, LedgerEntry } from '@/store/hardwareStore';
import { cn } from '@/lib/utils';

export default function LedgerPage() {
    const { ledger, addLedgerEntry, currency } = useHardwareStore();
    const [searchQuery, setSearchQuery] = useState('');
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);

    const [newEntry, setNewEntry] = useState<Partial<LedgerEntry>>({
        contractorName: '',
        description: '',
        amount: 0,
        type: 'DEBIT'
    });

    const handleAddEntry = () => {
        if (!newEntry.contractorName || !newEntry.amount) return;
        const entry: LedgerEntry = {
            id: 'TX-' + Math.random().toString(36).substr(2, 6).toUpperCase(),
            contractorName: newEntry.contractorName!,
            description: newEntry.description || 'General Project Material',
            amount: Number(newEntry.amount),
            type: newEntry.type as 'DEBIT' | 'CREDIT',
            timestamp: Date.now()
        };
        addLedgerEntry(entry);
        setIsAddModalOpen(false);
        setNewEntry({ contractorName: '', description: '', amount: 0, type: 'DEBIT' });
    };

    const filteredLedger = ledger.filter(l =>
        l.contractorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        l.description.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const totalDebit = ledger.filter(l => l.type === 'DEBIT').reduce((s, l) => s + l.amount, 0);
    const totalCredit = ledger.filter(l => l.type === 'CREDIT').reduce((s, l) => s + l.amount, 0);

    return (
        <div className="space-y-10 animate-in">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6">
                <div>
                    <div className="flex items-center gap-2 text-[#f59e0b] mb-2 font-black uppercase tracking-[4px] text-[10px]">
                        <BookOpen size={14} /> Project Accounts & Credit
                    </div>
                    <h1 className="text-5xl font-black text-white font-outfit uppercase tracking-tighter">
                        Contractor <span className="text-[#f59e0b]">Ledger</span>
                    </h1>
                </div>
                <div className="flex gap-4">
                    <button className="flex items-center gap-2 px-6 py-4 rounded-2xl bg-white/5 border border-white/10 text-white font-black text-xs uppercase tracking-widest hover:bg-white/10 transition-all">
                        <Download size={18} /> Export Statements
                    </button>
                    <button
                        onClick={() => setIsAddModalOpen(true)}
                        className="flex items-center gap-3 premium-gradient px-8 py-4 rounded-2xl text-white font-black shadow-xl shadow-orange-500/20 hover:scale-[1.02] transition-all text-sm uppercase tracking-widest"
                    >
                        <Plus size={18} /> Log Material/Credit
                    </button>
                </div>
            </div>

            {/* Quick Balance Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="glass-card p-8 rounded-[2.5rem] bg-red-500/[0.03] border-red-500/10 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/5 blur-[60px] rounded-full -mr-10 -mt-10" />
                    <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Total Outstanding Debit</div>
                    <div className="text-4xl font-black text-white font-outfit">{currency} {totalDebit.toLocaleString()}</div>
                    <div className="mt-4 flex items-center gap-2 text-[10px] text-red-400 font-black uppercase tracking-widest">
                        <ArrowUpCircle size={14} /> High Credit Exposure
                    </div>
                </div>
                <div className="glass-card p-8 rounded-[2.5rem] bg-emerald-500/[0.03] border-emerald-500/10 mt-0">
                    <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Total Project Deposits</div>
                    <div className="text-4xl font-black text-white font-outfit">{currency} {totalCredit.toLocaleString()}</div>
                    <div className="mt-4 flex items-center gap-2 text-[10px] text-emerald-400 font-black uppercase tracking-widest">
                        <ArrowDownCircle size={14} /> Advanced Payments
                    </div>
                </div>
                <div className="glass-card p-8 rounded-[2.5rem] border-white/5 mt-0 flex items-center justify-between">
                    <div>
                        <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Active Accounts</div>
                        <div className="text-4xl font-black text-white font-outfit">{Array.from(new Set(ledger.map(l => l.contractorName))).length}</div>
                    </div>
                    <div className="w-16 h-16 rounded-3xl bg-white/5 flex items-center justify-center text-slate-500">
                        <User size={28} />
                    </div>
                </div>
            </div>

            {/* Statement Ledger */}
            <div className="glass-card rounded-[3rem] p-10 space-y-8 min-h-[500px]">
                <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                    <div className="relative flex-1 w-full">
                        <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-500" size={20} />
                        <input
                            type="text"
                            placeholder="Filter by contractor or project description..."
                            className="w-full bg-white/5 border border-white/10 rounded-[2rem] py-5 pl-16 pr-8 text-white font-bold focus:border-[#f59e0b]/50 transition-all outline-none"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="text-slate-500 text-[10px] uppercase font-black tracking-widest border-b border-white/5">
                                <th className="px-6 py-6 font-black">Transaction ID</th>
                                <th className="px-6 py-6 font-black">Contractor/Entity</th>
                                <th className="px-6 py-6 font-black">Description & Date</th>
                                <th className="px-6 py-6 font-black text-right">Debit (-)</th>
                                <th className="px-6 py-6 font-black text-right">Credit (+)</th>
                                <th className="px-6 py-6 font-black text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {filteredLedger.length > 0 ? filteredLedger.map(entry => (
                                <tr key={entry.id} className="group hover:bg-white/[0.02] transition-colors">
                                    <td className="px-6 py-8">
                                        <span className="text-slate-400 font-mono text-xs font-bold tracking-tighter">#{entry.id}</span>
                                    </td>
                                    <td className="px-6 py-8">
                                        <div className="text-white font-black uppercase text-lg tracking-tight group-hover:text-[#f59e0b] transition-colors">{entry.contractorName}</div>
                                        <div className="flex items-center gap-1 text-[9px] text-slate-500 font-black uppercase tracking-widest mt-1">
                                            <Calendar size={10} /> {new Date(entry.timestamp).toLocaleDateString()}
                                        </div>
                                    </td>
                                    <td className="px-6 py-8 max-w-xs">
                                        <p className="text-slate-400 text-xs font-medium leading-relaxed italic">"{entry.description}"</p>
                                    </td>
                                    <td className="px-6 py-8 text-right font-outfit text-xl font-black">
                                        {entry.type === 'DEBIT' ? <span className="text-red-500">-{currency} {entry.amount.toLocaleString()}</span> : '-'}
                                    </td>
                                    <td className="px-6 py-8 text-right font-outfit text-xl font-black">
                                        {entry.type === 'CREDIT' ? <span className="text-emerald-500">+{currency} {entry.amount.toLocaleString()}</span> : '-'}
                                    </td>
                                    <td className="px-6 py-8 text-right">
                                        <button className="p-3 rounded-xl bg-white/5 text-slate-500 hover:text-white transition-all"><ChevronRight size={18} /></button>
                                    </td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan={6} className="py-24 text-center">
                                        <BookOpen size={40} className="mx-auto text-slate-800 mb-4" />
                                        <p className="text-slate-600 font-black uppercase tracking-widest text-[10px]">No ledger entries discovered in this view</p>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            <AnimatePresence>
                {isAddModalOpen && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-slate-950/90 backdrop-blur-xl" onClick={() => setIsAddModalOpen(false)} />
                        <motion.div initial={{ opacity: 0, scale: 0.95, y: 40 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 40 }} className="w-full max-w-[500px] glass-card rounded-[3.5rem] bg-[#0c1018] relative z-[101] border-white/10 p-12 space-y-10">
                            <div>
                                <h2 className="text-3xl font-black text-white font-outfit uppercase tracking-tighter mb-2">Log <span className="text-[#f59e0b]">Project Entry</span></h2>
                                <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest text-shadow-sm">Direct ledger adjustment for credit or payments</p>
                            </div>

                            <div className="space-y-6">
                                <div className="grid grid-cols-2 gap-3 p-1.5 bg-white/5 rounded-2xl border border-white/5">
                                    <button onClick={() => setNewEntry({ ...newEntry, type: 'DEBIT' })} className={cn("py-3 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all", newEntry.type === 'DEBIT' ? "bg-red-500 text-white shadow-lg" : "text-slate-500")}>Material Debit</button>
                                    <button onClick={() => setNewEntry({ ...newEntry, type: 'CREDIT' })} className={cn("py-3 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all", newEntry.type === 'CREDIT' ? "bg-emerald-500 text-white shadow-lg" : "text-slate-500")}>Payment Credit</button>
                                </div>
                                <div className="form-group">
                                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-4 mb-2 block">Contractor / Project</label>
                                    <input type="text" className="w-full bg-white/5 border border-white/10 rounded-2xl py-5 px-6 text-white font-bold outline-none uppercase tracking-tighter" placeholder="e.g. OTIENO PROJECTS LTD" value={newEntry.contractorName} onChange={(e) => setNewEntry({ ...newEntry, contractorName: e.target.value })} />
                                </div>
                                <div className="form-group">
                                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-4 mb-2 block">Entry Description</label>
                                    <textarea className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-white font-medium outline-none resize-none h-24" placeholder="Briefly describe the transaction..." value={newEntry.description} onChange={(e) => setNewEntry({ ...newEntry, description: e.target.value })} />
                                </div>
                                <div className="form-group">
                                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-4 mb-2 block">Total Amount ({currency})</label>
                                    <input type="number" className="w-full bg-white/5 border border-white/10 rounded-2xl py-6 px-8 text-white font-black text-3xl font-outfit" value={newEntry.amount} onChange={(e) => setNewEntry({ ...newEntry, amount: Number(e.target.value) })} />
                                </div>
                                <button onClick={handleAddEntry} className="w-full premium-gradient py-6 rounded-2xl text-white font-black uppercase tracking-[4px] shadow-2xl hover:scale-[1.02] transition-all">Authenticate Entry</button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
