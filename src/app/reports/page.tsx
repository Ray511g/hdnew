"use client";

import React from 'react';
import { motion } from 'framer-motion';
import {
    TrendingUp,
    TrendingDown,
    DollarSign,
    Calendar,
    Download,
    ArrowUpRight,
    ArrowDownRight,
    BarChart3,
    PieChart as PieIcon,
    Layers,
    Activity
} from 'lucide-react';
import { useHardwareStore } from '@/store/hardwareStore';
import { cn } from '@/lib/utils';

export default function ReportsPage() {
    const { sales, products, currency } = useHardwareStore();

    const totalRevenue = sales.reduce((sum, s) => sum + s.total, 0);
    const totalTransactions = sales.length;
    const avgOrderValue = totalTransactions > 0 ? totalRevenue / totalTransactions : 0;

    const inventoryValue = products.reduce((sum, p) => sum + (p.price * p.stock), 0);

    const stats = [
        { label: 'Gross Revenue', value: `${currency} ${totalRevenue.toLocaleString()}`, trend: '+12.5%', icon: DollarSign, color: 'text-emerald-500' },
        { label: 'Avg Sale Value', value: `${currency} ${avgOrderValue.toFixed(0)}`, trend: '+5.2%', icon: Activity, color: 'text-blue-500' },
        { label: 'Total Sales', value: totalTransactions.toString(), trend: '+8.1%', icon: TrendingUp, color: 'text-orange-500' },
        { label: 'Inventory Value', value: `${currency} ${inventoryValue.toLocaleString()}`, trend: '-2.4%', icon: Layers, color: 'text-purple-500' },
    ];

    return (
        <div className="space-y-10 animate-in">
            {/* Header */}
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6">
                <div>
                    <div className="flex items-center gap-2 text-orange-500 mb-2 font-black uppercase tracking-[4px] text-[10px]">
                        <BarChart3 size={14} /> Intelligence & Fiscal Analytics
                    </div>
                    <h1 className="text-5xl font-black text-white font-outfit uppercase tracking-tighter">
                        Revenue <span className="text-orange-500">Audit Center</span>
                    </h1>
                </div>

                <div className="flex gap-4">
                    <button className="flex items-center gap-2 px-6 py-4 rounded-2xl bg-white/5 border border-white/10 text-white font-black text-xs uppercase tracking-widest hover:bg-white/10 transition-all">
                        <Calendar size={18} /> Select Period
                    </button>
                    <button className="flex items-center gap-2 px-8 py-4 rounded-2xl premium-gradient text-white font-black text-xs uppercase tracking-widest shadow-xl shadow-orange-500/20 hover:scale-[1.02] transition-all">
                        <Download size={18} /> Export Audit
                    </button>
                </div>
            </div>

            {/* Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="glass-card p-8 rounded-[2.5rem] relative group border-white/5"
                    >
                        <div className="p-3 rounded-2xl bg-white/5 w-fit mb-6">
                            <stat.icon size={22} className={stat.color} />
                        </div>
                        <div className="text-[10px] font-black text-slate-500 uppercase tracking-[2px] mb-1">{stat.label}</div>
                        <div className="text-3xl font-black text-white font-outfit truncate">{stat.value}</div>

                        <div className={cn(
                            "mt-4 flex items-center gap-1 text-[10px] font-black uppercase",
                            stat.trend.startsWith('+') ? "text-emerald-500" : "text-red-500"
                        )}>
                            {stat.trend.startsWith('+') ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                            {stat.trend} vs last month
                        </div>
                    </motion.div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Sales Ledger */}
                <div className="lg:col-span-2 glass-card rounded-[3rem] p-10 space-y-8">
                    <div className="flex justify-between items-center">
                        <h3 className="text-2xl font-black text-white font-outfit uppercase tracking-tight">Recent Fiscal Transactions</h3>
                        <button className="text-xs font-black text-orange-500 uppercase tracking-widest hover:underline transition-all">Full Ledger</button>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="text-slate-500 text-[10px] uppercase font-black tracking-[2px] border-b border-white/5">
                                    <th className="pb-4">Reference</th>
                                    <th className="pb-4">Entity/Customer</th>
                                    <th className="pb-4">Payment</th>
                                    <th className="pb-4">eTIMS</th>
                                    <th className="pb-4 text-right">Amount</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {sales.length > 0 ? sales.map(sale => (
                                    <tr key={sale.id} className="group hover:bg-white/[0.02] transition-colors">
                                        <td className="py-6">
                                            <div className="text-white font-bold text-sm tracking-tight">#{sale.id}</div>
                                            <div className="text-slate-500 text-[10px] uppercase font-black tracking-widest mt-1">
                                                {new Date(sale.timestamp).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}
                                            </div>
                                        </td>
                                        <td className="py-6">
                                            <div className="text-white font-bold text-sm uppercase tracking-tight">{sale.customerName || 'WALK-IN CUSTOMER'}</div>
                                        </td>
                                        <td className="py-6">
                                            <span className={cn(
                                                "px-2 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest border",
                                                sale.paymentMethod === 'MPESA' ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-500" :
                                                    sale.paymentMethod === 'CASH' ? "bg-blue-500/10 border-blue-500/20 text-blue-500" :
                                                        "bg-orange-500/10 border-orange-500/20 text-orange-500"
                                            )}>
                                                {sale.paymentMethod}
                                            </span>
                                        </td>
                                        <td className="py-6">
                                            <div className="flex items-center gap-2">
                                                <div className={cn("w-2 h-2 rounded-full", sale.etimsStatus === 'SYNCED' ? 'bg-emerald-500' : 'bg-orange-500')} />
                                                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">{sale.etimsStatus}</span>
                                            </div>
                                        </td>
                                        <td className="py-6 text-right">
                                            <div className="text-lg font-black text-white font-outfit">{currency} {sale.total.toLocaleString()}</div>
                                        </td>
                                    </tr>
                                )) : (
                                    <tr>
                                        <td colSpan={5} className="py-20 text-center">
                                            <div className="text-slate-600 font-bold uppercase tracking-widest text-xs">No transactions recorded for this period</div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Categories Distribution */}
                <div className="glass-card rounded-[3rem] p-10 flex flex-col space-y-10 border-white/5">
                    <h3 className="text-2xl font-black text-white font-outfit uppercase tracking-tight">Stock Composition</h3>

                    <div className="flex-1 flex flex-col justify-center space-y-8">
                        {/* Mock Distribution bars */}
                        {Array.from(new Set(products.map(p => p.category))).slice(0, 5).map((cat, i) => {
                            const count = products.filter(p => p.category === cat).length;
                            const percentage = (count / products.length) * 100;
                            return (
                                <div key={cat} className="space-y-2">
                                    <div className="flex justify-between items-end">
                                        <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">{cat}</span>
                                        <span className="text-xs font-black text-white font-outfit">{Math.round(percentage)}%</span>
                                    </div>
                                    <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                                        <motion.div
                                            initial={{ width: 0 }}
                                            animate={{ width: `${percentage}%` }}
                                            transition={{ delay: 0.5 + (i * 0.1) }}
                                            className={cn(
                                                "h-full rounded-full",
                                                i % 3 === 0 ? "bg-orange-500" : i % 3 === 1 ? "bg-emerald-500" : "bg-blue-500"
                                            )}
                                        />
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    <div className="p-6 rounded-3xl bg-white/5 border border-white/5 space-y-3">
                        <div className="flex items-center gap-3 text-orange-500">
                            <PieIcon size={20} />
                            <span className="text-xs font-black uppercase tracking-widest">Efficiency Analytics</span>
                        </div>
                        <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest leading-relaxed">System has detected high turnover in Masonry products. Consider increasing restock threshold.</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
