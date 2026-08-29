import React, { useState, useMemo } from 'react';
import {
  LayoutDashboard, ShoppingCart, Users, Package, Boxes,
  FileText, CreditCard, Clock, Truck, UserCheck, DollarSign,
  BarChart3, Settings, Plus, Search, Filter, Printer, Eye,
  CheckCircle, AlertTriangle, ArrowUpRight, ArrowDownRight,
  ChevronRight, Calendar, Building, Phone, MapPin, Tag, RefreshCw, X
} from 'lucide-react';

// --- INITIAL DEMO DATA (Matching Database Schema) ---
const INITIAL_PRODUCTS = [
  {
    id: 'prod-001',
    product_code: 'EDM-FR-01',
    name: 'Edamame Fresh Grade A',
    unit: 'karung',
    kg_per_sack: 30,
    purchase_price: 450000, // Rp 15.000/kg
    selling_price: 600000,   // Rp 20.000/kg
    minimum_stock_kg: 600,   // 20 karung
    status: 'ACTIVE'
  }
];

const INITIAL_SUPPLIERS = [
  {
    id: 'sup-001',
    supplier_code: 'SUP-JBR-01',
    name: 'Kelompok Tani Edamame Jember',
    whatsapp: '6281234567890',
    address: 'Jl. Raya Arjasa No. 45',
    city: 'Jember',
    capacity_kg: 5000,
    purchase_price: 15000,
    lead_time_days: 1,
    status: 'ACTIVE'
  }
];

const INITIAL_CUSTOMERS = [
  {
    id: 'cust-001',
    customer_code: 'CUST-001',
    name: 'Ahmad Resto',
    company_name: 'PT Kuliner Utama',
    whatsapp: '6281987654321',
    phone: '0315551234',
    address: 'Jl. Dharmahusada No. 12',
    city: 'Surabaya',
    province: 'Jawa Timur',
    customer_type: 'Restoran',
    payment_term_days: 14,
    credit_limit: 20000000,
    status: 'ACTIVE',
    notes: 'Pelanggan rutin setiap Selasa & Jumat'
  },
  {
    id: 'cust-002',
    customer_code: 'CUST-002',
    name: 'Bambang Frozen',
    company_name: 'CV Frozen Jaya',
    whatsapp: '6281876543210',
    phone: '0274443210',
    address: 'Jl. Malioboro No. 88',
    city: 'Yogyakarta',
    province: 'DI Yogyakarta',
    customer_type: 'Distributor',
    payment_term_days: 30,
    credit_limit: 50000000,
    status: 'ACTIVE',
    notes: 'Pengiriman via bus malam'
  }
];

const INITIAL_INVENTORY_LOGS = [
  {
    id: 'inv-log-001',
    transaction_number: 'TRX-IN-001',
    product_id: 'prod-001',
    supplier_id: 'sup-001',
    transaction_type: 'Barang Masuk',
    quantity_sacks: 100,
    quantity_kg: 3000,
    reference_type: 'PURCHASE_ORDER',
    transaction_date: '2026-08-28',
    notes: 'Penerimaan edamame segar panen raya dari Jember'
  },
  {
    id: 'inv-log-002',
    transaction_number: 'TRX-OUT-001',
    product_id: 'prod-001',
    supplier_id: null,
    transaction_type: 'Barang Keluar',
    quantity_sacks: -30,
    quantity_kg: -900,
    reference_type: 'ORDER',
    transaction_date: '2026-08-29',
    notes: 'Pengurangan stok untuk pesanan ORD-2026-001'
  }
];

const INITIAL_ORDERS = [
  {
    id: 'ord-001',
    order_number: 'ORD-2026-001',
    customer_id: 'cust-001',
    customer_name: 'Ahmad Resto',
    order_date: '2026-08-29',
    delivery_date: '2026-08-30',
    product_id: 'prod-001',
    quantity_sacks: 30,
    quantity_kg: 900,
    tonnage: 0.9,
    price_per_sack: 600000,
    price_per_kg: 20000,
    subtotal: 18000000,
    discount: 0,
    shipping_cost: 250000,
    grand_total: 18250000,
    payment_term_days: 14,
    due_date: '2026-09-12',
    payment_status: 'PARTIAL', // UNPAID, PARTIAL, PAID
    order_status: 'Dikirim', // Draft, Diproses, Dikirim, Selesai, Dibatalkan
    shipping_destination: 'Surabaya',
    notes: 'Kirim via Bus Tiara, ambil di terminal Purabaya'
  }
];

const INITIAL_INVOICES = [
  {
    id: 'inv-001',
    invoice_number: 'INV-2026-001',
    order_id: 'ord-001',
    customer_id: 'cust-001',
    customer_name: 'Ahmad Resto',
    invoice_date: '2026-08-29',
    due_date: '2026-09-12',
    subtotal: 18000000,
    discount: 0,
    shipping_cost: 250000,
    grand_total: 18250000,
    paid_amount: 5000000,
    outstanding_amount: 13250000,
    payment_status: 'PARTIAL'
  }
];

const INITIAL_PAYMENTS = [
  {
    id: 'pay-001',
    payment_number: 'PAY-2026-001',
    invoice_id: 'inv-001',
    invoice_number: 'INV-2026-001',
    customer_id: 'cust-001',
    customer_name: 'Ahmad Resto',
    payment_date: '2026-08-30',
    amount: 5000000,
    payment_method: 'Transfer Bank',
    notes: 'DP Pembayaran awal 30%'
  }
];

const INITIAL_SHIPMENTS = [
  {
    id: 'shp-001',
    shipment_number: 'SHP-2026-001',
    order_id: 'ord-001',
    order_number: 'ORD-2026-001',
    customer_name: 'Ahmad Resto',
    destination: 'Terminal Purabaya, Surabaya',
    shipping_date: '2026-08-30',
    transportation_type: 'Bus',
    expedition_name: 'Bus Tiara Mas',
    tracking_number: 'B-7742-UA',
    shipping_cost: 250000,
    status: 'Dikirim',
    notes: 'Titip di supir Pak Hari'
  }
];

const INITIAL_EXPENSES = [
  {
    id: 'exp-001',
    expense_number: 'EXP-2026-001',
    expense_date: '2026-08-30',
    category: 'Packaging',
    description: 'Pembelian 100 karung es & pengikat edamame',
    amount: 350000,
    payment_method: 'Cash',
    notes: 'Nota Toko Plastik Jaya'
  }
];

