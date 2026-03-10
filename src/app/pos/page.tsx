"use client";

import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Search,
    ShoppingCart,
    Plus,
    Minus,
    Trash2,
    CreditCard,
    Banknote,
    Smartphone,
    User,
    ChevronDown,
    X,
    Filter,
    BarChart
} from 'lucide-react';
import { useHardwareStore, Product, SaleItem, Sale } from '@/store/hardwareStore';
import { cn } from '@/lib/utils';

export default function POSPage() {
    const { products, recordSale, currency, updateStock } = useHardwareStore();
    const [searchQuery, setSearchQuery] = useState('');
    const [cart, setCart] = useState<SaleItem[]>([]);
    const [paymentModalOpen, setPaymentModalOpen] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState<string>('All');
    const [customerName, setCustomerName] = useState('');

    const categories = ['All', ...Array.from(new Set(products.map(p => p.category)))];

    const filteredProducts = products.filter(p => {
        const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = selectedCategory === 'All' || p.category === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    const cartTotal = cart.reduce((sum, item) => sum + (item.priceAtSale * item.quantity), 0);

    const addToCart = (product: Product) => {
        setCart(prev => {
            const existing = prev.find(item => item.productId === product.id);
            if (existing) {
                return prev.map(item =>
                    item.productId === product.id
                        ? { ...item, quantity: item.quantity + 1 }
                        : item
                );
            }
            return [...prev, {
                productId: product.id,
                name: product.name,
                quantity: 1,
                priceAtSale: product.price,
                unit: product.unit
            }];
        });
    };

    const updateQuantity = (productId: string, delta: number) => {
        setCart(prev => prev.map(item => {
            if (item.productId === productId) {
                const newQty = Math.max(1, item.quantity + delta);
                return { ...item, quantity: newQty };
            }
            return item;
        }));
    };

    const removeFromCart = (productId: string) => {
        setCart(prev => prev.filter(item => item.productId !== productId));
    };

    const handleCheckout = (method: 'CASH' | 'MPESA' | 'CREDIT') => {
        const sale: Sale = {
            id: Math.random().toString(36).substr(2, 9).toUpperCase(),
            items: cart,
            total: cartTotal,
            paymentMethod: method,
            customerName: customerName || undefined,
            timestamp: Date.now(),
            etimsStatus: 'PENDING'
        };

        recordSale(sale);
        // Update Actual Stock
        cart.forEach(item => {
            updateStock(item.productId, -item.quantity);
        });

        setCart([]);
        setCustomerName('');
        setPaymentModalOpen(false);
        alert(`Sale Recorded: ${sale.id}\nTotal: ${currency} ${cartTotal.toLocaleString()}`);
    };

    return (
        <div className="flex h-[calc(100vh-120px)] gap-6 animate-in">
            {/* Products Selection */}
            <div className="flex-1 flex flex-col gap-6 overflow-hidden">
                <div className="flex items-center gap-4">
                    <div className="relative flex-1">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                        <input
                            type="text"
                            placeholder="Search hardware products, materials, tools..."
                            className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-6 text-white text-sm font-bold focus:border-orange-500/50 transition-all outline-none"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar scroll-smooth">
                        {categories.map(cat => (
                            <button
                                key={cat}
                                onClick={() => setSelectedCategory(cat)}
                                className={cn(
                                    "px-6 py-4 rounded-2xl text-xs font-black uppercase tracking-widest whitespace-nowrap transition-all border",
                                    selectedCategory === cat
                                        ? "bg-orange-500 border-orange-500 text-white shadow-lg shadow-orange-500/20"
                                        : "bg-white/5 border-white/10 text-slate-400 hover:text-white"
                                )}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 overflow-y-auto pr-2 custom-scrollbar">
                    {filteredProducts.map(product => (
                        <motion.div
                            key={product.id}
                            layout
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className="glass-card p-6 rounded-[2rem] cursor-pointer group hover:border-orange-500/30 transition-all"
                            onClick={() => addToCart(product)}
                        >
                            <div className="flex justify-between items-start mb-4">
                                <div className="p-2 rounded-xl bg-white/5 text-slate-500 group-hover:text-orange-500 transition-colors">
                                    <BarChart size={20} />
                                </div>
                                <div className={cn(
                                    "text-[10px] font-black px-2 py-1 rounded-lg uppercase tracking-widest",
                                    product.stock > product.threshold ? "bg-emerald-500/10 text-emerald-500" : "bg-red-500/10 text-red-500"
                                )}>
                                    {product.stock} {product.unit}s
                                </div>
                            </div>
                            <h4 className="text-white font-black text-lg uppercase tracking-tight leading-tight line-clamp-2 min-h-[3rem]">
                                {product.name}
                            </h4>
                            <div className="mt-4 flex items-end justify-between">
                                <div className="text-2xl font-black text-white font-outfit">
                                    <span className="text-slate-500 text-sm mr-1">{currency}</span>
                                    {product.price.toLocaleString()}
                                </div>
                                <div className="w-10 h-10 rounded-full bg-orange-500 flex items-center justify-center text-white shadow-lg shadow-orange-500/20 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <Plus size={20} />
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* Cart Side Summary */}
            <div className="w-[400px] flex flex-col glass-card rounded-[3rem] p-8 border-white/10 shadow-2xl relative overflow-hidden">
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-orange-500/10 flex items-center justify-center text-orange-500">
                            <ShoppingCart size={20} />
                        </div>
                        <h3 className="text-xl font-black text-white uppercase tracking-tighter">Current Sale</h3>
                    </div>
                    <div className="text-xs font-black text-slate-500 uppercase tracking-widest">
                        {cart.length} Samples
                    </div>
                </div>

                {/* Cart Items */}
                <div className="flex-1 overflow-y-auto space-y-4 pr-2 custom-scrollbar mb-8">
                    <AnimatePresence initial={false}>
                        {cart.map(item => (
                            <motion.div
                                key={item.productId}
                                layout
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 relative group"
                            >
                                <div className="flex justify-between items-start mb-2">
                                    <h5 className="text-white font-bold text-sm uppercase tracking-tight pr-8">{item.name}</h5>
                                    <button
                                        onClick={() => removeFromCart(item.productId)}
                                        className="absolute top-4 right-4 text-slate-600 hover:text-red-500 transition-colors"
                                    >
                                        <Trash2 size={14} />
                                    </button>
                                </div>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3 bg-white/5 rounded-xl p-1">
                                        <button
                                            onClick={() => updateQuantity(item.productId, -1)}
                                            className="p-1 hover:bg-white/10 rounded-lg text-slate-400 transition-colors"
                                        >
                                            <Minus size={14} />
                                        </button>
                                        <span className="text-white font-black text-sm w-4 text-center">{item.quantity}</span>
                                        <button
                                            onClick={() => updateQuantity(item.productId, 1)}
                                            className="p-1 hover:bg-white/10 rounded-lg text-slate-400 transition-colors"
                                        >
                                            <Plus size={14} />
                                        </button>
                                    </div>
                                    <div className="text-right text-sm">
                                        <div className="text-slate-500 text-[10px] uppercase font-black tracking-widest leading-none">Subtotal</div>
                                        <div className="text-white font-black font-outfit">
                                            {currency} {(item.priceAtSale * item.quantity).toLocaleString()}
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                    {cart.length === 0 && (
                        <div className="h-full flex flex-col items-center justify-center text-center p-10 space-y-4">
                            <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center text-slate-700">
                                <ShoppingCart size={40} />
                            </div>
                            <p className="text-slate-400 font-black uppercase tracking-widest text-xs">Waiting for selection</p>
                        </div>
                    )}
                </div>

                {/* Footer Section */}
                <div className="space-y-6 pt-6 border-t border-white/10">
                    <div className="flex justify-between items-end">
                        <div className="space-y-1">
                            <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Grand Total</div>
                            <div className="text-4xl font-black text-white font-outfit tracking-tighter">
                                <span className="text-orange-500 text-lg mr-2 leading-none">{currency}</span>
                                {cartTotal.toLocaleString()}
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <button className="flex items-center justify-center gap-2 py-4 rounded-xl bg-white/5 border border-white/10 text-slate-300 font-black text-[10px] uppercase tracking-widest hover:bg-white/10 transition-all">
                            Hold Bill
                        </button>
                        <button className="flex items-center justify-center gap-2 py-4 rounded-xl bg-orange-500/10 border border-orange-500/20 text-orange-500 font-black text-[10px] uppercase tracking-widest hover:bg-orange-500/20 transition-all">
                            Discount
                        </button>
                    </div>

                    <button
                        disabled={cart.length === 0}
                        onClick={() => setPaymentModalOpen(true)}
                        className="w-full premium-gradient py-5 rounded-3xl text-white font-black text-sm uppercase tracking-[4px] shadow-2xl shadow-orange-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:scale-100 disabled:pointer-events-none"
                    >
                        Checkout
                    </button>
                </div>
            </div>

            {/* Payment Modal */}
            <AnimatePresence>
                {paymentModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-6 sm:p-0">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-slate-950/80 backdrop-blur-md"
                            onClick={() => setPaymentModalOpen(false)}
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 40 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 40 }}
                            className="w-full max-w-[600px] glass-card rounded-[3.5rem] bg-[#0c1018] relative z-20 overflow-hidden"
                        >
                            <div className="bg-orange-500 h-2 w-full" />
                            <div className="p-10 space-y-10">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h2 className="text-4xl font-black text-white font-outfit uppercase tracking-tighter mb-2">Finalize Sale</h2>
                                        <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">Choose payment method & verify amount</p>
                                    </div>
                                    <button onClick={() => setPaymentModalOpen(false)} className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/10 transition-all">
                                        <X size={24} />
                                    </button>
                                </div>

                                <div className="bg-white/5 rounded-3xl p-8 border border-white/5">
                                    <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Total Amount Due</div>
                                    <div className="text-5xl font-black text-white font-outfit">{currency} {cartTotal.toLocaleString()}</div>
                                </div>

                                <div className="form-group">
                                    <label className="text-xs font-black text-slate-500 uppercase tracking-widest ml-4 mb-2 block">Customer Name (Optional)</label>
                                    <div className="relative">
                                        <User className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-600" size={18} />
                                        <input
                                            type="text"
                                            placeholder="WALK-IN CUSTOMER"
                                            className="w-full bg-white/5 border border-white/10 rounded-2xl py-5 pl-14 pr-6 text-white text-lg font-black focus:border-orange-500 transition-all outline-none uppercase tracking-tighter"
                                            value={customerName}
                                            onChange={(e) => setCustomerName(e.target.value)}
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                    <button
                                        onClick={() => handleCheckout('CASH')}
                                        className="p-8 rounded-[2.5rem] bg-emerald-500/10 border border-emerald-500/20 flex flex-col items-center gap-4 group hover:bg-emerald-500/20 transition-all"
                                    >
                                        <div className="w-16 h-16 rounded-2xl bg-emerald-500 flex items-center justify-center text-white shadow-xl shadow-emerald-500/20">
                                            <Banknote size={32} />
                                        </div>
                                        <span className="text-emerald-500 font-black uppercase text-sm tracking-widest">Cash</span>
                                    </button>

                                    <button
                                        onClick={() => handleCheckout('MPESA')}
                                        className="p-8 rounded-[2.5rem] bg-emerald-600 border border-emerald-500/20 flex flex-col items-center gap-4 group hover:bg-emerald-700 transition-all"
                                    >
                                        <div className="w-16 h-16 rounded-2xl bg-white flex items-center justify-center text-emerald-600 shadow-xl shadow-white/10">
                                            <Smartphone size={32} />
                                        </div>
                                        <span className="text-white font-black uppercase text-sm tracking-widest">M-Pesa</span>
                                    </button>

                                    <button
                                        onClick={() => handleCheckout('CREDIT')}
                                        className="p-8 rounded-[2.5rem] bg-orange-500/10 border border-orange-500/20 flex flex-col items-center gap-4 group hover:bg-orange-500/20 transition-all"
                                    >
                                        <div className="w-16 h-16 rounded-2xl bg-orange-500 flex items-center justify-center text-white shadow-xl shadow-orange-500/20">
                                            <CreditCard size={32} />
                                        </div>
                                        <span className="text-orange-500 font-black uppercase text-sm tracking-widest">Credit</span>
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
