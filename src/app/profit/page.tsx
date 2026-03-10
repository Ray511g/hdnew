"use client";

import React from 'react';
import { motion } from 'framer-motion';
import {
    TrendingUp,
    TrendingDown,
    DollarSign,
    PieChart,
    ArrowUpRight,
    ArrowDownRight,
    Activity,
    Layers,
    Target,
    Zap
} from 'lucide-react';
import { useHardwareStore } from '@/store/hardwareStore';
import { cn } from '@/lib/utils';

export default function ProfitLossPage() {
    const { sales, currency } = useHardwareStore();

    const totalRevenue = sales.reduce((sum, sale) => sum + sale.total, 0);
    const totalCostOfSales = totalRevenue * 0.72; // Simulation
    const grossProfit = totalRevenue - totalCostOfSales;
    const operatingExpenses = totalRevenue * 0.08; // Simulation
    const netProfit = grossProfit - operatingExpenses;

    const metrics = [
        { label: 'Gross Revenue', value: totalRevenue, icon: Zap, color: 'blue', change: '+12.5%' },
        { label: 'Stock Cost', value: totalCostOfSales, icon: Layers, color: 'slate', change: '-2.1%' },
        { label: 'Net Profit', value: netProfit, icon: TrendingUp, color: 'emerald', change: '+18.2%' },
    ];

    return (
        <div className="space-y-10 animate-in">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6">
                <div>
                    <div className="flex items-center gap-2 text-[#f59e0b] mb-2 font-black uppercase tracking-[4px] text-[10px]">
                        <TrendingUp size={14} /> Comprehensive Fiscal Analytics
                    </div>
                    <h1 className="text-5xl font-black text-white font-outfit uppercase tracking-tighter">
                        Profit <span className="text-[#f59e0b]">& Loss</span>
                    </h1>
                </div>
                <div className="flex gap-4">
                    <div className="p-4 bg-white/5 rounded-2xl border border-white/5 flex items-center gap-3">
                        <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest leading-none">Fiscal Year</div>
                        <div className="text-white font-black uppercase text-xs leading-none">FY 2026/27</div>
                    </div>
                </div>
            </div>

            {/* Performance Highlighters */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {metrics.map((m, i) => (
                    <motion.div
                        key={m.label}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className={cn(
                            "glass-card p-10 rounded-[3rem] relative overflow-hidden group border-white/5",
                            m.color === 'emerald' ? "bg-emerald-500/[0.03]" : ""
                        )}
                    >
                        <div className="flex justify-between items-start mb-8 relative z-10">
                            <div className={cn(
                                "p-4 rounded-2xl bg-white/5",
                                m.color === 'emerald' ? "text-emerald-400" : "text-slate-400"
                            )}>
                                <m.icon size={24} />
                            </div>
                            <span className={cn(
                                "flex items-center gap-1 text-[10px] font-black uppercase tracking-widest",
                                m.change.startsWith('+') ? "text-emerald-400" : "text-red-400"
                            )}>
                                {m.change} {m.change.startsWith('+') ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
                            </span>
                        </div>
                        <div className="relative z-10">
                            <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">{m.label}</div>
                            <div className="text-4xl font-black text-white font-outfit tracking-tighter">{currency} {m.value.toLocaleString()}</div>
                        </div>
                        <div className="absolute -right-4 -bottom-4 opacity-5 group-hover:opacity-10 transition-opacity">
                            <m.icon size={120} />
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Detailed Ledger Breakdown */}
            <div className="grid grid-cols-1 xl:grid-cols-5 gap-10">
                <div className="xl:col-span-3 glass-card rounded-[3rem] p-12 border-white/5 flex flex-col gap-10">
                    <div className="flex justify-between items-center">
                        <h3 className="text-2xl font-black text-white font-outfit uppercase">Profitability <span className="text-[#f59e0b]">Engine</span></h3>
                        <Activity className="text-slate-700" size={24} />
                    </div>

                    <div className="space-y-6">
                        {[
                            { label: 'Net Sales Revenue', value: totalRevenue, detail: 'Total POS Transcations processed' },
                            { label: 'Cost of Goods Sold (COGS)', value: -totalCostOfSales, detail: 'Supplier procurement and inbound logistics', negative: true },
                            { label: 'Operating Expenses', value: -operatingExpenses, detail: 'Electricity, Staff Salaries, Tax Compliance', negative: true },
                            { label: 'Calculated Net Surplus', value: netProfit, detail: 'Pre-tax earnings distribution', total: true },
                        ].map((row, i) => (
                            <div key={i} className={cn(
                                "flex justify-between items-end p-8 rounded-[2rem] transition-all",
                                row.total ? "bg-[#f59e0b]/5 border border-[#f59e0b]/20" : "hover:bg-white/[0.02]"
                            )}>
                                <div className="space-y-1">
                                    <div className={cn("text-xs font-black uppercase tracking-widest", row.total ? "text-[#f59e0b]" : "text-slate-400")}>{row.label}</div>
                                    <div className="text-[10px] text-slate-600 font-bold max-w-xs">{row.detail}</div>
                                </div>
                                <div className={cn(
                                    "text-3xl font-black font-outfit",
                                    row.negative ? "text-red-500" : "text-white"
                                )}>
                                    {row.value < 0 ? '-' : ''}{currency} {Math.abs(row.value).toLocaleString()}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="xl:col-span-2 glass-card rounded-[3rem] p-12 flex flex-col space-y-10 border-white/5 bg-blue-500/[0.02]">
                    <h3 className="text-2xl font-black text-white font-outfit uppercase">Target <span className="text-blue-400">Analysis</span></h3>

                    <div className="flex-1 space-y-12">
                        {[
                            { label: 'Surplus Threshold', val: 85, color: 'emerald' },
                            { label: 'Overhead Efficiency', val: 42, color: 'blue' },
                            { label: 'Stock Turn Velocity', val: 68, color: 'orange' },
                        ].map((stat, i) => (
                            <div key={i} className="space-y-4">
                                <div className="flex justify-between items-end">
                                    <div className="text-[10px] font-black text-slate-500 uppercase tracking-[2px]">{stat.label}</div>
                                    <div className="text-xl font-black text-white font-outfit">{stat.val}%</div>
                                </div>
                                <div className="h-3 w-full bg-white/5 rounded-full overflow-hidden p-[2px]">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: `${stat.val}%` }}
                                        transition={{ duration: 1.5, ease: "easeOut" }}
                                        className={cn(
                                            "h-full rounded-full shadow-lg",
                                            stat.color === 'emerald' ? "bg-emerald-500 shadow-emerald-500/20" :
                                                stat.color === 'blue' ? "bg-blue-500 shadow-blue-500/20" : "bg-[#f59e0b] shadow-orange-500/20"
                                        )}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="p-8 rounded-3xl bg-white/5 border border-white/5 space-y-4">
                        <div className="flex items-center gap-3 text-emerald-400">
                            <Target size={18} />
                            <span className="text-[10px] font-black uppercase tracking-widest">Growth Recommendation</span>
                        </div>
                        <p className="text-slate-400 text-xs font-medium leading-relaxed">Based on current sales velocity, increasing inventory for <span className="text-white font-black">Cement & Masonry</span> could boost next quarter's surplus by <span className="text-emerald-400 font-black">15.4%</span>.</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