export default function App() {
  // State Active Menu
  const [activeTab, setActiveTab] = useState('dashboard');

  // Core Data States
  const [products, setProducts] = useState(INITIAL_PRODUCTS);
  const [suppliers, setSuppliers] = useState(INITIAL_SUPPLIERS);
  const [customers, setCustomers] = useState(INITIAL_CUSTOMERS);
  const [orders, setOrders] = useState(INITIAL_ORDERS);
  const [invoices, setInvoices] = useState(INITIAL_INVOICES);
  const [payments, setPayments] = useState(INITIAL_PAYMENTS);
  const [inventoryLogs, setInventoryLogs] = useState(INITIAL_INVENTORY_LOGS);
  const [shipments, setShipments] = useState(INITIAL_SHIPMENTS);
  const [expenses, setExpenses] = useState(INITIAL_EXPENSES);

  // Filter & UI States
  const [searchTerm, setSearchTerm] = useState('');
  const [userRole, setUserRole] = useState('ADMIN'); // ADMIN, STAFF, VIEWER

  // Modals & Active Selections
  const [selectedCustomerDetail, setSelectedCustomerDetail] = useState(null);
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [showCustomerModal, setShowCustomerModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showStockModal, setShowStockModal] = useState(false);
  const [showExpenseModal, setShowExpenseModal] = useState(false);
  const [showSupplierModal, setShowSupplierModal] = useState(false);

  const [activeInvoiceForPrint, setActiveInvoiceForPrint] = useState(null);
  const [activeReceiptForPrint, setActiveReceiptForPrint] = useState(null);

  // --- DERIVED CALCULATIONS & COMPUTED VALUES ---
  // Stock Summary (Single source from inventory logs)
  const currentStock = useMemo(() => {
    const totalSacks = inventoryLogs.reduce((acc, curr) => acc + Number(curr.quantity_sacks), 0);
    const totalKg = inventoryLogs.reduce((acc, curr) => acc + Number(curr.quantity_kg), 0);
    const totalTon = (totalKg / 1000).toFixed(2);
    const minStock = products[0]?.minimum_stock_kg || 600;
    const isLow = totalKg <= minStock;

    return { totalSacks, totalKg, totalTon, isLow, minStock };
  }, [inventoryLogs, products]);

  // Financial & BI Analytics Calculations
  const metrics = useMemo(() => {
    const totalOrdersCount = orders.filter(o => o.order_status !== 'Dibatalkan').length;
    const totalSacksSold = orders.filter(o => o.order_status !== 'Dibatalkan').reduce((acc, o) => acc + o.quantity_sacks, 0);
    const totalKgSold = orders.filter(o => o.order_status !== 'Dibatalkan').reduce((acc, o) => acc + o.quantity_kg, 0);
    const totalTonSold = (totalKgSold / 1000).toFixed(2);

    // Revenue / Omzet
    const omzet = orders.filter(o => o.order_status !== 'Dibatalkan').reduce((acc, o) => acc + o.grand_total, 0);

    // HPP / COGS (Kg sold * Purchase Price per Kg)
    const hpp = totalKgSold * (products[0]?.purchase_price / 30 || 15000);

    // Laba Kotor & Operasional
    const labaKotor = omzet - hpp;
    const totalOperasional = expenses.reduce((acc, e) => acc + e.amount, 0);
    const labaBersih = labaKotor - totalOperasional;

    // Accounts Receivable / Total Piutang
    const totalPiutang = invoices.reduce((acc, inv) => acc + inv.outstanding_amount, 0);

    return {
      totalOrdersCount,
      totalSacksSold,
      totalKgSold,
      totalTonSold,
      omzet,
      hpp,
      labaKotor,
      totalOperasional,
      labaBersih,
      totalPiutang
    };
  }, [orders, products, expenses, invoices]);

  // Formatter Helpers
  const formatRupiah = (val) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(val);
  const formatNum = (val) => new Intl.NumberFormat('id-ID').format(val);

  // --- HANDLERS FOR TRANSACTION WRITING (Single Source of Truth) ---
  const handleCreateOrder = (newOrderData) => {
    const orderId = `ord-${Date.now()}`;
    const orderNum = `ORD-2026-${String(orders.length + 1).padStart(3, '0')}`;
    const invNum = `INV-2026-${String(invoices.length + 1).padStart(3, '0')}`;

    const qtySacks = Number(newOrderData.quantity_sacks);
    const qtyKg = qtySacks * 30;
    const tonnage = qtyKg / 1000;

    const subtotal = qtySacks * newOrderData.price_per_sack;
    const shipping = Number(newOrderData.shipping_cost || 0);
    const discount = Number(newOrderData.discount || 0);
    const grandTotal = subtotal + shipping - discount;

    const newOrder = {
      id: orderId,
      order_number: orderNum,
      customer_id: newOrderData.customer_id,
      customer_name: customers.find(c => c.id === newOrderData.customer_id)?.name || 'Pelanggan',
      order_date: newOrderData.order_date,
      delivery_date: newOrderData.delivery_date,
      product_id: products[0].id,
      quantity_sacks: qtySacks,
      quantity_kg: qtyKg,
      tonnage: tonnage,
      price_per_sack: newOrderData.price_per_sack,
      price_per_kg: newOrderData.price_per_sack / 30,
      subtotal,
      discount,
      shipping_cost: shipping,
      grand_total: grandTotal,
      payment_term_days: newOrderData.payment_term_days,
      due_date: newOrderData.due_date,
      payment_status: 'UNPAID',
      order_status: 'Diproses',
      notes: newOrderData.notes
    };

    // Auto-create Invoice
    const newInvoice = {
      id: `inv-${Date.now()}`,
      invoice_number: invNum,
      order_id: orderId,
      customer_id: newOrderData.customer_id,
      customer_name: newOrder.customer_name,
      invoice_date: newOrderData.order_date,
      due_date: newOrderData.due_date,
      subtotal,
      discount,
      shipping_cost: shipping,
      grand_total: grandTotal,
      paid_amount: 0,
      outstanding_amount: grandTotal,
      payment_status: 'UNPAID'
    };

    // Auto Stock Deduction (If Order is confirmed/processed)
    const newStockLog = {
      id: `inv-log-${Date.now()}`,
      transaction_number: `TRX-OUT-${String(inventoryLogs.length + 1).padStart(3, '0')}`,
      product_id: products[0].id,
      supplier_id: null,
      transaction_type: 'Barang Keluar',
      quantity_sacks: -qtySacks,
      quantity_kg: -qtyKg,
      reference_type: 'ORDER',
      transaction_date: newOrderData.order_date,
      notes: `Pengurangan stok otomatis untuk pesanan ${orderNum}`
    };

    setOrders([newOrder, ...orders]);
    setInvoices([newInvoice, ...invoices]);
    setInventoryLogs([newStockLog, ...inventoryLogs]);
    setShowOrderModal(false);
  };

  const handleRecordPayment = (paymentData) => {
    const inv = invoices.find(i => i.id === paymentData.invoice_id);
    if (!inv) return;

    const payAmount = Number(paymentData.amount);
    const newPaidAmount = inv.paid_amount + payAmount;
    const newOutstanding = inv.grand_total - newPaidAmount;
    const newStatus = newOutstanding <= 0 ? 'PAID' : (newPaidAmount > 0 ? 'PARTIAL' : 'UNPAID');

    // 1. Add Payment Log
    const newPaymentObj = {
      id: `pay-${Date.now()}`,
      payment_number: `PAY-2026-${String(payments.length + 1).padStart(3, '0')}`,
      invoice_id: inv.id,
      invoice_number: inv.invoice_number,
      customer_id: inv.customer_id,
      customer_name: inv.customer_name,
      payment_date: paymentData.payment_date,
      amount: payAmount,
      payment_method: paymentData.payment_method,
      notes: paymentData.notes
    };

    // 2. Update Invoice
    const updatedInvoices = invoices.map(i => {
      if (i.id === inv.id) {
        return {
          ...i,
          paid_amount: newPaidAmount,
          outstanding_amount: newOutstanding < 0 ? 0 : newOutstanding,
          payment_status: newStatus
        };
      }
      return i;
    });

    // 3. Sync Order Payment Status
    const updatedOrders = orders.map(o => {
      if (o.id === inv.order_id) {
        return { ...o, payment_status: newStatus };
      }
      return o;
    });

    setPayments([newPaymentObj, ...payments]);
    setInvoices(updatedInvoices);
    setOrders(updatedOrders);
    setShowPaymentModal(false);
  };

  const handleAddStock = (stockData) => {
    const qtySacks = Number(stockData.quantity_sacks);
    const qtyKg = qtySacks * 30;

    const newLog = {
      id: `inv-log-${Date.now()}`,
      transaction_number: `TRX-IN-${String(inventoryLogs.length + 1).padStart(3, '0')}`,
      product_id: products[0].id,
      supplier_id: stockData.supplier_id,
      transaction_type: stockData.transaction_type, // Barang Masuk, Rusak, Adjustment, Retur
      quantity_sacks: stockData.transaction_type === 'Barang Masuk' ? qtySacks : -qtySacks,
      quantity_kg: stockData.transaction_type === 'Barang Masuk' ? qtyKg : -qtyKg,
      reference_type: 'MANUAL',
      transaction_date: stockData.transaction_date,
      notes: stockData.notes
    };

    setInventoryLogs([newLog, ...inventoryLogs]);
    setShowStockModal(false);
  };

  const handleAddCustomer = (custData) => {
    const newCust = {
      id: `cust-${Date.now()}`,
      customer_code: `CUST-${String(customers.length + 1).padStart(3, '0')}`,
      ...custData,
      status: 'ACTIVE'
    };
    setCustomers([...customers, newCust]);
    setShowCustomerModal(false);
  };

  const handleAddExpense = (expData) => {
    const newExp = {
      id: `exp-${Date.now()}`,
      expense_number: `EXP-2026-${String(expenses.length + 1).padStart(3, '0')}`,
      ...expData,
      amount: Number(expData.amount)
    };
    setExpenses([newExp, ...expenses]);
    setShowExpenseModal(false);
  };

  // Navigation Items
  const sidebarItems = [
    { id: 'dashboard', label: 'DASHBOARD', icon: LayoutDashboard },
    { id: 'orders', label: 'ORDER / PENJUALAN', icon: ShoppingCart },
    { id: 'customers', label: 'PELANGGAN', icon: Users },
    { id: 'products', label: 'PRODUK', icon: Package },
    { id: 'stock', label: 'STOK INVENTORY', icon: Boxes },
    { id: 'invoices', label: 'INVOICE', icon: FileText },
    { id: 'payments', label: 'PEMBAYARAN', icon: CreditCard },
    { id: 'receivables', label: 'PIUTANG', icon: Clock },
    { id: 'shipments', label: 'PENGIRIMAN', icon: Truck },
    { id: 'suppliers', label: 'SUPPLIER / PETANI', icon: UserCheck },
    { id: 'expenses', label: 'BIAYA OPERASIONAL', icon: DollarSign },
    { id: 'reports', label: 'LAPORAN KEUANGAN', icon: BarChart3 },
    { id: 'settings', label: 'PENGATURAN', icon: Settings },
  ];

  return (
    <div className="flex h-screen bg-slate-50 font-sans text-slate-800 antialiased overflow-hidden">
      {/* --- SIDEBAR NAVIGATION --- */}
      <aside className="w-64 bg-slate-900 text-slate-200 flex flex-col justify-between shadow-xl z-20">
        <div>
          {/* Business Brand Header */}
          <div className="p-5 border-b border-slate-800 flex items-center space-x-3 bg-slate-950">
            <div className="bg-emerald-500 p-2 rounded-lg text-slate-950 font-extrabold">
              <Package className="w-6 h-6" />
            </div>
            <div>
              <h1 className="font-bold text-base tracking-wide text-white">EDAMAME FRESH</h1>
              <p className="text-xs text-emerald-400 font-medium">Business Suite v1.0</p>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="p-3 space-y-1 overflow-y-auto max-h-[calc(100vh-160px)] custom-scrollbar">
            {sidebarItems.map(item => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-xs font-semibold tracking-wider transition-all duration-150 ${
                    isActive
                      ? 'bg-emerald-600 text-white shadow-md shadow-emerald-900/40'
                      : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* User Role Quick Switcher */}
        <div className="p-4 border-t border-slate-800 bg-slate-950">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <span>Hak Akses Logged-In:</span>
            <span className="font-bold text-emerald-400">{userRole}</span>
          </div>
          <select
            value={userRole}
            onChange={(e) => setUserRole(e.target.value)}
            className="w-full bg-slate-800 border border-slate-700 text-white text-xs rounded-md p-2 focus:ring-1 focus:ring-emerald-500 outline-none"
          >
            <option value="ADMIN">ADMIN (Full Access)</option>
            <option value="STAFF">STAFF (Operational)</option>
            <option value="VIEWER">VIEWER (Read-Only)</option>
          </select>
        </div>
      </aside>

      {/* --- MAIN CONTENT AREA --- */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar Header */}
        <header className="h-16 bg-white border-b border-slate-200 px-6 flex items-center justify-between shadow-sm z-10">
          <div className="flex items-center space-x-4">
            <h2 className="text-lg font-bold text-slate-800 uppercase tracking-tight">
              {sidebarItems.find(i => i.id === activeTab)?.label}
            </h2>
            <span className="text-xs bg-emerald-100 text-emerald-800 font-medium px-2.5 py-1 rounded-full border border-emerald-200">
              Perdagangan Segar (1 Karung = 30 Kg)
            </span>
          </div>

          {/* Quick Actions & Global Search */}
          <div className="flex items-center space-x-3">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
              <input
                type="text"
                placeholder="Cari order, cust, invoice..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 pr-4 py-1.5 text-xs bg-slate-100 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 w-64"
              />
            </div>
            {userRole !== 'VIEWER' && (
              <button
                onClick={() => setShowOrderModal(true)}
                className="bg-emerald-600 hover:bg-emerald-700 text-white px-3.5 py-1.5 rounded-lg text-xs font-semibold flex items-center space-x-1.5 shadow-sm transition"
              >
                <Plus className="w-4 h-4" />
                <span>+ Buat Order Baru</span>
              </button>
            )}
          </div>
        </header>

        {/* Dynamic Workspace Container */}
        <main className="flex-1 overflow-y-auto p-6 bg-slate-100">

          {/* ========================================================= */}
          {/* TAB 1: DASHBOARD                                         */}
          {/* ========================================================= */}
          {activeTab === 'dashboard' && (
            <div className="space-y-6">
              {/* Stok Metric Quick Warning Banner */}
              {currentStock.isLow && (
                <div className="bg-amber-50 border-l-4 border-amber-500 p-4 rounded-r-lg flex items-center justify-between shadow-sm">
                  <div className="flex items-center space-x-3">
                    <AlertTriangle className="w-6 h-6 text-amber-600" />
                    <div>
                      <h4 className="font-bold text-amber-900 text-sm">⚠️ PERINGATAN STOK RENDAH!</h4>
                      <p className="text-xs text-amber-700">
                        Sisa stok saat ini {formatNum(currentStock.totalKg)} kg ({currentStock.totalSacks} Karung). Berada di bawah batas minimum {formatNum(currentStock.minStock)} kg. Segera hubungi supplier mitra petani.
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setShowStockModal(true)}
                    className="bg-amber-600 text-white text-xs px-3 py-1.5 rounded-md font-semibold hover:bg-amber-700"
                  >
                    + Tambah Stok Segar
                  </button>
                </div>
              )}

              {/* KPI Metrics Dashboard Overview */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Penjualan</p>
                      <h3 className="text-xl font-extrabold text-slate-800 mt-1">{formatRupiah(metrics.omzet)}</h3>
                    </div>
                    <div className="bg-emerald-50 p-2 rounded-lg text-emerald-600">
                      <DollarSign className="w-5 h-5" />
                    </div>
                  </div>
                  <div className="mt-4 text-xs text-slate-500 border-t pt-2 flex justify-between">
                    <span>Total Order: <strong>{metrics.totalOrdersCount} Transaksi</strong></span>
                    <span className="text-emerald-600 font-semibold">+100% Aktif</span>
                  </div>
                </div>

                <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Volume Terjual</p>
                      <h3 className="text-xl font-extrabold text-slate-800 mt-1">{metrics.totalTonSold} Ton</h3>
                    </div>
                    <div className="bg-blue-50 p-2 rounded-lg text-blue-600">
                      <Package className="w-5 h-5" />
                    </div>
                  </div>
                  <div className="mt-4 text-xs text-slate-500 border-t pt-2 flex justify-between">
                    <span>{formatNum(metrics.totalSacksSold)} Karung</span>
                    <span>{formatNum(metrics.totalKgSold)} Kg</span>
                  </div>
                </div>

                <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Estimasi Laba Bersih</p>
                      <h3 className="text-xl font-extrabold text-emerald-600 mt-1">{formatRupiah(metrics.labaBersih)}</h3>
                    </div>
                    <div className="bg-emerald-50 p-2 rounded-lg text-emerald-600">
                      <BarChart3 className="w-5 h-5" />
                    </div>
                  </div>
                  <div className="mt-4 text-xs text-slate-500 border-t pt-2 flex justify-between">
                    <span>Laba Kotor: {formatRupiah(metrics.labaKotor)}</span>
                  </div>
                </div>

                <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Piutang Aktif</p>
                      <h3 className="text-xl font-extrabold text-rose-600 mt-1">{formatRupiah(metrics.totalPiutang)}</h3>
                    </div>
                    <div className="bg-rose-50 p-2 rounded-lg text-rose-600">
                      <Clock className="w-5 h-5" />
                    </div>
                  </div>
                  <div className="mt-4 text-xs text-slate-500 border-t pt-2 flex justify-between">
                    <span>Belum Diterima Kas</span>
                  </div>
                </div>
              </div>

              {/* Status Stok Realtime Gauge Box */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm lg:col-span-1">
                  <h3 className="text-sm font-bold text-slate-800 border-b pb-3 uppercase tracking-wider flex items-center justify-between">
                    <span>KONDISI STOK EDAMAME</span>
                    <Boxes className="w-4 h-4 text-emerald-600" />
                  </h3>

                  <div className="mt-6 text-center">
                    <span className="text-4xl font-black text-slate-800 tracking-tight">{formatNum(currentStock.totalSacks)}</span>
                    <span className="text-slate-500 text-sm font-bold ml-1">Karung</span>

                    <div className="flex justify-center items-center space-x-4 mt-3 text-sm font-semibold text-slate-600">
                      <span className="bg-slate-100 px-3 py-1 rounded-full">{formatNum(currentStock.totalKg)} Kg</span>
                      <span className="bg-emerald-50 text-emerald-700 px-3 py-1 rounded-full">{currentStock.totalTon} Ton</span>
                    </div>

                    <div className="mt-6 pt-4 border-t border-slate-100 flex justify-between items-center text-xs">
                      <span className="text-slate-500">Batas Minimum: <strong>{formatNum(currentStock.minStock)} Kg</strong></span>
                      <span className={`font-bold px-2 py-0.5 rounded ${currentStock.isLow ? 'bg-rose-100 text-rose-800' : 'bg-emerald-100 text-emerald-800'}`}>
                        {currentStock.isLow ? '⚠️ AMBANG BATAS' : '✅ STOK AMAN'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Transaksi Penjualan Terakhir */}
                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm lg:col-span-2">
                  <div className="flex justify-between items-center border-b pb-3">
                    <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">ORDER TERAKHIR</h3>
                    <button onClick={() => setActiveTab('orders')} className="text-xs text-emerald-600 font-bold hover:underline">Lihat Semua →</button>
                  </div>
                  <div className="mt-4 overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-slate-50 text-slate-500 uppercase font-semibold">
                        <tr>
                          <th className="p-2.5">No. Order</th>
                          <th className="p-2.5">Pelanggan</th>
                          <th className="p-2.5">Jumlah</th>
                          <th className="p-2.5">Total Rp</th>
                          <th className="p-2.5">Status Order</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                        {orders.slice(0, 5).map(o => (
                          <tr key={o.id} className="hover:bg-slate-50">
                            <td className="p-2.5 font-bold text-emerald-700">{o.order_number}</td>
                            <td className="p-2.5">{o.customer_name}</td>
                            <td className="p-2.5">{o.quantity_sacks} Karung ({o.quantity_kg} kg)</td>
                            <td className="p-2.5 font-semibold">{formatRupiah(o.grand_total)}</td>
                            <td className="p-2.5">
                              <span className="bg-blue-100 text-blue-800 text-[10px] font-bold px-2 py-0.5 rounded">
                                {o.order_status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* TAB 2: ORDER / PENJUALAN                                  */}
          {/* ========================================================= */}
          {activeTab === 'orders' && (
            <div className="space-y-4">
              <div className="flex justify-between items-center bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                <div>
                  <h3 className="font-bold text-slate-800">Daftar Order Penjualan</h3>
                  <p className="text-xs text-slate-500">Seluruh pencatatan transaksi pesanan edamame segar</p>
                </div>
                {userRole !== 'VIEWER' && (
                  <button
                    onClick={() => setShowOrderModal(true)}
                    className="bg-emerald-600 text-white text-xs px-3.5 py-2 rounded-lg font-bold hover:bg-emerald-700 flex items-center space-x-1"
                  >
                    <Plus className="w-4 h-4" />
                    <span>+ Buat Order Baru</span>
                  </button>
                )}
              </div>

              <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-800 text-slate-200 uppercase font-bold tracking-wider">
                    <tr>
                      <th className="p-3">No. Order</th>
                      <th className="p-3">Tanggal</th>
                      <th className="p-3">Pelanggan</th>
                      <th className="p-3 text-right">Volume (Karung / Kg / Ton)</th>
                      <th className="p-3 text-right">Grand Total</th>
                      <th className="p-3">Status Bayar</th>
                      <th className="p-3">Status Order</th>
                      <th className="p-3 text-center">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 font-medium">
                    {orders.map(o => (
                      <tr key={o.id} className="hover:bg-slate-50 text-slate-700">
                        <td className="p-3 font-bold text-emerald-700">{o.order_number}</td>
                        <td className="p-3">{o.order_date}</td>
                        <td className="p-3 font-semibold text-slate-900">{o.customer_name}</td>
                        <td className="p-3 text-right font-mono">
                          {o.quantity_sacks} Karung | {o.quantity_kg} Kg | <span className="text-emerald-700 font-bold">{o.tonnage} Ton</span>
                        </td>
                        <td className="p-3 text-right font-extrabold text-slate-900">{formatRupiah(o.grand_total)}</td>
                        <td className="p-3">
                          <span className={`px-2 py-0.5 text-[10px] font-bold rounded ${
                            o.payment_status === 'PAID' ? 'bg-emerald-100 text-emerald-800' :
                            o.payment_status === 'PARTIAL' ? 'bg-amber-100 text-amber-800' : 'bg-rose-100 text-rose-800'
                          }`}>
                            {o.payment_status === 'PAID' ? 'LUNAS' : o.payment_status === 'PARTIAL' ? 'SEBAGIAN' : 'BELUM BAYAR'}
                          </span>
                        </td>
                        <td className="p-3">
                          <span className="bg-blue-100 text-blue-800 text-[10px] font-bold px-2 py-0.5 rounded">
                            {o.order_status}
                          </span>
                        </td>
                        <td className="p-3 text-center space-x-1">
                          <button
                            onClick={() => {
                              const inv = invoices.find(i => i.order_id === o.id);
                              if (inv) setActiveInvoiceForPrint(inv);
                            }}
                            className="bg-slate-100 hover:bg-slate-200 text-slate-700 p-1.5 rounded inline-flex items-center"
                            title="Lihat / Cetak Invoice"
                          >
                            <FileText className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* TAB 3: PELANGGAN                                         */}
          {/* ========================================================= */}
          {activeTab === 'customers' && (
            <div className="space-y-4">
              <div className="flex justify-between items-center bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                <div>
                  <h3 className="font-bold text-slate-800">Database Pelanggan</h3>
                  <p className="text-xs text-slate-500">Reseller, Distributor, Restoran, dan Food Business</p>
                </div>
                {userRole !== 'VIEWER' && (
                  <button
                    onClick={() => setShowCustomerModal(true)}
                    className="bg-emerald-600 text-white text-xs px-3.5 py-2 rounded-lg font-bold hover:bg-emerald-700 flex items-center space-x-1"
                  >
                    <Plus className="w-4 h-4" />
                    <span>+ Tambah Pelanggan</span>
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {customers.map(c => {
                  const custOrders = orders.filter(o => o.customer_id === c.id);
                  const totalKg = custOrders.reduce((acc, o) => acc + o.quantity_kg, 0);
                  const totalOmzet = custOrders.reduce((acc, o) => acc + o.grand_total, 0);

                  return (
                    <div key={c.id} className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between">
                      <div>
                        <div className="flex justify-between items-start">
                          <span className="text-[10px] font-bold bg-slate-100 text-slate-600 px-2 py-0.5 rounded uppercase">{c.customer_type}</span>
                          <span className="text-xs font-mono font-bold text-emerald-600">{c.customer_code}</span>
                        </div>
                        <h4 className="font-bold text-base text-slate-800 mt-2">{c.name}</h4>
                        <p className="text-xs text-slate-500 font-medium">{c.company_name || 'Perorangan'}</p>

                        <div className="mt-4 space-y-1.5 text-xs text-slate-600">
                          <div className="flex items-center space-x-2">
                            <Phone className="w-3.5 h-3.5 text-slate-400" />
                            <span>WA: {c.whatsapp}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <MapPin className="w-3.5 h-3.5 text-slate-400" />
                            <span>{c.city}, {c.province}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Clock className="w-3.5 h-3.5 text-slate-400" />
                            <span>Termin: {c.payment_term_days} Hari</span>
                          </div>
                        </div>
                      </div>

                      <div className="mt-5 pt-3 border-t border-slate-100 bg-slate-50 -mx-5 -mb-5 p-4 rounded-b-xl flex justify-between items-center text-xs">
                        <div>
                          <p className="text-[10px] text-slate-400 font-bold uppercase">Total Pembelian</p>
                          <p className="font-extrabold text-slate-800">{formatNum(totalKg)} Kg ({(totalKg/1000).toFixed(1)} Ton)</p>
                        </div>
                        <button
                          onClick={() => setSelectedCustomerDetail(c)}
                          className="bg-white border border-slate-300 hover:bg-slate-100 text-slate-700 px-2.5 py-1 rounded text-xs font-bold"
                        >
                          Detail →
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* TAB 4: PRODUK                                            */}
          {/* ========================================================= */}
          {activeTab === 'products' && (
            <div className="space-y-4">
              <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                <h3 className="font-bold text-slate-800 mb-1">Master Data Produk</h3>
                <p className="text-xs text-slate-500">Standar produk Edamame Fresh (1 Karung = 30 Kg)</p>

                <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                  {products.map(p => (
                    <div key={p.id} className="bg-emerald-50 border border-emerald-200 p-5 rounded-xl">
                      <div className="flex justify-between items-start">
                        <span className="bg-emerald-600 text-white text-xs px-2.5 py-0.5 rounded font-bold">{p.product_code}</span>
                        <span className="text-xs font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded">{p.status}</span>
                      </div>
                      <h4 className="text-lg font-black text-slate-800 mt-2">{p.name}</h4>

                      <div className="mt-4 grid grid-cols-2 gap-4 text-xs bg-white p-3 rounded-lg border border-emerald-100">
                        <div>
                          <p className="text-slate-400 font-medium">Satuan Standar</p>
                          <p className="font-bold text-slate-800">1 Karung = {p.kg_per_sack} Kg</p>
                        </div>
                        <div>
                          <p className="text-slate-400 font-medium">Batas Minimum Stok</p>
                          <p className="font-bold text-slate-800">{p.minimum_stock_kg} Kg ({p.minimum_stock_kg/30} Karung)</p>
                        </div>
                        <div>
                          <p className="text-slate-400 font-medium">Harga Beli / Karung</p>
                          <p className="font-bold text-slate-800">{formatRupiah(p.purchase_price)}</p>
                        </div>
                        <div>
                          <p className="text-slate-400 font-medium">Harga Jual / Karung</p>
                          <p className="font-bold text-emerald-700">{formatRupiah(p.selling_price)}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* TAB 5: STOK INVENTORY                                    */}
          {/* ========================================================= */}
          {activeTab === 'stock' && (
            <div className="space-y-4">
              <div className="flex justify-between items-center bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                <div>
                  <h3 className="font-bold text-slate-800">Stok & Histori Pergerakan Barang</h3>
                  <p className="text-xs text-slate-500">Pencatatan Masuk, Keluar, Adjustment & Rusak</p>
                </div>
                {userRole !== 'VIEWER' && (
                  <button
                    onClick={() => setShowStockModal(true)}
                    className="bg-emerald-600 text-white text-xs px-3.5 py-2 rounded-lg font-bold hover:bg-emerald-700 flex items-center space-x-1"
                  >
                    <Plus className="w-4 h-4" />
                    <span>+ Catat Transaksi Stok</span>
                  </button>
                )}
              </div>

              {/* Realtime Stock Metrics */}
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-white p-4 rounded-xl border border-slate-200 text-center">
                  <p className="text-xs font-bold text-slate-400 uppercase">Stok Karung</p>
                  <p className="text-2xl font-black text-slate-800 mt-1">{formatNum(currentStock.totalSacks)} Karung</p>
                </div>
                <div className="bg-white p-4 rounded-xl border border-slate-200 text-center">
                  <p className="text-xs font-bold text-slate-400 uppercase">Total Berat (Kg)</p>
                  <p className="text-2xl font-black text-slate-800 mt-1">{formatNum(currentStock.totalKg)} Kg</p>
                </div>
                <div className="bg-white p-4 rounded-xl border border-slate-200 text-center">
                  <p className="text-xs font-bold text-slate-400 uppercase">Total Tonase</p>
                  <p className="text-2xl font-black text-emerald-600 mt-1">{currentStock.totalTon} Ton</p>
                </div>
              </div>

              {/* Logs Table */}
              <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-800 text-slate-200 uppercase font-bold">
                    <tr>
                      <th className="p-3">No. Transaksi</th>
                      <th className="p-3">Tanggal</th>
                      <th className="p-3">Tipe</th>
                      <th className="p-3 text-right">Karung</th>
                      <th className="p-3 text-right">Berat Kg</th>
                      <th className="p-3">Keterangan</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 font-medium">
                    {inventoryLogs.map(log => (
                      <tr key={log.id} className="hover:bg-slate-50">
                        <td className="p-3 font-mono font-bold text-slate-700">{log.transaction_number}</td>
                        <td className="p-3">{log.transaction_date}</td>
                        <td className="p-3">
                          <span className={`px-2 py-0.5 text-[10px] font-bold rounded ${
                            log.quantity_sacks > 0 ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                          }`}>
                            {log.transaction_type}
                          </span>
                        </td>
                        <td className={`p-3 text-right font-bold ${log.quantity_sacks > 0 ? 'text-emerald-700' : 'text-rose-600'}`}>
                          {log.quantity_sacks > 0 ? `+${log.quantity_sacks}` : log.quantity_sacks}
                        </td>
                        <td className="p-3 text-right font-bold">{log.quantity_kg} kg</td>
                        <td className="p-3 text-slate-500">{log.notes}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* TAB 6: INVOICE                                           */}
          {/* ========================================================= */}
          {activeTab === 'invoices' && (
            <div className="space-y-4">
              <div className="flex justify-between items-center bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                <div>
                  <h3 className="font-bold text-slate-800">Tagihan & Invoice Penjualan</h3>
                  <p className="text-xs text-slate-500">Cetak invoice resmi dan struk thermal printer</p>
                </div>
              </div>

              <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-800 text-slate-200 uppercase font-bold">
                    <tr>
                      <th className="p-3">No. Invoice</th>
                      <th className="p-3">Pelanggan</th>
                      <th className="p-3">Tanggal</th>
                      <th className="p-3">Jatuh Tempo</th>
                      <th className="p-3 text-right">Grand Total</th>
                      <th className="p-3 text-right">Dibayar</th>
                      <th className="p-3 text-right">Sisa Piutang</th>
                      <th className="p-3">Status</th>
                      <th className="p-3 text-center">Cetak / Lihat</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 font-medium">
                    {invoices.map(inv => (
                      <tr key={inv.id} className="hover:bg-slate-50">
                        <td className="p-3 font-bold text-emerald-700">{inv.invoice_number}</td>
                        <td className="p-3 font-semibold">{inv.customer_name}</td>
                        <td className="p-3">{inv.invoice_date}</td>
                        <td className="p-3">{inv.due_date}</td>
                        <td className="p-3 text-right font-bold">{formatRupiah(inv.grand_total)}</td>
                        <td className="p-3 text-right text-emerald-600 font-semibold">{formatRupiah(inv.paid_amount)}</td>
                        <td className="p-3 text-right text-rose-600 font-extrabold">{formatRupiah(inv.outstanding_amount)}</td>
                        <td className="p-3">
                          <span className={`px-2 py-0.5 text-[10px] font-bold rounded ${
                            inv.payment_status === 'PAID' ? 'bg-emerald-100 text-emerald-800' :
                            inv.payment_status === 'PARTIAL' ? 'bg-amber-100 text-amber-800' : 'bg-rose-100 text-rose-800'
                          }`}>
                            {inv.payment_status}
                          </span>
                        </td>
                        <td className="p-3 text-center space-x-1">
                          <button
                            onClick={() => setActiveInvoiceForPrint(inv)}
                            className="bg-emerald-50 text-emerald-700 hover:bg-emerald-100 px-2 py-1 rounded text-[10px] font-bold"
                          >
                            Invoice
                          </button>
                          <button
                            onClick={() => setActiveReceiptForPrint(inv)}
                            className="bg-slate-100 text-slate-700 hover:bg-slate-200 px-2 py-1 rounded text-[10px] font-bold"
                          >
                            Struk Thermal
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* TAB 7: PEMBAYARAN                                        */}
          {/* ========================================================= */}
          {activeTab === 'payments' && (
            <div className="space-y-4">
              <div className="flex justify-between items-center bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                <div>
                  <h3 className="font-bold text-slate-800">Catatan Pembayaran Masuk</h3>
                  <p className="text-xs text-slate-500">Penerimaan kas/transfer dari pelanggan</p>
                </div>
                {userRole !== 'VIEWER' && (
                  <button
                    onClick={() => setShowPaymentModal(true)}
                    className="bg-emerald-600 text-white text-xs px-3.5 py-2 rounded-lg font-bold hover:bg-emerald-700 flex items-center space-x-1"
                  >
                    <Plus className="w-4 h-4" />
                    <span>+ Catat Pembayaran</span>
                  </button>
                )}
              </div>

              <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-800 text-slate-200 uppercase font-bold">
                    <tr>
                      <th className="p-3">No. Bayar</th>
                      <th className="p-3">No. Invoice</th>
                      <th className="p-3">Pelanggan</th>
                      <th className="p-3">Tanggal Bayar</th>
                      <th className="p-3">Metode</th>
                      <th className="p-3 text-right">Nominal Rp</th>
                      <th className="p-3">Catatan</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 font-medium">
                    {payments.map(p => (
                      <tr key={p.id} className="hover:bg-slate-50">
                        <td className="p-3 font-mono font-bold text-slate-700">{p.payment_number}</td>
                        <td className="p-3 font-bold text-emerald-700">{p.invoice_number}</td>
                        <td className="p-3 font-semibold">{p.customer_name}</td>
                        <td className="p-3">{p.payment_date}</td>
                        <td className="p-3"><span className="bg-slate-100 px-2 py-0.5 rounded font-bold">{p.payment_method}</span></td>
                        <td className="p-3 text-right font-extrabold text-emerald-600">{formatRupiah(p.amount)}</td>
                        <td className="p-3 text-slate-500">{p.notes}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* TAB 8: PIUTANG                                           */}
          {/* ========================================================= */}
          {activeTab === 'receivables' && (
            <div className="space-y-4">
              <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                <h3 className="font-bold text-slate-800">Kontrol Piutang Dagang (Accounts Receivable)</h3>
                <p className="text-xs text-slate-500">Analisis keterlambatan tagihan pelanggan</p>
              </div>

              {/* Receivables Aging Box */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-white p-4 rounded-xl border-l-4 border-emerald-500 shadow-sm">
                  <p className="text-[10px] font-bold uppercase text-slate-400">Total Piutang Aktif</p>
                  <p className="text-lg font-black text-slate-800 mt-1">{formatRupiah(metrics.totalPiutang)}</p>
                </div>
                <div className="bg-white p-4 rounded-xl border-l-4 border-blue-500 shadow-sm">
                  <p className="text-[10px] font-bold uppercase text-slate-400">Lancar (Belum Jatuh Tempo)</p>
                  <p className="text-lg font-black text-blue-600 mt-1">{formatRupiah(metrics.totalPiutang)}</p>
                </div>
                <div className="bg-white p-4 rounded-xl border-l-4 border-amber-500 shadow-sm">
                  <p className="text-[10px] font-bold uppercase text-slate-400">Terlambat 1 - 30 Hari</p>
                  <p className="text-lg font-black text-amber-600 mt-1">Rp 0</p>
                </div>
                <div className="bg-white p-4 rounded-xl border-l-4 border-rose-500 shadow-sm">
                  <p className="text-[10px] font-bold uppercase text-slate-400">Terlambat &gt; 30 Hari</p>
                  <p className="text-lg font-black text-rose-600 mt-1">Rp 0</p>
                </div>
              </div>

              <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-800 text-slate-200 uppercase font-bold">
                    <tr>
                      <th className="p-3">Pelanggan</th>
                      <th className="p-3">No. Invoice</th>
                      <th className="p-3">Jatuh Tempo</th>
                      <th className="p-3 text-right">Total Invoice</th>
                      <th className="p-3 text-right">Sudah Dibayar</th>
                      <th className="p-3 text-right">Sisa Piutang</th>
                      <th className="p-3">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 font-medium">
                    {invoices.filter(i => i.outstanding_amount > 0).map(inv => (
                      <tr key={inv.id} className="hover:bg-slate-50">
                        <td className="p-3 font-bold text-slate-900">{inv.customer_name}</td>
                        <td className="p-3 font-mono font-bold text-emerald-700">{inv.invoice_number}</td>
                        <td className="p-3">{inv.due_date}</td>
                        <td className="p-3 text-right">{formatRupiah(inv.grand_total)}</td>
                        <td className="p-3 text-right text-emerald-600">{formatRupiah(inv.paid_amount)}</td>
                        <td className="p-3 text-right font-extrabold text-rose-600">{formatRupiah(inv.outstanding_amount)}</td>
                        <td className="p-3">
                          <span className="bg-amber-100 text-amber-800 text-[10px] font-bold px-2 py-0.5 rounded">
                            PARTIAL / BELUM LUNAS
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* TAB 9: PENGIRIMAN                                        */}
          {/* ========================================================= */}
          {activeTab === 'shipments' && (
            <div className="space-y-4">
              <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                <h3 className="font-bold text-slate-800">Modul Pengiriman Bus & Ekspedisi</h3>
                <p className="text-xs text-slate-500">Tracking armada pengiriman barang ke pemesan</p>
              </div>

              <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-800 text-slate-200 uppercase font-bold">
                    <tr>
                      <th className="p-3">No. Resi/Pengiriman</th>
                      <th className="p-3">No. Order</th>
                      <th className="p-3">Pelanggan</th>
                      <th className="p-3">Armada / Bus</th>
                      <th className="p-3">Tujuan</th>
                      <th className="p-3 text-right">Ongkir</th>
                      <th className="p-3">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 font-medium">
                    {shipments.map(s => (
                      <tr key={s.id} className="hover:bg-slate-50">
                        <td className="p-3 font-mono font-bold text-emerald-700">{s.shipment_number}</td>
                        <td className="p-3 font-bold">{s.order_number}</td>
                        <td className="p-3 font-semibold">{s.customer_name}</td>
                        <td className="p-3"><span className="bg-slate-100 px-2 py-0.5 rounded font-bold">{s.expedition_name} ({s.transportation_type})</span></td>
                        <td className="p-3">{s.destination}</td>
                        <td className="p-3 text-right font-bold">{formatRupiah(s.shipping_cost)}</td>
                        <td className="p-3">
                          <span className="bg-blue-100 text-blue-800 text-[10px] font-bold px-2 py-0.5 rounded">
                            {s.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* TAB 10: SUPPLIER / PETANI                                 */}
          {/* ========================================================= */}
          {activeTab === 'suppliers' && (
            <div className="space-y-4">
              <div className="flex justify-between items-center bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                <div>
                  <h3 className="font-bold text-slate-800">Mitra Petani & Supplier Edamame</h3>
                  <p className="text-xs text-slate-500">Kelompok tani pemasok edamame segar</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {suppliers.map(sup => (
                  <div key={sup.id} className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                    <div className="flex justify-between items-start">
                      <span className="text-xs font-mono font-bold text-emerald-700">{sup.supplier_code}</span>
                      <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded">{sup.status}</span>
                    </div>
                    <h4 className="font-bold text-base text-slate-800 mt-2">{sup.name}</h4>
                    <p className="text-xs text-slate-500">{sup.address}, {sup.city}</p>

                    <div className="mt-4 grid grid-cols-2 gap-2 text-xs bg-slate-50 p-3 rounded-lg border border-slate-100">
                      <div>
                        <p className="text-slate-400">Kapasitas Panen</p>
                        <p className="font-bold text-slate-800">{formatNum(sup.capacity_kg)} Kg / Panen</p>
                      </div>
                      <div>
                        <p className="text-slate-400">Harga Beli Standar</p>
                        <p className="font-bold text-emerald-700">{formatRupiah(sup.purchase_price)} / Kg</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* TAB 11: BIAYA OPERASIONAL                                 */}
          {/* ========================================================= */}
          {activeTab === 'expenses' && (
            <div className="space-y-4">
              <div className="flex justify-between items-center bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                <div>
                  <h3 className="font-bold text-slate-800">Pengeluaran & Biaya Operasional</h3>
                  <p className="text-xs text-slate-500">Transport, es, karung, packaging, & gaji</p>
                </div>
                {userRole !== 'VIEWER' && (
                  <button
                    onClick={() => setShowExpenseModal(true)}
                    className="bg-emerald-600 text-white text-xs px-3.5 py-2 rounded-lg font-bold hover:bg-emerald-700 flex items-center space-x-1"
                  >
                    <Plus className="w-4 h-4" />
                    <span>+ Catat Biaya</span>
                  </button>
                )}
              </div>

              <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-800 text-slate-200 uppercase font-bold">
                    <tr>
                      <th className="p-3">No. Biaya</th>
                      <th className="p-3">Tanggal</th>
                      <th className="p-3">Kategori</th>
                      <th className="p-3">Deskripsi</th>
                      <th className="p-3">Metode</th>
                      <th className="p-3 text-right">Nominal Rp</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 font-medium">
                    {expenses.map(e => (
                      <tr key={e.id} className="hover:bg-slate-50">
                        <td className="p-3 font-mono font-bold text-slate-700">{e.expense_number}</td>
                        <td className="p-3">{e.expense_date}</td>
                        <td className="p-3"><span className="bg-slate-100 px-2 py-0.5 rounded font-bold">{e.category}</span></td>
                        <td className="p-3 text-slate-800 font-semibold">{e.description}</td>
                        <td className="p-3">{e.payment_method}</td>
                        <td className="p-3 text-right font-extrabold text-rose-600">{formatRupiah(e.amount)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* TAB 12: LAPORAN KEUANGAN                                  */}
          {/* ========================================================= */}
          {activeTab === 'reports' && (
            <div className="space-y-6">
              <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                <h3 className="font-bold text-slate-800">Laporan Keuangan & Perhitungan Bisnis</h3>
                <p className="text-xs text-slate-500">Perhitungan Omzet, HPP, Laba Kotor & Laba Bersih Transaksional</p>

                <div className="mt-6 space-y-3 max-w-xl bg-slate-50 p-6 rounded-xl border border-slate-200">
                  <div className="flex justify-between items-center text-sm">
                    <span className="font-semibold text-slate-600">Total Omzet Penjualan</span>
                    <span className="font-black text-slate-900">{formatRupiah(metrics.omzet)}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm text-rose-600">
                    <span className="font-semibold">HPP (Harga Pokok Penjualan)</span>
                    <span className="font-bold">- {formatRupiah(metrics.hpp)}</span>
                  </div>
                  <div className="border-t border-slate-300 pt-2 flex justify-between items-center text-base">
                    <span className="font-bold text-slate-800">LABA KOTOR (Gross Profit)</span>
                    <span className="font-black text-emerald-700">{formatRupiah(metrics.labaKotor)}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm text-rose-600">
                    <span className="font-semibold">Total Biaya Operasional</span>
                    <span className="font-bold">- {formatRupiah(metrics.totalOperasional)}</span>
                  </div>
                  <div className="border-t-2 border-slate-800 pt-3 flex justify-between items-center text-lg">
                    <span className="font-extrabold text-slate-900">LABA BERSIH (Net Profit)</span>
                    <span className="font-black text-emerald-600">{formatRupiah(metrics.labaBersih)}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* TAB 13: PENGATURAN                                        */}
          {/* ========================================================= */}
          {activeTab === 'settings' && (
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm max-w-xl">
              <h3 className="font-bold text-slate-800 border-b pb-3">Pengaturan Aplikasi & Profil Bisnis</h3>
              <div className="mt-4 space-y-4 text-xs">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Nama Perusahaan / Perdagangan</label>
                  <input type="text" defaultValue="EDAMAME FRESH JEMBER TRADING" className="w-full p-2 border rounded font-semibold bg-slate-50" readOnly />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Konversi Berat Default</label>
                  <input type="text" defaultValue="1 Karung = 30 Kg | 1 Ton = 1.000 Kg" className="w-full p-2 border rounded font-semibold bg-slate-50" readOnly />
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* ========================================================================= */}
      {/* MODAL SECTION (FORM BUAT ORDER, PELANGGAN, PEMBAYARAN, STOK, ETC)       */}
      {/* ========================================================================= */}

      {/* MODAL: BUAT ORDER BARU */}
      {showOrderModal && (
        <OrderFormModal
          customers={customers}
          products={products}
          onClose={() => setShowOrderModal(false)}
          onSubmit={handleCreateOrder}
          formatRupiah={formatRupiah}
        />
      )}

      {/* MODAL: CATAT PEMBAYARAN */}
      {showPaymentModal && (
        <PaymentFormModal
          invoices={invoices.filter(i => i.outstanding_amount > 0)}
          onClose={() => setShowPaymentModal(false)}
          onSubmit={handleRecordPayment}
          formatRupiah={formatRupiah}
        />
      )}

      {/* MODAL: TAMBAH STOK */}
      {showStockModal && (
        <StockFormModal
          suppliers={suppliers}
          onClose={() => setShowStockModal(false)}
          onSubmit={handleAddStock}
        />
      )}

      {/* MODAL: TAMBAH PELANGGAN */}
      {showCustomerModal && (
        <CustomerFormModal
          onClose={() => setShowCustomerModal(false)}
          onSubmit={handleAddCustomer}
        />
      )}

      {/* MODAL: CATAT BIAYA */}
      {showExpenseModal && (
        <ExpenseFormModal
          onClose={() => setShowExpenseModal(false)}
          onSubmit={handleAddExpense}
        />
      )}

      {/* MODAL: PRINT INVOICE RESMI */}
      {activeInvoiceForPrint && (
        <InvoicePrintModal
          invoice={activeInvoiceForPrint}
          order={orders.find(o => o.id === activeInvoiceForPrint.order_id)}
          customer={customers.find(c => c.id === activeInvoiceForPrint.customer_id)}
          onClose={() => setActiveInvoiceForPrint(null)}
          formatRupiah={formatRupiah}
        />
      )}

      {/* MODAL: PRINT STRUK THERMAL 80MM */}
      {activeReceiptForPrint && (
        <ThermalReceiptModal
          invoice={activeReceiptForPrint}
          order={orders.find(o => o.id === activeReceiptForPrint.order_id)}
          onClose={() => setActiveReceiptForPrint(null)}
          formatRupiah={formatRupiah}
        />
      )}

      {/* MODAL: CUSTOMER DETAIL & TRANSACTION HISTORY */}
      {selectedCustomerDetail && (
        <CustomerDetailModal
          customer={selectedCustomerDetail}
          customerOrders={orders.filter(o => o.customer_id === selectedCustomerDetail.id)}
          customerInvoices={invoices.filter(i => i.customer_id === selectedCustomerDetail.id)}
          onClose={() => setSelectedCustomerDetail(null)}
          formatRupiah={formatRupiah}
          formatNum={formatNum}
        />
      )}
    </div>
  );
}

// ============================================================================
// COMPONENT MODALS (SELF-CONTAINED IN SINGLE FILE)
// ============================================================================

// --- FORM BUAT ORDER MODAL ---
function OrderFormModal({ customers, products, onClose, onSubmit, formatRupiah }) {
  const [customerId, setCustomerId] = useState(customers[0]?.id || '');
  const [orderDate, setOrderDate] = useState('2026-08-30');
  const [deliveryDate, setDeliveryDate] = useState('2026-08-31');
  const [quantitySacks, setQuantitySacks] = useState(10);
  const [pricePerSack, setPricePerSack] = useState(products[0]?.selling_price || 600000);
  const [shippingCost, setShippingCost] = useState(150000);
  const [discount, setDiscount] = useState(0);
  const [notes, setNotes] = useState('');

  const selectedCustomer = customers.find(c => c.id === customerId);
  const paymentTermDays = selectedCustomer?.payment_term_days || 0;

  // Auto Calculations
  const qtyKg = quantitySacks * 30;
  const tonnage = (qtyKg / 1000).toFixed(2);
  const subtotal = quantitySacks * pricePerSack;
  const grandTotal = subtotal + Number(shippingCost || 0) - Number(discount || 0);

  // Auto calculate due date
  const dueDate = useMemo(() => {
    const d = new Date(orderDate);
    d.setDate(d.getDate() + Number(paymentTermDays));
    return d.toISOString().split('T')[0];
  }, [orderDate, paymentTermDays]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      customer_id: customerId,
      order_date: orderDate,
      delivery_date: deliveryDate,
      quantity_sacks: quantitySacks,
      price_per_sack: pricePerSack,
      shipping_cost: shippingCost,
      discount: discount,
      payment_term_days: paymentTermDays,
      due_date: dueDate,
      notes: notes
    });
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-5 border-b border-slate-200 flex justify-between items-center bg-slate-900 text-white rounded-t-xl">
          <h3 className="font-bold text-sm uppercase tracking-wider">FORM BUAT ORDER PENJUALAN EDAMAME</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-white"><X className="w-5 h-5" /></button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Pilih Pelanggan</label>
              <select
                value={customerId}
                onChange={(e) => setCustomerId(e.target.value)}
                className="w-full p-2 border rounded font-semibold focus:ring-2 focus:ring-emerald-500 outline-none"
              >
                {customers.map(c => (
                  <option key={c.id} value={c.id}>{c.name} - {c.company_name || c.customer_type}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">Termin Pembayaran</label>
              <input type="text" value={`${paymentTermDays} Hari (Jatuh Tempo: ${dueDate})`} className="w-full p-2 border rounded bg-slate-100 font-medium" readOnly />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Tanggal Order</label>
              <input type="date" value={orderDate} onChange={(e) => setOrderDate(e.target.value)} className="w-full p-2 border rounded font-semibold" required />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">Tanggal Pengiriman</label>
              <input type="date" value={deliveryDate} onChange={(e) => setDeliveryDate(e.target.value)} className="w-full p-2 border rounded font-semibold" required />
            </div>
          </div>

          {/* Quantity Calculation Panel */}
          <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-xl space-y-3">
            <h4 className="font-bold text-emerald-900 uppercase">Input Volume Pemesanan</h4>
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Jumlah Karung</label>
                <input
                  type="number"
                  min="1"
                  value={quantitySacks}
                  onChange={(e) => setQuantitySacks(Number(e.target.value))}
                  className="w-full p-2 border rounded text-base font-black text-emerald-800"
                  required
                />
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1">Konversi Kg</label>
                <input type="text" value={`${qtyKg} Kg`} className="w-full p-2 border rounded bg-white font-bold text-slate-800" readOnly />
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1">Konversi Ton</label>
                <input type="text" value={`${tonnage} Ton`} className="w-full p-2 border rounded bg-white font-bold text-slate-800" readOnly />
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Harga per Karung (Rp)</label>
              <input
                type="number"
                value={pricePerSack}
                onChange={(e) => setPricePerSack(Number(e.target.value))}
                className="w-full p-2 border rounded font-bold text-slate-800"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Ongkos Kirim (Rp)</label>
              <input type="number" value={shippingCost} onChange={(e) => setShippingCost(e.target.value)} className="w-full p-2 border rounded font-semibold" />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">Diskon (Rp)</label>
              <input type="number" value={discount} onChange={(e) => setDiscount(e.target.value)} className="w-full p-2 border rounded font-semibold" />
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Catatan Pengiriman / Bus / Ekspedisi</label>
            <textarea value={notes} onChange={(e) => setNotes(e.target.value)} className="w-full p-2 border rounded" placeholder="Contoh: Titip Bus Tiara Mas jam 8 malam"></textarea>
          </div>

          <div className="border-t pt-3 flex justify-between items-center bg-slate-50 -mx-6 -mb-6 p-6 rounded-b-xl">
            <div>
              <p className="text-[10px] text-slate-400 font-bold uppercase">Grand Total Tagihan</p>
              <p className="text-xl font-black text-emerald-700">{formatRupiah(grandTotal)}</p>
            </div>
            <div className="space-x-2">
              <button type="button" onClick={onClose} className="px-4 py-2 border rounded font-bold hover:bg-slate-100">Batal</button>
              <button type="submit" className="px-5 py-2 bg-emerald-600 text-white font-bold rounded hover:bg-emerald-700">Proses & Simpan Order</button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

// --- FORM CATAT PEMBAYARAN MODAL ---
function PaymentFormModal({ invoices, onClose, onSubmit, formatRupiah }) {
  const [invoiceId, setInvoiceId] = useState(invoices[0]?.id || '');
  const [paymentDate, setPaymentDate] = useState('2026-08-30');
  const [amount, setAmount] = useState(invoices[0]?.outstanding_amount || 0);
  const [paymentMethod, setPaymentMethod] = useState('Transfer Bank');
  const [notes, setNotes] = useState('');

  const selectedInv = invoices.find(i => i.id === invoiceId);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      invoice_id: invoiceId,
      payment_date: paymentDate,
      amount: amount,
      payment_method: paymentMethod,
      notes: notes
    });
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full">
        <div className="p-4 border-b flex justify-between items-center bg-slate-900 text-white rounded-t-xl">
          <h3 className="font-bold text-xs uppercase tracking-wider">CATAT PEMBAYARAN TAGIHAN INVOICE</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-white"><X className="w-4 h-4" /></button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4 text-xs">
          <div>
            <label className="block font-bold text-slate-700 mb-1">Pilih Invoice Belum Lunas</label>
            <select
              value={invoiceId}
              onChange={(e) => {
                setInvoiceId(e.target.value);
                const inv = invoices.find(i => i.id === e.target.value);
                if (inv) setAmount(inv.outstanding_amount);
              }}
              className="w-full p-2 border rounded font-semibold"
            >
              {invoices.map(i => (
                <option key={i.id} value={i.id}>
                  {i.invoice_number} - {i.customer_name} (Sisa: {formatRupiah(i.outstanding_amount)})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Tanggal Bayar</label>
            <input type="date" value={paymentDate} onChange={(e) => setPaymentDate(e.target.value)} className="w-full p-2 border rounded" required />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Nominal Pembayaran (Rp)</label>
            <input type="number" value={amount} onChange={(e) => setAmount(Number(e.target.value))} className="w-full p-2 border rounded font-black text-emerald-700 text-sm" required />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Metode Pembayaran</label>
            <select value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)} className="w-full p-2 border rounded font-semibold">
              <option value="Transfer Bank">Transfer Bank</option>
              <option value="Cash">Tunai / Cash</option>
              <option value="Giro">Giro</option>
            </select>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Catatan Pembayaran</label>
            <input type="text" value={notes} onChange={(e) => setNotes(e.target.value)} className="w-full p-2 border rounded" placeholder="Contoh: DP Awal / Pelunasan" />
          </div>

          <div className="border-t pt-3 flex justify-end space-x-2">
            <button type="button" onClick={onClose} className="px-3 py-1.5 border rounded font-bold">Batal</button>
            <button type="submit" className="px-4 py-1.5 bg-emerald-600 text-white font-bold rounded hover:bg-emerald-700">Simpan Pembayaran</button>
          </div>
        </form>
      </div>
    </div>
  );
}

// --- FORM TAMBAH STOK MODAL ---
function StockFormModal({ suppliers, onClose, onSubmit }) {
  const [supplierId, setSupplierId] = useState(suppliers[0]?.id || '');
  const [transactionType, setTransactionType] = useState('Barang Masuk');
  const [quantitySacks, setQuantitySacks] = useState(50);
  const [transactionDate, setTransactionDate] = useState('2026-08-30');
  const [notes, setNotes] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      supplier_id: supplierId,
      transaction_type: transactionType,
      quantity_sacks: quantitySacks,
      transaction_date: transactionDate,
      notes: notes
    });
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full">
        <div className="p-4 border-b flex justify-between items-center bg-slate-900 text-white rounded-t-xl">
          <h3 className="font-bold text-xs uppercase tracking-wider">PENCATATAN MUTASI STOK EDAMAME</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-white"><X className="w-4 h-4" /></button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4 text-xs">
          <div>
            <label className="block font-bold text-slate-700 mb-1">Tipe Transaksi Stok</label>
            <select value={transactionType} onChange={(e) => setTransactionType(e.target.value)} className="w-full p-2 border rounded font-bold">
              <option value="Barang Masuk">Barang Masuk (Panen Petani)</option>
              <option value="Rusak">Barang Rusak / Afkir</option>
              <option value="Adjustment">Adjustment Opname</option>
              <option value="Retur">Retur Penjualan</option>
            </select>
          </div>

          {transactionType === 'Barang Masuk' && (
            <div>
              <label className="block font-bold text-slate-700 mb-1">Pilih Supplier / Petani</label>
              <select value={supplierId} onChange={(e) => setSupplierId(e.target.value)} className="w-full p-2 border rounded font-semibold">
                {suppliers.map(s => (
                  <option key={s.id} value={s.id}>{s.name} ({s.city})</option>
                ))}
              </select>
            </div>
          )}

          <div>
            <label className="block font-bold text-slate-700 mb-1">Jumlah Karung</label>
            <input type="number" min="1" value={quantitySacks} onChange={(e) => setQuantitySacks(Number(e.target.value))} className="w-full p-2 border rounded font-black text-slate-800" required />
            <p className="text-[10px] text-slate-500 mt-1 font-semibold">= {quantitySacks * 30} Kg | {(quantitySacks * 30 / 1000).toFixed(2)} Ton</p>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Tanggal Transaksi</label>
            <input type="date" value={transactionDate} onChange={(e) => setTransactionDate(e.target.value)} className="w-full p-2 border rounded" required />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Keterangan / Notes</label>
            <input type="text" value={notes} onChange={(e) => setNotes(e.target.value)} className="w-full p-2 border rounded" placeholder="Keterangan kondisi edamame" />
          </div>

          <div className="border-t pt-3 flex justify-end space-x-2">
            <button type="button" onClick={onClose} className="px-3 py-1.5 border rounded font-bold">Batal</button>
            <button type="submit" className="px-4 py-1.5 bg-emerald-600 text-white font-bold rounded hover:bg-emerald-700">Simpan Mutasi</button>
          </div>
        </form>
      </div>
    </div>
  );
}

// --- FORM TAMBAH PELANGGAN MODAL ---
function CustomerFormModal({ onClose, onSubmit }) {
  const [name, setName] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [city, setCity] = useState('');
  const [province, setProvince] = useState('');
  const [customerType, setCustomerType] = useState('Restoran');
  const [paymentTermDays, setPaymentTermDays] = useState(14);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      name,
      company_name: companyName,
      whatsapp,
      address: city,
      city,
      province,
      customer_type: customerType,
      payment_term_days: Number(paymentTermDays),
      credit_limit: 20000000
    });
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full">
        <div className="p-4 border-b flex justify-between items-center bg-slate-900 text-white rounded-t-xl">
          <h3 className="font-bold text-xs uppercase tracking-wider">TAMBAH DATA PELANGGAN BARU</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-white"><X className="w-4 h-4" /></button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-3 text-xs">
          <div>
            <label className="block font-bold text-slate-700 mb-1">Nama Pelanggan / PIC</label>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="w-full p-2 border rounded" required />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Nama Perusahaan / Usaha</label>
            <input type="text" value={companyName} onChange={(e) => setCompanyName(e.target.value)} className="w-full p-2 border rounded" placeholder="Contoh: PT Kuliner Nusantara" />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">No. WhatsApp</label>
            <input type="text" value={whatsapp} onChange={(e) => setWhatsapp(e.target.value)} className="w-full p-2 border rounded" required />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Kota</label>
              <input type="text" value={city} onChange={(e) => setCity(e.target.value)} className="w-full p-2 border rounded" required />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">Provinsi</label>
              <input type="text" value={province} onChange={(e) => setProvince(e.target.value)} className="w-full p-2 border rounded" required />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Kategori Pelanggan</label>
              <select value={customerType} onChange={(e) => setCustomerType(e.target.value)} className="w-full p-2 border rounded font-semibold">
                <option value="Reseller">Reseller</option>
                <option value="Distributor">Distributor</option>
                <option value="Frozen Food">Frozen Food</option>
                <option value="Restoran">Restoran</option>
                <option value="Food Business">Food Business</option>
              </select>
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">Termin Bayar (Hari)</label>
              <input type="number" value={paymentTermDays} onChange={(e) => setPaymentTermDays(e.target.value)} className="w-full p-2 border rounded font-bold" />
            </div>
          </div>

          <div className="border-t pt-3 flex justify-end space-x-2">
            <button type="button" onClick={onClose} className="px-3 py-1.5 border rounded font-bold">Batal</button>
            <button type="submit" className="px-4 py-1.5 bg-emerald-600 text-white font-bold rounded hover:bg-emerald-700">Simpan Pelanggan</button>
          </div>
        </form>
      </div>
    </div>
  );
}

// --- FORM CATAT BIAYA MODAL ---
function ExpenseFormModal({ onClose, onSubmit }) {
  const [expenseDate, setExpenseDate] = useState('2026-08-30');
  const [category, setCategory] = useState('Packaging');
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState(100000);
  const [paymentMethod, setPaymentMethod] = useState('Cash');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ expense_date: expenseDate, category, description, amount, payment_method: paymentMethod });
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full">
        <div className="p-4 border-b flex justify-between items-center bg-slate-900 text-white rounded-t-xl">
          <h3 className="font-bold text-xs uppercase tracking-wider">CATAT BIAYA OPERASIONAL</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-white"><X className="w-4 h-4" /></button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-3 text-xs">
          <div>
            <label className="block font-bold text-slate-700 mb-1">Tanggal</label>
            <input type="date" value={expenseDate} onChange={(e) => setExpenseDate(e.target.value)} className="w-full p-2 border rounded" required />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Kategori Biaya</label>
            <select value={category} onChange={(e) => setCategory(e.target.value)} className="w-full p-2 border rounded font-semibold">
              <option value="Packaging">Packaging & Es</option>
              <option value="Transport">Transportasi & Ekspedisi</option>
              <option value="Tenaga Kerja">Tenaga Kerja / Gaji</option>
              <option value="Administrasi">Administrasi & Operasional</option>
            </select>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Deskripsi Pengeluaran</label>
            <input type="text" value={description} onChange={(e) => setDescription(e.target.value)} className="w-full p-2 border rounded" placeholder="Keterangan pengeluaran" required />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Nominal (Rp)</label>
            <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} className="w-full p-2 border rounded font-bold text-rose-600 text-sm" required />
          </div>

          <div className="border-t pt-3 flex justify-end space-x-2">
            <button type="button" onClick={onClose} className="px-3 py-1.5 border rounded font-bold">Batal</button>
            <button type="submit" className="px-4 py-1.5 bg-emerald-600 text-white font-bold rounded hover:bg-emerald-700">Simpan Biaya</button>
          </div>
        </form>
      </div>
    </div>
  );
}

// --- MODAL VIEW & PRINT INVOICE RESMI ---
function InvoicePrintModal({ invoice, order, customer, onClose, formatRupiah }) {
  return (
    <div className="fixed inset-0 bg-slate-900/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-3xl w-full max-h-[95vh] flex flex-col">
        {/* Header Action Controls */}
        <div className="p-4 border-b flex justify-between items-center bg-slate-900 text-white rounded-t-xl">
          <h3 className="font-bold text-xs uppercase tracking-wider">INVOICE PENJUALAN OFFICIAL</h3>
          <div className="flex space-x-2">
            <button onClick={() => window.print()} className="bg-emerald-600 text-white px-3 py-1.5 rounded text-xs font-bold flex items-center space-x-1">
              <Printer className="w-4 h-4" />
              <span>Cetak / Print</span>
            </button>
            <button onClick={onClose} className="text-slate-400 hover:text-white p-1"><X className="w-5 h-5" /></button>
          </div>
        </div>

        {/* Invoice Body Template */}
        <div className="p-8 overflow-y-auto font-sans text-slate-800 space-y-6">
          <div className="flex justify-between items-start border-b pb-6">
            <div>
              <h2 className="text-2xl font-black text-emerald-800 tracking-wider">EDAMAME FRESH</h2>
              <p className="text-xs text-slate-500 font-semibold mt-0.5">Perdagangan & Distribusi Edamame Segar Jember</p>
              <p className="text-xs text-slate-500">Jl. Raya Arjasa No. 100, Jember, Jawa Timur</p>
            </div>
            <div className="text-right">
              <h3 className="text-xl font-black text-slate-800">INVOICE</h3>
              <p className="text-sm font-bold text-emerald-700 mt-1">{invoice.invoice_number}</p>
              <p className="text-xs text-slate-500">Tanggal: {invoice.invoice_date}</p>
              <p className="text-xs text-rose-600 font-bold">Jatuh Tempo: {invoice.due_date}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6 text-xs bg-slate-50 p-4 rounded-lg">
            <div>
              <p className="font-bold text-slate-400 uppercase">DITAGIHKAN KEPADA:</p>
              <p className="font-extrabold text-sm text-slate-900 mt-1">{invoice.customer_name}</p>
              <p className="text-slate-600 font-medium">{customer?.company_name}</p>
              <p className="text-slate-600">{customer?.address}, {customer?.city}</p>
              <p className="text-slate-600">WA: {customer?.whatsapp}</p>
            </div>
            <div className="text-right">
              <p className="font-bold text-slate-400 uppercase">DETAIL PEMESANAN:</p>
              <p className="font-semibold text-slate-800 mt-1">Order Ref: {order?.order_number}</p>
              <p className="text-slate-600">Termin Pembayaran: {order?.payment_term_days} Hari</p>
              <p className="text-slate-600 font-bold">Status Bayar: {invoice.payment_status}</p>
            </div>
          </div>

          <table className="w-full text-xs text-left">
            <thead className="bg-slate-800 text-white uppercase font-bold">
              <tr>
                <th className="p-3">Deskripsi Produk</th>
                <th className="p-3 text-center">Jumlah Karung</th>
                <th className="p-3 text-center">Total Berat</th>
                <th className="p-3 text-right">Harga per Karung</th>
                <th className="p-3 text-right">Subtotal</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 font-medium">
              <tr>
                <td className="p-3 font-bold text-slate-900">Edamame Fresh Segar (Grade A)</td>
                <td className="p-3 text-center font-bold">{order?.quantity_sacks} Karung</td>
                <td className="p-3 text-center font-mono">{order?.quantity_kg} Kg ({order?.tonnage} Ton)</td>
                <td className="p-3 text-right">{formatRupiah(order?.price_per_sack)}</td>
                <td className="p-3 text-right font-extrabold">{formatRupiah(order?.subtotal)}</td>
              </tr>
            </tbody>
          </table>

          <div className="flex justify-between items-start pt-4 border-t">
            <div className="text-xs text-slate-500 max-w-sm">
              <p className="font-bold text-slate-700">Pembayaran Transfer Ke:</p>
              <p>Bank BCA: 123-456-7890 a.n Edamame Fresh</p>
              <p>Bank Mandiri: 987-654-3210 a.n Edamame Fresh</p>
            </div>
            <div className="w-64 space-y-1.5 text-xs">
              <div className="flex justify-between text-slate-600">
                <span>Subtotal:</span>
                <span className="font-semibold">{formatRupiah(invoice.subtotal)}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Ongkos Kirim:</span>
                <span className="font-semibold">{formatRupiah(invoice.shipping_cost)}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Diskon:</span>
                <span className="font-semibold">{formatRupiah(invoice.discount)}</span>
              </div>
              <div className="flex justify-between text-slate-900 font-black text-sm pt-2 border-t">
                <span>GRAND TOTAL:</span>
                <span className="text-emerald-700">{formatRupiah(invoice.grand_total)}</span>
              </div>
              <div className="flex justify-between text-emerald-600 font-bold pt-1">
                <span>Sudah Dibayar:</span>
                <span>{formatRupiah(invoice.paid_amount)}</span>
              </div>
              <div className="flex justify-between text-rose-600 font-black text-sm border-t pt-1">
                <span>SISA PIUTANG:</span>
                <span>{formatRupiah(invoice.outstanding_amount)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// --- MODAL FORMAT STRUK THERMAL PRINTER (80MM) ---
function ThermalReceiptModal({ invoice, order, onClose, formatRupiah }) {
  return (
    <div className="fixed inset-0 bg-slate-900/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-sm w-full">
        <div className="p-3 border-b flex justify-between items-center bg-slate-900 text-white rounded-t-xl">
          <h3 className="font-bold text-xs uppercase">PREVIEW STRUK THERMAL (80mm)</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-white"><X className="w-4 h-4" /></button>
        </div>

        {/* Thermal Print Receipt Template */}
        <div className="p-6 bg-amber-50/50 font-mono text-xs text-slate-900 space-y-3 leading-tight border m-4 rounded shadow-inner">
          <div className="text-center space-y-1">
            <h3 className="font-black text-sm uppercase tracking-wider">================================</h3>
            <h4 className="font-black text-base">EDAMAME FRESH</h4>
            <p className="text-[10px]">Perdagangan Edamame Segar Jember</p>
            <h3 className="font-black text-sm uppercase tracking-wider">================================</h3>
          </div>

          <div className="space-y-0.5 text-[11px]">
            <p>Invoice: {invoice?.invoice_number}</p>
            <p>Tanggal: {invoice?.invoice_date}</p>
            <p>Pelanggan: {invoice?.customer_name}</p>
          </div>

          <p className="font-bold">--------------------------------</p>

          <div className="space-y-1">
            <div className="flex justify-between font-bold">
              <span>Edamame Fresh</span>
            </div>
            <div className="flex justify-between text-[11px]">
              <span>{order?.quantity_sacks} Karung ({order?.quantity_kg} Kg)</span>
              <span>{formatRupiah(order?.subtotal)}</span>
            </div>
          </div>

          <p className="font-bold">--------------------------------</p>

          <div className="space-y-1 text-[11px]">
            <div className="flex justify-between">
              <span>Subtotal:</span>
              <span>{formatRupiah(invoice?.subtotal)}</span>
            </div>
            <div className="flex justify-between">
              <span>Ongkir:</span>
              <span>{formatRupiah(invoice?.shipping_cost)}</span>
            </div>
            <div className="flex justify-between font-bold text-xs pt-1 border-t border-dashed">
              <span>TOTAL:</span>
              <span>{formatRupiah(invoice?.grand_total)}</span>
            </div>
            <div className="flex justify-between font-bold text-xs">
              <span>DIBAYAR:</span>
              <span>{formatRupiah(invoice?.paid_amount)}</span>
            </div>
            <div className="flex justify-between font-bold text-xs">
              <span>SISA:</span>
              <span>{formatRupiah(invoice?.outstanding_amount)}</span>
            </div>
          </div>

          <div className="text-center pt-3 space-y-1">
            <p className="font-bold">Status: {invoice?.payment_status}</p>
            <p className="text-[10px]">Terima kasih atas kerja samanya</p>
            <h3 className="font-black text-sm uppercase tracking-wider">================================</h3>
          </div>
        </div>

        <div className="p-3 border-t flex justify-end space-x-2 bg-slate-50 rounded-b-xl">
          <button onClick={() => window.print()} className="w-full bg-slate-900 text-white py-2 rounded font-bold text-xs flex items-center justify-center space-x-1">
            <Printer className="w-4 h-4" />
            <span>Cetak Struk Thermal</span>
          </button>
        </div>
      </div>
    </div>
  );
}

// --- MODAL DETAIL PELANGGAN & HISTORI TRANSAKSI ---
function CustomerDetailModal({ customer, customerOrders, customerInvoices, onClose, formatRupiah, formatNum }) {
  const totalKg = customerOrders.reduce((acc, o) => acc + o.quantity_kg, 0);
  const totalOmzet = customerOrders.reduce((acc, o) => acc + o.grand_total, 0);
  const totalPiutang = customerInvoices.reduce((acc, i) => acc + i.outstanding_amount, 0);

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-4 border-b flex justify-between items-center bg-slate-900 text-white rounded-t-xl">
          <h3 className="font-bold text-xs uppercase tracking-wider">DETAIL & HISTORI PELANGGAN: {customer.name}</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-white"><X className="w-4 h-4" /></button>
        </div>

        <div className="p-6 space-y-6 text-xs">
          {/* Summary Header */}
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
              <p className="text-slate-400 font-bold uppercase">Total Pembelian</p>
              <p className="text-base font-black text-slate-800 mt-1">{formatNum(totalKg)} Kg ({(totalKg/1000).toFixed(2)} Ton)</p>
            </div>
            <div className="bg-emerald-50 p-3 rounded-lg border border-emerald-200">
              <p className="text-emerald-800 font-bold uppercase">Total Omzet</p>
              <p className="text-base font-black text-emerald-700 mt-1">{formatRupiah(totalOmzet)}</p>
            </div>
            <div className="bg-rose-50 p-3 rounded-lg border border-rose-200">
              <p className="text-rose-800 font-bold uppercase">Sisa Piutang Aktif</p>
              <p className="text-base font-black text-rose-600 mt-1">{formatRupiah(totalPiutang)}</p>
            </div>
          </div>

          {/* Customer Profile Info */}
          <div className="bg-white p-4 rounded-lg border border-slate-200 space-y-2">
            <h4 className="font-bold text-slate-800 border-b pb-2 uppercase">Informasi Kontak & Termin</h4>
            <div className="grid grid-cols-2 gap-4">
              <p><strong>Perusahaan:</strong> {customer.company_name || '-'}</p>
              <p><strong>Tipe:</strong> {customer.customer_type}</p>
              <p><strong>WhatsApp:</strong> {customer.whatsapp}</p>
              <p><strong>Termin Bayar:</strong> {customer.payment_term_days} Hari</p>
              <p className="col-span-2"><strong>Alamat Pengiriman:</strong> {customer.address}, {customer.city}, {customer.province}</p>
            </div>
          </div>

          {/* Orders History */}
          <div className="space-y-2">
            <h4 className="font-bold text-slate-800 uppercase">Histori Pemesanan</h4>
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-800 text-white font-bold">
                <tr>
                  <th className="p-2">No. Order</th>
                  <th className="p-2">Tanggal</th>
                  <th className="p-2">Volume</th>
                  <th className="p-2 text-right">Grand Total</th>
                  <th className="p-2">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y font-medium">
                {customerOrders.map(o => (
                  <tr key={o.id}>
                    <td className="p-2 font-bold text-emerald-700">{o.order_number}</td>
                    <td className="p-2">{o.order_date}</td>
                    <td className="p-2">{o.quantity_sacks} Karung ({o.quantity_kg} kg)</td>
                    <td className="p-2 text-right font-bold">{formatRupiah(o.grand_total)}</td>
                    <td className="p-2"><span className="bg-blue-100 text-blue-800 px-1.5 py-0.5 rounded text-[10px] font-bold">{o.order_status}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}