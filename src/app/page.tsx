"use client";

import React from 'react';
import { motion } from 'framer-motion';
import {
  TrendingUp,
  ShoppingBag,
  AlertTriangle,
  CloudSync,
  ChevronRight,
  Plus,
  DollarSign,
  ArrowUpRight,
  ClipboardList
} from 'lucide-react';
import { useHardwareStore } from '@/store/hardwareStore';
import { cn } from '@/lib/utils';

import Link from 'next/link';

export default function Dashboard() {
  const { products, sales, currency, businessName } = useHardwareStore();

  const totalSales = sales.reduce((sum, s) => sum + s.total, 0);
  const lowStockProducts = products.filter(p => p.stock <= p.threshold);

  const stats = [
    { label: 'Today\'s Revenue', value: `${currency} ${totalSales.toLocaleString()}`, icon: DollarSign, color: 'text-orange-500' },
    { label: 'Pending eTIMS', value: '12 Invoices', icon: CloudSync, color: 'text-blue-400' },
    { label: 'Stock Alerts', value: `${lowStockProducts.length} Items Low`, icon: AlertTriangle, color: 'text-red-400' },
    { label: 'Active Quotations', value: '5 Open', icon: ClipboardList, color: 'text-emerald-400' },
  ];

  return (
    <div className="space-y-10 animate-in no-print">
      {/* Welcome Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6">
        <div>
          <div className="flex items-center gap-2 text-orange-500 mb-2 font-black uppercase tracking-[4px] text-[10px]">
            <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
            Live Operation Environment
          </div>
          <h1 className="text-5xl font-black text-white font-outfit uppercase tracking-tighter">
            {businessName.split(' ')[0]} <span className="text-orange-500">{businessName.split(' ').slice(1).join(' ')}</span>
          </h1>
          <p className="text-slate-400 font-medium text-lg mt-2">Daily control center for inventory, tax compliance, and financial flow.</p>
        </div>

        <div className="flex gap-4 w-full lg:w-auto">
          <Link href="/inventory" className="flex-1 lg:flex-none flex items-center justify-center gap-3 bg-white/5 border border-white/10 px-8 py-4 rounded-2xl text-white font-black hover:bg-white/10 transition-all text-sm uppercase tracking-widest cursor-pointer">
            <Plus size={18} /> New Product
          </Link>
          <Link href="/pos" className="flex-1 lg:flex-none flex items-center justify-center gap-3 premium-gradient px-8 py-4 rounded-2xl text-white font-black shadow-xl shadow-orange-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all text-sm uppercase tracking-widest cursor-pointer">
            <ShoppingBag size={18} /> Open POS
          </Link>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="glass-card p-8 rounded-[2.5rem] relative group cursor-pointer"
          >
            <div className="p-3 rounded-2xl bg-white/5 w-fit mb-6 group-hover:bg-white/10 transition-colors">
              <stat.icon size={22} className={stat.color} />
            </div>
            <div className="text-[10px] font-black text-slate-500 uppercase tracking-[2px] mb-1">{stat.label}</div>
            <div className="text-3xl font-black text-white font-outfit truncate">{stat.value}</div>
            <div className="absolute top-8 right-8 text-white/5 group-hover:text-white/20 transition-colors">
              <ArrowUpRight size={24} />
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Critical Inventory */}
        <div className="lg:col-span-2 glass-card rounded-[3rem] p-10 space-y-8">
          <div className="flex justify-between items-center">
            <h3 className="text-2xl font-black text-white font-outfit uppercase">Critical Inventory Alerts</h3>
            <button className="text-xs font-black text-orange-500 flex items-center gap-1 hover:gap-2 transition-all uppercase tracking-widest">
              View All Stock <ChevronRight size={14} />
            </button>
          </div>

          <div className="space-y-4">
            {lowStockProducts.length > 0 ? (
              lowStockProducts.map(p => (
                <div key={p.id} className="flex items-center justify-between p-6 rounded-3xl bg-white/[0.02] border border-white/5 hover:border-orange-500/30 transition-all group">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-red-500/10 flex items-center justify-center text-red-500">
                      <AlertTriangle size={24} />
                    </div>
                    <div>
                      <h4 className="text-white font-bold text-lg leading-tight uppercase tracking-tight">{p.name}</h4>
                      <p className="text-slate-500 text-xs font-black uppercase tracking-widest mt-1">{p.category} • {p.unit}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-black text-red-400 font-outfit">{p.stock}</div>
                    <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest underline decoration-red-500/30">Immediate Restock Required</div>
                  </div>
                </div>
              ))
            ) : (
              <div className="py-20 text-center space-y-4">
                <div className="bg-emerald-500/10 w-20 h-20 rounded-full flex items-center justify-center mx-auto text-emerald-500">
                  <TrendingUp size={40} />
                </div>
                <p className="text-slate-500 font-black uppercase tracking-widest">All stock levels optimized</p>
              </div>
            )}
          </div>
        </div>

        {/* eTIMS Status */}
        <div className="glass-card rounded-[3rem] p-10 bg-blue-500/5 border-blue-500/10 flex flex-col justify-between space-y-10 group">
          <div className="space-y-6">
            <div className="w-14 h-14 rounded-2xl bg-blue-500/20 flex items-center justify-center text-blue-500">
              <CloudSync size={32} className="group-hover:rotate-180 transition-transform duration-700" />
            </div>
            <div>
              <h3 className="text-2xl font-black text-white font-outfit uppercase">eTIMS Compliance</h3>
              <p className="text-slate-400 mt-2 font-medium leading-relaxed">Your system is automatically syncing with KRA servers. 12 invoices are queued for the next window.</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="p-4 rounded-2xl bg-white/5 flex items-center justify-between">
              <span className="text-xs font-black text-slate-500 uppercase tracking-widest">Network Status</span>
              <span className="flex items-center gap-2 text-emerald-400 text-xs font-black uppercase tracking-widest">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" /> Connected
              </span>
            </div>
            <button className="w-full py-5 rounded-2xl bg-blue-500 text-white font-black flex items-center justify-center gap-3 shadow-xl shadow-blue-500/20 hover:bg-blue-600 transition-all uppercase tracking-widest text-xs">
              Sync Manually Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
