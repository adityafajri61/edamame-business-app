/* ==========================================================================
   EDAMAME MANAGEMENT V1 - DATA API SERVICE LAYER
   ========================================================================== */

import { DATA_MODE, GOOGLE_APPS_SCRIPT_URL } from '../config/apiConfig.js';

// Local Storage Key fallback
const LOCAL_STORAGE_KEY = 'EDAMAME_BIZ_DB_V1';

/**
 * Panggil Google Apps Script Backend
 */
async function callGoogleAppsScript(action, payload = {}) {
  if (!GOOGLE_APPS_SCRIPT_URL || GOOGLE_APPS_SCRIPT_URL.includes('https://script.google.com/macros/s/AKfycbz49gk8Jmw3Bu0RC7k4BcNPr2ZqDnq7GhqB5AF4JoktfgbjM-MWH2YhK2562hGezvYWpQ/exec')) {
    throw new Error('Database sedang tidak tersedia.');
  }

  try {
    const response = await fetch(GOOGLE_APPS_SCRIPT_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify({ action, ...payload })
    });

    if (!response.ok) {
      throw new Error('Server database tidak merespons.');
    }

    const result = await response.json();
    if (!result.success) {
      throw new Error(result.error || 'Gagal terhubung ke database.');
    }

    return result.data;
  } catch (err) {
    console.error('[API Error]:', err);
    throw err;
  }
}

window.ApiService = {
  /**
   * Load Seluruh Data Aplikasi
   */
  async loadAllData(initialDB) {
    if (DATA_MODE === 'LOCAL') {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      return saved ? JSON.parse(saved) : initialDB;
    }

    // Mode GOOGLE_SHEETS
    try {
      const sheetsData = await callGoogleAppsScript('getAllData');
      return {
        userRole: 'ADMIN',
        products: sheetsData.products || initialDB.products,
        customers: sheetsData.customers || initialDB.customers,
        suppliers: sheetsData.suppliers || initialDB.suppliers,
        orders: sheetsData.orders || initialDB.orders,
        invoices: sheetsData.invoices || initialDB.invoices,
        payments: sheetsData.payments || initialDB.payments,
        expenses: sheetsData.expenses || initialDB.expenses,
        shipments: sheetsData.shipments || initialDB.shipments,
        activity_logs: sheetsData.activitylogs || initialDB.activity_logs,
        inventory: {
          current_sack: (sheetsData.inventory || []).reduce((acc, r) => r.type === 'Barang Masuk' ? acc + Number(r.sack) : acc - Number(r.sack), 0),
          current_kg: (sheetsData.inventory || []).reduce((acc, r) => r.type === 'Barang Masuk' ? acc + Number(r.kg) : acc - Number(r.kg), 0),
          transactions: sheetsData.inventory || []
        }
      };
    } catch (error) {
      alert(error.message || 'Gagal terhubung ke database.');
      // Return local fallback on network error without crashing
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      return saved ? JSON.parse(saved) : initialDB;
    }
  },

  /**
   * Simpan Order Baru
   */
  async createOrder(newOrder, newInvoice, newOrderItem, newLog, currentLocalDb) {
    if (DATA_MODE === 'LOCAL') {
      currentLocalDb.orders.unshift(newOrder);
      currentLocalDb.invoices.unshift(newInvoice);
      currentLocalDb.activity_logs.unshift(newLog);
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(currentLocalDb));
      return true;
    }

    return await callGoogleAppsScript('createOrderTransaction', {
      data: { order: newOrder, invoice: newInvoice, orderItem: newOrderItem, log: newLog }
    });
  },

  /**
   * Simpan Pembayaran Baru
   */
  async createPayment(newPayment, updatedInvoice, newLog, currentLocalDb) {
    if (DATA_MODE === 'LOCAL') {
      currentLocalDb.payments.unshift(newPayment);
      const idx = currentLocalDb.invoices.findIndex(i => i.id === updatedInvoice.id);
      if (idx !== -1) currentLocalDb.invoices[idx] = updatedInvoice;
      currentLocalDb.activity_logs.unshift(newLog);
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(currentLocalDb));
      return true;
    }

    return await callGoogleAppsScript('createPaymentTransaction', {
      data: { payment: newPayment, invoice: updatedInvoice, log: newLog }
    });
  },

  /**
   * Simpan Pelanggan Baru
   */
  async createCustomer(newCust, currentLocalDb) {
    if (DATA_MODE === 'LOCAL') {
      currentLocalDb.customers.unshift(newCust);
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(currentLocalDb));
      return true;
    }

    return await callGoogleAppsScript('createRecord', {
      sheetName: 'Customers',
      data: newCust
    });
  }
};
