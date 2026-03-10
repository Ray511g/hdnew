"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Search,
    Plus,
    Handshake,
    Phone,
    Star,
    CreditCard,
    MoreVertical,
    MapPin,
    Filter,
    X,
    CheckCircle2
} from 'lucide-react';
import { useHardwareStore, Vendor } from '@/store/hardwareStore';
import { cn } from '@/lib/utils';

export default function VendorsPage() {
    const { vendors, addVendor, currency } = useHardwareStore();
    const [searchQuery, setSearchQuery] = useState('');
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);

    const [newVendor, setNewVendor] = useState<Partial<Vendor>>({
        name: '',
        contact: '',
        category: '',
        rating: 5,
        balance: 0
    });

    const filteredVendors = vendors.filter(v =>
        v.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        v.category.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleAddVendor = () => {
        if (!newVendor.name) return;
        const vendor: Vendor = {
            id: 'v-' + Math.random().toString(36).substr(2, 5),
            name: newVendor.name!,
            contact: newVendor.contact || 'N/A',
            category: newVendor.category || 'General',
            rating: newVendor.rating || 5,
            balance: newVendor.balance || 0
        };
        addVendor(vendor);
        setIsAddModalOpen(false);
        setNewVendor({ name: '', contact: '', category: '', rating: 5, balance: 0 });
    };

    return (
        <div className="space-y-10 animate-in">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6">
                <div>
                    <div className="flex items-center gap-2 text-[#f59e0b] mb-2 font-black uppercase tracking-[4px] text-[10px]">
                        <Handshake size={14} /> Supply Chain & Partnerships
                    </div>
                    <h1 className="text-5xl font-black text-white font-outfit uppercase tracking-tighter text-shadow-xl">
                        Vendor <span className="text-[#f59e0b]">Network</span>
                    </h1>
                </div>
                <button
                    onClick={() => setIsAddModalOpen(true)}
                    className="flex items-center gap-3 premium-gradient px-8 py-4 rounded-2xl text-white font-black shadow-xl shadow-orange-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all text-sm uppercase tracking-widest"
                >
                    <Plus size={18} /> Add New Partner
                </button>
            </div>

            <div className="relative">
                <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-500" size={20} />
                <input
                    type="text"
                    placeholder="Search suppliers by name or material type..."
                    className="w-full bg-white/5 border border-white/10 rounded-3xl py-6 pl-16 pr-8 text-white font-bold focus:border-[#f59e0b]/50 transition-all outline-none text-lg"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredVendors.map((vendor, i) => (
                    <motion.div
                        key={vendor.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.05 }}
                        className="glass-card p-8 rounded-[2.5rem] relative group border-white/5 hover:border-[#f59e0b]/30 transition-all cursor-pointer"
                    >
                        <div className="flex justify-between items-start mb-6">
                            <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center text-[#f59e0b]">
                                <Handshake size={28} />
                            </div>
                            <div className="flex items-center gap-1 bg-white/5 px-3 py-1.5 rounded-xl">
                                <Star size={12} className="text-yellow-500 fill-yellow-500" />
                                <span className="text-white font-black text-[10px]">{vendor.rating}</span>
                            </div>
                        </div>

                        <h3 className="text-2xl font-black text-white font-outfit uppercase tracking-tight mb-2 group-hover:text-[#f59e0b] transition-colors line-clamp-1">
                            {vendor.name}
                        </h3>
                        <p className="text-slate-500 text-[10px] font-black uppercase tracking-[2px] mb-6">{vendor.category}</p>

                        <div className="space-y-4">
                            <div className="flex items-center gap-3 text-slate-400">
                                <Phone size={14} className="text-[#f59e0b]" />
                                <span className="text-xs font-bold">{vendor.contact}</span>
                            </div>
                            <div className="flex items-center gap-3 text-slate-400">
                                <CreditCard size={14} className="text-[#f59e0b]" />
                                <div className="flex-1 flex justify-between items-center">
                                    <span className="text-xs font-bold uppercase tracking-widest text-[10px]">Account Bal</span>
                                    <span className={cn(
                                        "font-black font-outfit text-sm",
                                        vendor.balance < 0 ? "text-red-500" : "text-emerald-500"
                                    )}>
                                        {currency} {Math.abs(vendor.balance).toLocaleString()}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="mt-8 pt-6 border-t border-white/5 flex gap-2">
                            <button className="flex-1 py-3 rounded-xl bg-white/5 text-white font-black text-[10px] uppercase tracking-widest hover:bg-white/10 transition-all">
                                View Profile
                            </button>
                            <button className="flex-1 py-3 rounded-xl bg-[#f59e0b]/10 text-[#f59e0b] font-black text-[10px] uppercase tracking-widest hover:bg-[#f59e0b]/20 transition-all border border-[#f59e0b]/20">
                                Create PO
                            </button>
                        </div>
                    </motion.div>
                ))}
            </div>

            <AnimatePresence>
                {isAddModalOpen && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 sm:p-0">
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-slate-950/90 backdrop-blur-xl" onClick={() => setIsAddModalOpen(false)} />
                        <motion.div initial={{ opacity: 0, scale: 0.95, y: 40 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 40 }} className="w-full max-w-[550px] glass-card rounded-[3rem] bg-[#0c1018] relative z-[101] border-white/10 p-10 space-y-8">
                            <div className="flex justify-between items-start">
                                <div>
                                    <h2 className="text-3xl font-black text-white font-outfit uppercase tracking-tighter">New Vendor <span className="text-[#f59e0b]">Onboarding</span></h2>
                                    <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest">Register a new supply chain partner</p>
                                </div>
                                <button onClick={() => setIsAddModalOpen(false)} className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-slate-400 hover:text-white transition-all"><X size={20} /></button>
                            </div>

                            <div className="space-y-6">
                                <div className="form-group">
                                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-4 mb-2 block">Company Name</label>
                                    <input type="text" className="w-full bg-white/5 border border-white/10 rounded-2xl py-5 px-6 text-white font-bold outline-none focus:border-[#f59e0b]" placeholder="e.g. BAMBURI CEMENT PLC" value={newVendor.name} onChange={(e) => setNewVendor({ ...newVendor, name: e.target.value })} />
                                </div>
                                <div className="form-group">
                                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-4 mb-2 block">Primary Contact</label>
                                    <input type="text" className="w-full bg-white/5 border border-white/10 rounded-2xl py-5 px-6 text-white font-bold outline-none focus:border-[#f59e0b]" placeholder="+254 XXX XXX XXX" value={newVendor.contact} onChange={(e) => setNewVendor({ ...newVendor, contact: e.target.value })} />
                                </div>
                                <div className="form-group">
                                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-4 mb-2 block">Supply Category</label>
                                    <input type="text" className="w-full bg-white/5 border border-white/10 rounded-2xl py-5 px-6 text-white font-bold outline-none focus:border-[#f59e0b]" placeholder="e.g. CEMENT & CONCRETE" value={newVendor.category} onChange={(e) => setNewVendor({ ...newVendor, category: e.target.value })} />
                                </div>
                                <button onClick={handleAddVendor} className="w-full premium-gradient py-6 rounded-2xl text-white font-black uppercase tracking-[4px] shadow-2xl hover:scale-[1.02] transition-all">Submit Partner</button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
