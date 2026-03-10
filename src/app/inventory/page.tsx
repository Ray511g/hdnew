"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Search,
    Plus,
    Edit,
    Trash2,
    AlertTriangle,
    Filter,
    Package,
    ArrowUpRight,
    TrendingDown,
    Layers,
    X,
    Check
} from 'lucide-react';
import { useHardwareStore, Product, UnitType } from '@/store/hardwareStore';
import { cn } from '@/lib/utils';

export default function InventoryPage() {
    const { products, addProduct, currency } = useHardwareStore();
    const [searchQuery, setSearchQuery] = useState('');
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState<string>('All');

    // New Product State
    const [newProduct, setNewProduct] = useState<Partial<Product>>({
        name: '',
        category: '',
        price: 0,
        stock: 0,
        unit: 'UNIT',
        threshold: 5
    });

    const categories = ['All', ...Array.from(new Set(products.map(p => p.category)))];

    const filteredProducts = products.filter(p => {
        const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = selectedCategory === 'All' || p.category === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    const lowStockCount = products.filter(p => p.stock <= p.threshold).length;
    const totalInventoryValue = products.reduce((sum, p) => sum + (p.price * p.stock), 0);

    const handleAddProduct = () => {
        if (!newProduct.name || !newProduct.price) return;

        const product: Product = {
            id: Math.random().toString(36).substr(2, 9),
            name: newProduct.name!,
            category: newProduct.category || 'General',
            price: Number(newProduct.price),
            stock: Number(newProduct.stock) || 0,
            unit: (newProduct.unit as UnitType) || 'UNIT',
            threshold: Number(newProduct.threshold) || 5
        };

        addProduct(product);
        setIsAddModalOpen(false);
        setNewProduct({
            name: '',
            category: '',
            price: 0,
            stock: 0,
            unit: 'UNIT',
            threshold: 5
        });
    };

    return (
        <div className="space-y-10 animate-in">
            {/* Header Area */}
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6">
                <div>
                    <div className="flex items-center gap-2 text-orange-500 mb-2 font-black uppercase tracking-[4px] text-[10px]">
                        <Layers size={14} /> Warehouse & Stock Control
                    </div>
                    <h1 className="text-5xl font-black text-white font-outfit uppercase tracking-tighter">
                        Inventory <span className="text-orange-500">Asset Management</span>
                    </h1>
                </div>

                <div className="flex gap-4 w-full lg:w-auto">
                    <button
                        onClick={() => setIsAddModalOpen(true)}
                        className="flex-1 lg:flex-none flex items-center justify-center gap-3 premium-gradient px-8 py-4 rounded-2xl text-white font-black shadow-xl shadow-orange-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all text-sm uppercase tracking-widest"
                    >
                        <Plus size={18} /> Add New Asset
                    </button>
                </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="glass-card p-8 rounded-[2.5rem] relative group border-orange-500/10">
                    <div className="text-[10px] font-black text-slate-500 uppercase tracking-[2px] mb-1">Total Assets</div>
                    <div className="text-3xl font-black text-white font-outfit truncate">{products.length} Items</div>
                    <div className="absolute top-8 right-8 text-orange-500/20">
                        <Package size={24} />
                    </div>
                </div>
                <div className="glass-card p-8 rounded-[2.5rem] relative group border-red-500/10">
                    <div className="text-[10px] font-black text-slate-500 uppercase tracking-[2px] mb-1">Critical Stock</div>
                    <div className="text-3xl font-black text-red-500 font-outfit truncate">{lowStockCount} Alerts</div>
                    <div className="absolute top-8 right-8 text-red-500/20">
                        <AlertTriangle size={24} />
                    </div>
                </div>
                <div className="glass-card p-8 rounded-[2.5rem] relative group border-emerald-500/10">
                    <div className="text-[10px] font-black text-slate-500 uppercase tracking-[2px] mb-1">Asset Value</div>
                    <div className="text-3xl font-black text-emerald-500 font-outfit truncate">{currency} {totalInventoryValue.toLocaleString()}</div>
                    <div className="absolute top-8 right-8 text-emerald-500/20">
                        <ArrowUpRight size={24} />
                    </div>
                </div>
            </div>

            {/* Inventory Table Container */}
            <div className="glass-card rounded-[3rem] p-10 space-y-8 min-h-[500px]">
                <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                    <div className="relative flex-1 w-full">
                        <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-500" size={20} />
                        <input
                            type="text"
                            placeholder="Search by name, serial, or category..."
                            className="w-full bg-white/5 border border-white/10 rounded-3xl py-5 pl-16 pr-8 text-white font-bold focus:border-orange-500/50 transition-all outline-none"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <div className="flex gap-3 overflow-x-auto w-full md:w-auto no-scrollbar">
                        {categories.map(cat => (
                            <button
                                key={cat}
                                onClick={() => setSelectedCategory(cat)}
                                className={cn(
                                    "px-6 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest whitespace-nowrap transition-all border",
                                    selectedCategory === cat
                                        ? "bg-white text-slate-950 border-white"
                                        : "bg-white/5 border-white/10 text-slate-400 hover:text-white"
                                )}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-separate border-spacing-y-4">
                        <thead>
                            <tr className="text-slate-500 text-[10px] uppercase font-black tracking-widest px-6 pb-2">
                                <th className="px-8 py-2">Product Info</th>
                                <th className="px-8 py-2">Status</th>
                                <th className="px-8 py-2">Stock Level</th>
                                <th className="px-8 py-2 text-right">Unit Price</th>
                                <th className="px-8 py-2 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredProducts.map(product => (
                                <motion.tr
                                    layout
                                    key={product.id}
                                    className="group"
                                >
                                    <td className="bg-white/[0.02] border-y border-l border-white/5 rounded-l-[2rem] px-8 py-8 transition-colors group-hover:bg-white/[0.04]">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-2xl bg-slate-900 border border-white/5 flex items-center justify-center text-slate-500">
                                                <Package size={20} />
                                            </div>
                                            <div>
                                                <div className="text-white font-black uppercase tracking-tight text-lg leading-none mb-1">{product.name}</div>
                                                <div className="text-slate-500 text-[10px] font-black uppercase tracking-widest">{product.category}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="bg-white/[0.02] border-y border-white/5 px-8 py-6 transition-colors group-hover:bg-white/[0.04]">
                                        <div className={cn(
                                            "inline-flex items-center gap-2 px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest",
                                            product.stock > product.threshold
                                                ? "bg-emerald-500/10 text-emerald-500"
                                                : "bg-red-500/10 text-red-500"
                                        )}>
                                            {product.stock > product.threshold ? <Check size={12} /> : <AlertTriangle size={12} />}
                                            {product.stock > product.threshold ? 'Optimal' : 'Shortage'}
                                        </div>
                                    </td>
                                    <td className="bg-white/[0.02] border-y border-white/5 px-8 py-6 transition-colors group-hover:bg-white/[0.04]">
                                        <div className="flex items-center gap-4">
                                            <div className="flex-1 w-24 bg-white/5 h-2 rounded-full overflow-hidden">
                                                <div
                                                    className={cn(
                                                        "h-full transition-all duration-1000",
                                                        product.stock > product.threshold ? "bg-emerald-500" : "bg-red-500"
                                                    )}
                                                    style={{ width: `${Math.min(100, (product.stock / (product.threshold * 4)) * 100)}%` }}
                                                />
                                            </div>
                                            <div className="text-white font-black font-outfit text-xl">
                                                {product.stock} <span className="text-[10px] text-slate-500 uppercase tracking-widest">{product.unit}s</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="bg-white/[0.02] border-y border-white/5 px-8 py-6 text-right transition-colors group-hover:bg-white/[0.04]">
                                        <div className="text-2xl font-black text-white font-outfit">
                                            {currency} {product.price.toLocaleString()}
                                        </div>
                                    </td>
                                    <td className="bg-white/[0.02] border-y border-r border-white/5 rounded-r-[2rem] px-8 py-6 text-right transition-colors group-hover:bg-white/[0.04]">
                                        <div className="flex items-center justify-end gap-2">
                                            <button className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-slate-500 hover:text-white hover:bg-white/10 transition-all">
                                                <Edit size={16} />
                                            </button>
                                            <button className="w-10 h-10 rounded-xl bg-red-500/10 flex items-center justify-center text-red-500 hover:bg-red-500/20 transition-all">
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </td>
                                </motion.tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Add Asset Modal */}
            <AnimatePresence>
                {isAddModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-6 sm:p-0">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-slate-950/90 backdrop-blur-xl"
                            onClick={() => setIsAddModalOpen(false)}
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 40 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 40 }}
                            className="w-full max-w-[700px] glass-card rounded-[3.5rem] bg-[#0c1018] relative z-20 border-white/10"
                        >
                            <div className="p-12 space-y-10">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h2 className="text-4xl font-black text-white font-outfit uppercase tracking-tighter mb-2">New Asset <span className="text-orange-500">Registration</span></h2>
                                        <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">Add hardware stock item to the global management system</p>
                                    </div>
                                    <button onClick={() => setIsAddModalOpen(false)} className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/10 transition-all">
                                        <X size={24} />
                                    </button>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="space-y-6">
                                        <div className="form-group">
                                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-[2px] ml-4 mb-2 block">Product Name / Identifier</label>
                                            <input
                                                type="text"
                                                className="w-full bg-white/5 border border-white/10 rounded-2xl py-5 px-6 text-white font-bold focus:border-orange-500 outline-none uppercase tracking-tight"
                                                placeholder="e.g. STEEL REINFORCEMENT D12"
                                                value={newProduct.name}
                                                onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-[2px] ml-4 mb-2 block">Category</label>
                                            <input
                                                type="text"
                                                className="w-full bg-white/5 border border-white/10 rounded-2xl py-5 px-6 text-white font-bold focus:border-orange-500 outline-none uppercase tracking-tight"
                                                placeholder="e.g. CONSTRUCTION MATERIALS"
                                                value={newProduct.category}
                                                onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
                                            />
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="form-group">
                                                <label className="text-[10px] font-black text-slate-500 uppercase tracking-[2px] ml-4 mb-2 block">Price ({currency})</label>
                                                <input
                                                    type="number"
                                                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-5 px-6 text-white font-black text-xl font-outfit focus:border-orange-500 outline-none"
                                                    value={newProduct.price}
                                                    onChange={(e) => setNewProduct({ ...newProduct, price: Number(e.target.value) })}
                                                />
                                            </div>
                                            <div className="form-group">
                                                <label className="text-[10px] font-black text-slate-500 uppercase tracking-[2px] ml-4 mb-2 block">Stock Level</label>
                                                <input
                                                    type="number"
                                                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-5 px-6 text-white font-black text-xl font-outfit focus:border-orange-500 outline-none"
                                                    value={newProduct.stock}
                                                    onChange={(e) => setNewProduct({ ...newProduct, stock: Number(e.target.value) })}
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-6">
                                        <div className="form-group">
                                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-[2px] ml-4 mb-2 block">Unit Representation</label>
                                            <select
                                                title="Unit type"
                                                className="w-full bg-white/5 border border-white/10 rounded-2xl py-5 px-6 text-white font-black focus:border-orange-500 outline-none uppercase tracking-widest text-xs h-[72px]"
                                                value={newProduct.unit}
                                                onChange={(e) => setNewProduct({ ...newProduct, unit: e.target.value as UnitType })}
                                            >
                                                <option value="UNIT">Per Unit/Item</option>
                                                <option value="BAG">Per Bag (Cement/Sand)</option>
                                                <option value="KG">Per Kilogram (Kg)</option>
                                                <option value="METER">Per Meter (Running)</option>
                                                <option value="LT">Per Liter (Liquid)</option>
                                            </select>
                                        </div>
                                        <div className="form-group">
                                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-[2px] ml-4 mb-2 block">Threshold Warning</label>
                                            <input
                                                type="number"
                                                className="w-full bg-white/5 border border-white/10 rounded-2xl py-5 px-6 text-white font-black text-xl font-outfit focus:border-orange-500 outline-none"
                                                value={newProduct.threshold}
                                                onChange={(e) => setNewProduct({ ...newProduct, threshold: Number(e.target.value) })}
                                            />
                                            <p className="text-[9px] text-slate-600 font-bold uppercase mt-2 ml-4">System will flag this item when stock hits this level</p>
                                        </div>

                                        <div className="pt-4">
                                            <button
                                                onClick={handleAddProduct}
                                                className="w-full premium-gradient py-6 rounded-2xl text-white font-black uppercase tracking-[4px] shadow-2xl shadow-orange-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
                                            >
                                                Register Asset
                                            </button>
                                        </div>
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
