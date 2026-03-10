"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    ClipboardList,
    Plus,
    ShoppingBag,
    ArrowRight,
    CheckCircle2,
    Clock,
    Package,
    Trash2,
    Search,
    ChevronDown,
    X,
    FileText
} from 'lucide-react';
import { useHardwareStore, PurchaseOrder, Product } from '@/store/hardwareStore';
import { cn } from '@/lib/utils';

export default function POPage() {
    const { purchaseOrders, vendors, products, addPO, currency } = useHardwareStore();
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

    // New PO State
    const [selectedVendor, setSelectedVendor] = useState(vendors[0]?.id || '');
    const [poItems, setPoItems] = useState<{ productId: string; quantity: number; cost: number }[]>([]);

    const activePOs = purchaseOrders.filter(po => po.status === 'PENDING');
    const historyPOs = purchaseOrders.filter(po => po.status !== 'PENDING');

    const handleAddPoItem = (product: Product) => {
        setPoItems(prev => {
            const existing = prev.find(item => item.productId === product.id);
            if (existing) return prev;
            return [...prev, { productId: product.id, quantity: 1, cost: product.price * 0.8 }];
        });
    };

    const updatePoItem = (id: string, field: 'quantity' | 'cost', value: number) => {
        setPoItems(prev => prev.map(item => item.productId === id ? { ...item, [field]: value } : item));
    };

    const submitPO = () => {
        if (poItems.length === 0 || !selectedVendor) return;
        const total = poItems.reduce((sum, item) => sum + (item.quantity * item.cost), 0);
        const newPO: PurchaseOrder = {
            id: 'PO-' + Math.random().toString(36).substr(2, 6).toUpperCase(),
            vendorId: selectedVendor,
            items: poItems,
            total,
            status: 'PENDING',
            timestamp: Date.now()
        };
        addPO(newPO);
        setIsCreateModalOpen(false);
        setPoItems([]);
    };

    return (
        <div className="space-y-10 animate-in">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6">
                <div>
                    <div className="flex items-center gap-2 text-[#f59e0b] mb-2 font-black uppercase tracking-[4px] text-[10px]">
                        <Package size={14} /> Procurement & Logistics
                    </div>
                    <h1 className="text-5xl font-black text-white font-outfit uppercase tracking-tighter">
                        Stock <span className="text-[#f59e0b]">Inward / PO</span>
                    </h1>
                </div>
                <button
                    onClick={() => setIsCreateModalOpen(true)}
                    className="flex items-center gap-3 premium-gradient px-8 py-4 rounded-2xl text-white font-black shadow-xl shadow-orange-500/20 hover:scale-[1.02] transition-all text-sm uppercase tracking-widest"
                >
                    <Plus size={18} /> New Purchase Order
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Active Orders */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="flex items-center justify-between mb-2">
                        <h3 className="text-xl font-black text-white font-outfit uppercase tracking-tight">Active Transmissions</h3>
                        <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{activePOs.length} Pending</span>
                    </div>

                    <div className="space-y-4">
                        {activePOs.length > 0 ? activePOs.map(po => {
                            const vendor = vendors.find(v => v.id === po.vendorId);
                            return (
                                <div key={po.id} className="glass-card p-8 rounded-[2.5rem] flex items-center justify-between group hover:border-[#f59e0b]/20 transition-all border-white/5">
                                    <div className="flex items-center gap-6">
                                        <div className="w-16 h-16 rounded-[1.5rem] bg-white/5 flex flex-col items-center justify-center text-[#f59e0b]">
                                            <span className="text-[10px] font-black uppercase">PO</span>
                                            <ClipboardList size={24} />
                                        </div>
                                        <div>
                                            <div className="text-white font-black uppercase text-xl tracking-tight mb-1">{po.id}</div>
                                            <div className="text-slate-500 text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                                                {vendor?.name} • {po.items.length} skus
                                            </div>
                                        </div>
                                    </div>

                                    <div className="text-right">
                                        <div className="text-2xl font-black text-white font-outfit">{currency} {po.total.toLocaleString()}</div>
                                        <div className="flex items-center justify-end gap-2 text-orange-500 mt-2">
                                            <Clock size={12} />
                                            <span className="text-[10px] font-black uppercase tracking-widest">Awaiting Receipt</span>
                                        </div>
                                    </div>

                                    <button className="ml-6 flex items-center gap-2 bg-[#f59e0b]/10 hover:bg-[#f59e0b] px-6 py-4 rounded-2xl text-[#f59e0b] hover:text-white font-black text-[10px] uppercase tracking-widest transition-all border border-[#f59e0b]/20">
                                        Mark Received <CheckCircle2 size={16} />
                                    </button>
                                </div>
                            );
                        }) : (
                            <div className="py-20 text-center glass-card rounded-[3rem] border-white/5 opacity-50">
                                <FileText size={40} className="mx-auto text-slate-700 mb-4" />
                                <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">No active purchase orders</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Tracking Area */}
                <div className="glass-card rounded-[3rem] p-10 flex flex-col space-y-10 border-white/5 bg-emerald-500/[0.02]">
                    <h3 className="text-2xl font-black text-white font-outfit uppercase">Inward Flow</h3>

                    <div className="space-y-8 flex-1">
                        <div className="relative pl-10 before:content-[''] before:absolute before:left-4 before:top-2 before:bottom-0 before:w-0.5 before:bg-white/10">
                            {[
                                { status: 'Verified', date: 'Just now', desc: 'System reconciled monthly stock alerts', active: true },
                                { status: 'Ordered', date: '2h ago', desc: 'PO-7821 Transmitted to Bamburi Ltd', active: false },
                                { status: 'Received', date: 'Yesterday', desc: '5,000kg Cement added to inventory', active: false },
                            ].map((step, i) => (
                                <div key={i} className="mb-10 relative last:mb-0">
                                    <div className={cn(
                                        "absolute -left-10 top-1 w-8 h-8 rounded-xl border-2 border-[#0e1624] flex items-center justify-center z-10",
                                        step.active ? "bg-emerald-500 text-white" : "bg-white/10 text-slate-500"
                                    )}>
                                        <CheckCircle2 size={14} />
                                    </div>
                                    <div className="text-xs font-black text-white uppercase tracking-tight mb-1">{step.status}</div>
                                    <div className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mb-2">{step.date}</div>
                                    <p className="text-slate-400 text-xs leading-relaxed">{step.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    <button className="w-full py-5 rounded-2xl bg-white/5 border border-white/10 text-white font-black text-xs uppercase tracking-widest hover:bg-white/10 transition-all">
                        View Procurement logs
                    </button>
                </div>
            </div>

            <AnimatePresence>
                {isCreateModalOpen && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-slate-950/90 backdrop-blur-xl" onClick={() => setIsCreateModalOpen(false)} />
                        <motion.div initial={{ opacity: 0, scale: 0.95, y: 40 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 40 }} className="w-full max-w-4xl glass-card rounded-[3.5rem] bg-[#0c1018] relative z-[101] border-white/10 overflow-hidden flex flex-col h-[85vh]">
                            <div className="bg-[#f59e0b] h-2 w-full" />
                            <div className="p-12 pb-6 border-b border-white/5">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h2 className="text-4xl font-black text-white font-outfit uppercase tracking-tighter">Draft Purchase <span className="text-[#f59e0b]">Order</span></h2>
                                        <div className="flex gap-6 mt-4">
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Select Vendor Partner</label>
                                                <select
                                                    value={selectedVendor} title="select vender partner"
                                                    onChange={(e) => setSelectedVendor(e.target.value)}
                                                    className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white font-bold outline-none focus:border-[#f59e0b] w-64 uppercase tracking-tighter text-sm"
                                                >
                                                    {vendors.map(v => <option key={v.id} value={v.id}>{v.name}</option>)}
                                                </select>
                                            </div>
                                        </div>
                                    </div>
                                    <button onClick={() => setIsCreateModalOpen(false)} className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center text-slate-400 hover:text-white transition-all"><X size={24} /></button>
                                </div>
                            </div>

                            <div className="flex-1 flex overflow-hidden">
                                {/* Search & Select */}
                                <div className="w-1/2 p-8 border-r border-white/5 flex flex-col gap-6">
                                    <div className="relative">
                                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600" size={18} />
                                        <input type="text" placeholder="Search Materials..." className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-6 text-white font-bold outline-none" />
                                    </div>
                                    <div className="flex-1 overflow-y-auto space-y-3 pr-2 custom-scrollbar">
                                        {products.map(p => (
                                            <div key={p.id} onClick={() => handleAddPoItem(p)} className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-[#f59e0b]/30 cursor-pointer flex justify-between items-center group">
                                                <div>
                                                    <div className="text-white font-bold uppercase tracking-tight text-sm">{p.name}</div>
                                                    <div className="text-[10px] text-slate-500 font-black tracking-widest uppercase">{p.category}</div>
                                                </div>
                                                <Plus size={16} className="text-[#f59e0b] opacity-0 group-hover:opacity-100 transition-opacity" />
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Order Summary */}
                                <div className="w-1/2 p-8 flex flex-col gap-6 bg-white/[0.01]">
                                    <h4 className="text-xs font-black text-slate-500 uppercase tracking-[2px]">Order Items</h4>
                                    <div className="flex-1 overflow-y-auto space-y-4 pr-2 custom-scrollbar">
                                        {poItems.map(item => {
                                            const p = products.find(x => x.id === item.productId);
                                            return (
                                                <div key={item.productId} className="p-4 rounded-2xl bg-[#0e1624] border border-white/5 space-y-4">
                                                    <div className="flex justify-between">
                                                        <span className="text-white font-bold text-sm uppercase">{p?.name}</span>
                                                        <button onClick={() => setPoItems(prev => prev.filter(x => x.productId !== item.productId))}><Trash2 size={14} className="text-slate-600 hover:text-red-500" /></button>
                                                    </div>
                                                    <div className="flex gap-4">
                                                        <div className="flex-1">
                                                            <label className="text-[9px] font-black text-slate-600 uppercase tracking-widest block mb-1">Quantity</label>
                                                            <input type="number" className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white font-black" value={item.quantity} onChange={(e) => updatePoItem(item.productId, 'quantity', Number(e.target.value))} />
                                                        </div>
                                                        <div className="flex-1">
                                                            <label className="text-[9px] font-black text-slate-600 uppercase tracking-widest block mb-1">Unit Cost</label>
                                                            <input type="number" className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white font-black" value={item.cost} onChange={(e) => updatePoItem(item.productId, 'cost', Number(e.target.value))} />
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                    <div className="pt-6 border-t border-white/5 space-y-6">
                                        <div className="flex justify-between items-end">
                                            <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Est. Order Value</span>
                                            <span className="text-3xl font-black text-white font-outfit">{currency} {poItems.reduce((s, i) => s + (i.quantity * i.cost), 0).toLocaleString()}</span>
                                        </div>
                                        <button onClick={submitPO} className="w-full premium-gradient py-5 rounded-2xl text-white font-black uppercase tracking-[4px] shadow-xl hover:scale-[1.02] transition-all">Transmit Purchase Order</button>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
