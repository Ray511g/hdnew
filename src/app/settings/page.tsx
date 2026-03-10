"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
    Settings,
    Home,
    Globe,
    Coins,
    Save,
    ShieldAlert,
    Bell,
    Database,
    Key,
    UserCheck,
    Cloud
} from 'lucide-react';
import { useHardwareStore } from '@/store/hardwareStore';
import { cn } from '@/lib/utils';

export default function SettingsPage() {
    const { businessName, currency, branchId, updateSettings } = useHardwareStore();
    const [form, setForm] = useState({ businessName, currency, branchId });
    const [isSaving, setIsSaving] = useState(false);

    const handleSave = () => {
        setIsSaving(true);
        setTimeout(() => {
            updateSettings(form);
            setIsSaving(false);
            alert('Core configurations synchronized successfully.');
        }, 1500);
    };

    return (
        <div className="space-y-10 animate-in">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6">
                <div>
                    <div className="flex items-center gap-2 text-[#f59e0b] mb-2 font-black uppercase tracking-[4px] text-[10px]">
                        <Settings size={14} /> System Core & Global Parameters
                    </div>
                    <h1 className="text-5xl font-black text-white font-outfit uppercase tracking-tighter">
                        Business <span className="text-[#f59e0b]">Config</span>
                    </h1>
                </div>
                <button
                    onClick={handleSave}
                    disabled={isSaving}
                    className="flex items-center gap-3 premium-gradient px-12 py-5 rounded-2xl text-white font-black shadow-xl shadow-orange-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all text-sm uppercase tracking-widest disabled:opacity-50"
                >
                    {isSaving ? "Syncing..." : <><Save size={18} /> Push Updates</>}
                </button>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-12 gap-10">
                {/* Navigation Menu */}
                <div className="xl:col-span-3 space-y-2">
                    {[
                        { icon: Home, label: 'General Identity', active: true },
                        { icon: Coins, label: 'Fiscal & Currency', active: false },
                        { icon: Cloud, label: 'eTIMS / KRA API', active: false },
                        { icon: Bell, label: 'Notif Systems', active: false },
                        { icon: UserCheck, label: 'Sec Roles', active: false },
                        { icon: Database, label: 'Backup / Cloud', active: false },
                    ].map((item, i) => (
                        <div key={i} className={cn(
                            "flex items-center gap-4 p-5 rounded-2xl transition-all cursor-pointer group",
                            item.active ? "bg-[#f59e0b]/10 text-[#f59e0b] border border-[#f59e0b]/20" : "text-slate-500 hover:text-white hover:bg-white/5"
                        )}>
                            <item.icon size={20} className={cn(item.active ? "text-[#f59e0b]" : "text-slate-600 group-hover:text-slate-400")} />
                            <span className="font-black uppercase tracking-widest text-[10px]">{item.label}</span>
                        </div>
                    ))}
                </div>

                {/* Form Area */}
                <div className="xl:col-span-9 space-y-8">
                    <div className="glass-card rounded-[3.5rem] p-12 border-white/5 space-y-12">
                        <div>
                            <h3 className="text-2xl font-black text-white font-outfit uppercase tracking-tight mb-2">Corporate <span className="text-[#f59e0b]">Identity</span></h3>
                            <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest">Global business metadata used across receipts and audits</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-3">
                                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-4">Authorized Business Name</label>
                                <div className="relative">
                                    <Globe className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-700" size={18} />
                                    <input
                                        type="text"
                                        className="w-full bg-white/5 border border-white/10 rounded-2xl py-5 pl-16 pr-8 text-white font-black text-lg outline-none focus:border-[#f59e0b] transition-all"
                                        value={form.businessName}
                                        onChange={(e) => setForm({ ...form, businessName: e.target.value })}
                                    />
                                </div>
                            </div>
                            <div className="space-y-3">
                                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-4">Branch Registry ID</label>
                                <div className="relative">
                                    <Key className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-700" size={18} />
                                    <input
                                        type="text"
                                        className="w-full bg-white/5 border border-white/10 rounded-2xl py-5 pl-16 pr-8 text-white font-black text-lg outline-none focus:border-[#f59e0b] transition-all font-mono"
                                        value={form.branchId}
                                        onChange={(e) => setForm({ ...form, branchId: e.target.value })}
                                    />
                                </div>
                            </div>
                            <div className="space-y-3">
                                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-4">Primary Account Currency</label>
                                <select
                                    title='primary account currentsy'
                                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-5 px-8 text-white font-black text-lg outline-none focus:border-[#f59e0b] transition-all uppercase tracking-tighter"
                                    value={form.currency}
                                    onChange={(e) => setForm({ ...form, currency: e.target.value })}
                                >
                                    <option value="KSh">Kenyan Shilling (KSh)</option>
                                    <option value="USD">United States Dollar ($)</option>
                                    <option value="GBP">British Pound (£)</option>
                                    <option value="EUR">Euro (€)</option>
                                </select>
                            </div>
                        </div>

                        <div className="p-8 rounded-3xl bg-red-500/[0.03] border border-red-500/10 flex items-start gap-6">
                            <div className="p-4 rounded-2xl bg-red-500/10 text-red-500">
                                <ShieldAlert size={24} />
                            </div>
                            <div>
                                <h4 className="text-white font-black uppercase text-xs tracking-widest mb-2 font-black">Security Protocol 408</h4>
                                <p className="text-slate-500 text-xs font-medium leading-relaxed max-w-2xl">Updating the business name or branch ID will trigger a re-validation of your active <span className="text-white font-black">eTIMS VSCU link</span>. Ensure all current transactions are synced before proceeding.</p>
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-end gap-4">
                        <button className="px-8 py-4 rounded-xl text-slate-500 font-bold text-xs uppercase tracking-widest hover:text-white transition-all">Restore Defaults</button>
                    </div>
                </div>
            </div>
        </div>
    );
}
