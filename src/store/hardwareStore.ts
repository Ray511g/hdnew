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
    threshold: number;
}

export interface Vendor {
    id: string;
    name: string;
    contact: string;
    category: string;
    rating: number;
    balance: number;
}

export interface PurchaseOrder {
    id: string;
    vendorId: string;
    items: { productId: string; quantity: number; cost: number }[];
    total: number;
    status: 'PENDING' | 'RECEIVED' | 'CANCELLED';
    timestamp: number;
}

export interface LedgerEntry {
    id: string;
    contractorName: string;
    description: string;
    amount: number;
    type: 'DEBIT' | 'CREDIT';
    timestamp: number;
}

export interface StaffMember {
    id: string;
    name: string;
    role: 'ADMIN' | 'CASHIER' | 'MANAGER';
    status: 'ACTIVE' | 'INACTIVE';
    lastActive: number;
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
    vendors: Vendor[];
    purchaseOrders: PurchaseOrder[];
    ledger: LedgerEntry[];
    staff: StaffMember[];
    businessName: string;
    currency: string;
    branchId: string;

    // Actions
    addProduct: (product: Product) => void;
    updateStock: (productId: string, quantity: number) => void;
    recordSale: (sale: Sale) => void;
    addVendor: (vendor: Vendor) => void;
    addPO: (po: PurchaseOrder) => void;
    addLedgerEntry: (entry: LedgerEntry) => void;
    updateStaff: (staff: StaffMember[]) => void;
    updateSettings: (settings: Partial<HardwareState>) => void;
}

export const useHardwareStore = create<HardwareState>()(
    persist(
        (set) => ({
            products: [
                { id: '1', name: 'Bamburi Cement (32.5R)', category: 'Masonry', price: 950, stock: 50, unit: 'BAG', threshold: 10 },
                { id: '2', name: 'D12 Reinforcement Bar', category: 'Steel', price: 1250, stock: 120, unit: 'UNIT', threshold: 20 },
                { id: '3', name: 'Gloss White Paint (4L)', category: 'Paints', price: 3200, stock: 15, unit: 'LT', threshold: 5 },
            ],
            sales: [],
            vendors: [
                { id: 'v1', name: 'Bamburi Cement Ltd', contact: '0712345678', category: 'Masonry', rating: 4.8, balance: 0 },
                { id: 'v2', name: 'Crown Paints Kenya', contact: '0722334455', category: 'Paints', rating: 4.5, balance: -15000 },
            ],
            purchaseOrders: [],
            ledger: [],
            staff: [
                { id: 's1', name: 'Hardware Admin', role: 'ADMIN', status: 'ACTIVE', lastActive: Date.now() },
            ],
            businessName: 'HardwarePRO Kenya',
            currency: 'KSh',
            branchId: 'HPRO-NRB-001',

            addProduct: (product) => set((state) => ({ products: [...state.products, product] })),
            updateStock: (productId, quantity) => set((state) => ({
                products: state.products.map(p => p.id === productId ? { ...p, stock: p.stock + quantity } : p)
            })),
            recordSale: (sale) => set((state) => ({ sales: [sale, ...state.sales] })),
            addVendor: (vendor) => set((state) => ({ vendors: [...state.vendors, vendor] })),
            addPO: (po) => set((state) => ({ purchaseOrders: [po, ...state.purchaseOrders] })),
            addLedgerEntry: (entry) => set((state) => ({ ledger: [entry, ...state.ledger] })),
            updateStaff: (staff) => set({ staff }),
            updateSettings: (settings) => set((state) => ({ ...state, ...settings })),
        }),
        { name: 'hardware-pos-storage' }
    )
);

