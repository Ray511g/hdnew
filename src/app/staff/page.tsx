"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    UserCog,
    Plus,
    ShieldCheck,
    Activity,
    MoreVertical,
    Lock,
    Eye,
    UserPlus,
    X,
    Shield,
    Trash2,
    Search
} from 'lucide-react';
import { useHardwareStore, StaffMember } from '@/store/hardwareStore';
import { cn } from '@/lib/utils';

export default function StaffPage() {
    const { staff, updateStaff } = useHardwareStore();
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    const [newStaff, setNewStaff] = useState<Partial<StaffMember>>({
        name: '',
        role: 'CASHIER',
        status: 'ACTIVE'
    });

    const handleAddStaff = () => {
        if (!newStaff.name) return;
        const member: StaffMember = {
            id: 'S-' + Math.random().toString(36).substr(2, 4).toUpperCase(),
            name: newStaff.name!,
            role: newStaff.role as any,
            status: 'ACTIVE',
            lastActive: Date.now()
        };
        updateStaff([...staff, member]);
        setIsAddModalOpen(false);
        setNewStaff({ name: '', role: 'CASHIER' });
    };

    const deleteStaff = (id: string) => {
        if (confirm('Permanently revoke access for this staff member?')) {
            updateStaff(staff.filter(s => s.id !== id));
        }
    };

    const filteredStaff = staff.filter(s => s.name.toLowerCase().includes(searchQuery.toLowerCase()));

    return (
        <div className="space-y-10 animate-in">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6">
                <div>
                    <div className="flex items-center gap-2 text-[#f59e0b] mb-2 font-black uppercase tracking-[4px] text-[10px]">
                        <UserCog size={14} /> Identity & Access Management
                    </div>
                    <h1 className="text-5xl font-black text-white font-outfit uppercase tracking-tighter">
                        Staff <span className="text-[#f59e0b]">Control</span>
                    </h1>
                </div>
                <button
                    onClick={() => setIsAddModalOpen(true)}
                    className="flex items-center gap-3 premium-gradient px-8 py-4 rounded-2xl text-white font-black shadow-xl shadow-orange-500/20 hover:scale-[1.02] transition-all text-sm uppercase tracking-widest"
                >
                    <UserPlus size={18} /> Enroll Staff
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                {/* Stats */}
                <div className="lg:col-span-1 space-y-6">
                    <div className="glass-card p-8 rounded-[2.5rem] bg-orange-500/[0.03] border-orange-500/10">
                        <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Total Enrolled</div>
                        <div className="text-4xl font-black text-white font-outfit">{staff.length}</div>
                        <div className="mt-4 flex items-center gap-2 text-[10px] text-orange-400 font-black uppercase">
                            <Shield size={14} /> Full Access Audit
                        </div>
                    </div>
                    <div className="glass-card p-10 rounded-[2.5rem] border-white/5 space-y-8 bg-white/[0.01]">
                        <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Global Permissions</h4>
                        <div className="space-y-4">
                            {[
                                { label: 'Inventory Write', status: true },
                                { label: 'POS Checkout', status: true },
                                { label: 'Revenue View', status: false },
                                { label: 'eTIMS Sync', status: false },
                            ].map((perm, i) => (
                                <div key={i} className="flex justify-between items-center bg-white/5 px-4 py-3 rounded-xl border border-white/5">
                                    <span className="text-[10px] font-black text-white uppercase tracking-tight">{perm.label}</span>
                                    {perm.status ? <ShieldCheck size={14} className="text-emerald-500" /> : <Lock size={14} className="text-slate-600" />}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Staff List */}
                <div className="lg:col-span-3 space-y-6">
                    <div className="relative">
                        <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-500" size={20} />
                        <input
                            type="text"
                            placeholder="Find staff member..."
                            className="w-full bg-white/5 border border-white/10 rounded-[2rem] py-5 pl-16 pr-8 text-white font-bold transition-all outline-none focus:border-[#f59e0b]/50"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {filteredStaff.map((member, i) => (
                            <motion.div
                                key={member.id}
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: i * 0.05 }}
                                className="glass-card p-8 rounded-[2.5rem] border-white/5 group hover:border-[#f59e0b]/30 transition-all"
                            >
                                <div className="flex justify-between items-start mb-6">
                                    <div className="flex items-center gap-4">
                                        <div className="w-14 h-14 rounded-2xl bg-[#0e1624] flex items-center justify-center text-slate-500 group-hover:bg-[#f59e0b] group-hover:text-white transition-all overflow-hidden relative">
                                            <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                                            <span className="text-lg font-black font-outfit relative z-10">{member.name.charAt(0)}</span>
                                        </div>
                                        <div>
                                            <div className="text-xl font-black text-white uppercase font-outfit tracking-tight">{member.name}</div>
                                            <div className="flex items-center gap-2 mt-1">
                                                <div className={cn("w-1.5 h-1.5 rounded-full", member.status === 'ACTIVE' ? "bg-emerald-500" : "bg-slate-500")} />
                                                <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">{member.role}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <button onClick={() => deleteStaff(member.id)} className="p-2 rounded-xl text-slate-600 hover:text-red-500 hover:bg-red-500/10 transition-all">
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                                <div className="space-y-4 pt-6 border-t border-white/5">
                                    <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-slate-500">
                                        <span>Last Pulse</span>
                                        <span className="text-white">{new Date(member.lastActive).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                    </div>
                                    <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                                        <div className="h-full bg-emerald-500 w-[70%]" />
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>

            <AnimatePresence>
                {isAddModalOpen && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-slate-950/90 backdrop-blur-xl" onClick={() => setIsAddModalOpen(false)} />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 40 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 40 }}
                            className="w-full max-w-[450px] glass-card rounded-[3.5rem] bg-[#0c1018] relative z-[101] border-white/10 p-12 space-y-10"
                        >
                            <div>
                                <h2 className="text-3xl font-black text-white font-outfit uppercase tracking-tighter mb-2">Enroll <span className="text-[#f59e0b]">New Guard</span></h2>
                                <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest">Assign roles and system permissions</p>
                            </div>

                            <div className="space-y-6">
                                <div className="form-group font-black">
                                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-4 mb-2 block">Full Legal Name</label>
                                    <input type="text" className="w-full bg-white/5 border border-white/10 rounded-2xl py-5 px-6 text-white font-bold outline-none focus:border-[#f59e0b]" placeholder="John Doe" value={newStaff.name} onChange={(e) => setNewStaff({ ...newStaff, name: e.target.value })} />
                                </div>
                                <div className="form-group">
                                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-4 mb-2 block">System Role Assignment</label>
                                    <select
                                        title='select vender partner'
                                        value={newStaff.role}
                                        onChange={(e) => setNewStaff({ ...newStaff, role: e.target.value })}
                                        className="w-full bg-white/5 border border-white/10 rounded-2xl py-5 px-6 text-white font-bold outline-none focus:border-[#f59e0b] uppercase tracking-tighter"
                                    >
                                        <option value="CASHIER">Standard Cashier</option>
                                        <option value="MANAGER">Inventory Manager</option>
                                        <option value="ADMIN">System Administrator</option>
                                    </select>
                                </div>
                                <button onClick={handleAddStaff} className="w-full premium-gradient py-6 rounded-2xl text-white font-black uppercase tracking-[4px] shadow-2xl hover:scale-[1.02] transition-all">Authorize Access</button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
