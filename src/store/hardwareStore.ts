import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type UnitType = 'BAG' | 'UNIT' | 'KG' | 'METER' | 'FEET' | 'LT';

export interface Product {
    id: string;
    name: string;
    category: string;
    price: number;
    stock: number;
    unit: UnitType;
    threshold: number; // For low stock alerts
}

export interface SaleItem {
    productId: string;
    name: string;
    quantity: number;
    priceAtSale: number;
    unit: UnitType;
}

export interface Sale {
    id: string;
    items: SaleItem[];
    total: number;
    paymentMethod: 'CASH' | 'MPESA' | 'CREDIT';
    customerName?: string;
    timestamp: number;
    etimsStatus: 'PENDING' | 'SYNCED' | 'FAILED';
    etimsInvoiceNumber?: string;
}

interface HardwareState {
    products: Product[];
    sales: Sale[];
    businessName: string;
    currency: string;

    // Actions
    addProduct: (product: Product) => void;
    updateStock: (productId: string, quantity: number) => void;
    recordSale: (sale: Sale) => void;
    updateSettings: (settings: Partial<HardwareState>) => void;
}

export const useHardwareStore = create<HardwareState>()(
    persist(
        (set, get) => ({
            products: [
                { id: '1', name: 'Bamburi Cement (32.5R)', category: 'Masonry', price: 950, stock: 50, unit: 'BAG', threshold: 10 },
                { id: '2', name: 'D12 Reinforcement Bar', category: 'Steel', price: 1250, stock: 120, unit: 'UNIT', threshold: 20 },
                { id: '3', name: 'Gloss White Paint (4L)', category: 'Paints', price: 3200, stock: 15, unit: 'LT', threshold: 5 },
            ],
            sales: [],
            businessName: 'Hardware Pro Kenya',
            currency: 'KSh',

            addProduct: (product) => set((state) => ({ products: [...state.products, product] })),

            updateStock: (productId, quantity) => set((state) => ({
                products: state.products.map(p =>
                    p.id === productId ? { ...p, stock: p.stock + quantity } : p
                )
            })),

            recordSale: (sale) => set((state) => ({
                sales: [sale, ...state.sales]
            })),

            updateSettings: (settings) => set((state) => ({ ...state, ...settings })),
        }),
        { name: 'hardware-pos-storage' }
    )
);
