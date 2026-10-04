const API_BASE = '/api';

// Helper to get token
function getAuthHeader() {
  const token = localStorage.getItem('hollow_token');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

// Check if online API is reachable
let isBackendAvailable = null;

async function checkBackend() {
  try {
    const res = await fetch(`${API_BASE}/health`, { signal: AbortSignal.timeout(2000) });
    isBackendAvailable = res.ok;
    return isBackendAvailable;
  } catch {
    isBackendAvailable = false;
    return false;
  }
}

// Offline store keys
const LOCAL_TX_KEY = 'hollow_transactions';
const LOCAL_BUDGET_KEY = 'hollow_budgets';
const LOCAL_CAT_KEY = 'hollow_categories';
const LOCAL_USER_KEY = 'hollow_current_user';

export const api = {
  isOnline: async () => {
    return await checkBackend();
  },

  // ── AUTH ──
  auth: {
    async register(name, email, password) {
      try {
        const res = await fetch(`${API_BASE}/auth/register`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name, email, password }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || 'Registration failed');
        localStorage.setItem('hollow_token', data.token);
        localStorage.setItem(LOCAL_USER_KEY, JSON.stringify(data.user));
        return data;
      } catch (err) {
        throw new Error(err.message || 'Registration failed. Please verify network connection.');
      }
    },

    async login(email, password) {
      try {
        const res = await fetch(`${API_BASE}/auth/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || 'Login failed');
        localStorage.setItem('hollow_token', data.token);
        localStorage.setItem(LOCAL_USER_KEY, JSON.stringify(data.user));
        return data;
      } catch (err) {
        // If local user exists and email matches, allow offline session
        const saved = localStorage.getItem(LOCAL_USER_KEY);
        if (saved) {
          try {
            const user = JSON.parse(saved);
            if (user.email === email) {
              return { success: true, user, token: localStorage.getItem('hollow_token') || 'local_token', isOffline: true };
            }
          } catch {
            // Ignore parse error
          }
        }
        throw new Error(err.message || 'Login failed. Please check your credentials.');
      }
    },

    async getCurrentUser() {
      try {
        const res = await fetch(`${API_BASE}/auth/me`, {
          headers: { ...getAuthHeader() },
        });
        if (res.ok) {
          const data = await res.json();
          localStorage.setItem(LOCAL_USER_KEY, JSON.stringify(data.user));
          return data.user;
        }
      } catch {
        // Fall back to local
      }
      const saved = localStorage.getItem(LOCAL_USER_KEY);
      return saved ? JSON.parse(saved) : null;
    },

    async updateProfile(updates) {
      try {
        const res = await fetch(`${API_BASE}/auth/profile`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
          body: JSON.stringify(updates),
        });
        if (res.ok) {
          const data = await res.json();
          localStorage.setItem(LOCAL_USER_KEY, JSON.stringify(data.user));
          return data.user;
        }
      } catch {
        // Fall back to local
      }
      const saved = localStorage.getItem(LOCAL_USER_KEY);
      const user = saved ? JSON.parse(saved) : {};
      const updated = { ...user, ...updates };
      localStorage.setItem(LOCAL_USER_KEY, JSON.stringify(updated));
      return updated;
    },

    logout() {
      localStorage.removeItem('hollow_token');
      localStorage.removeItem(LOCAL_USER_KEY);
    }
  },

  // ── EXPENSES & INCOME (TRANSACTIONS) ──
  transactions: {
    async getAll(filters = {}) {
      try {
        const queryParams = new URLSearchParams();
        if (filters.category && filters.category !== 'all') queryParams.set('category', filters.category);
        if (filters.startDate) queryParams.set('startDate', filters.startDate);
        if (filters.endDate) queryParams.set('endDate', filters.endDate);
        if (filters.search) queryParams.set('search', filters.search);
        if (filters.paymentMethod && filters.paymentMethod !== 'all') queryParams.set('paymentMethod', filters.paymentMethod);

        const url = filters.type === 'income' 
          ? `${API_BASE}/income?${queryParams.toString()}` 
          : `${API_BASE}/expenses?${queryParams.toString()}`;

        const res = await fetch(url, { headers: { ...getAuthHeader() } });
        if (res.ok) {
          const data = await res.json();
          return data.data || [];
        }
      } catch {
        // Fall back to local
      }

      // Local storage fallback
      const stored = localStorage.getItem(LOCAL_TX_KEY);
      let list = stored ? JSON.parse(stored) : [];
      if (filters.type && filters.type !== 'all') {
        list = list.filter(t => t.type === filters.type);
      }
      if (filters.category && filters.category !== 'all') {
        list = list.filter(t => t.category?.toLowerCase() === filters.category.toLowerCase());
      }
      if (filters.search) {
        const q = filters.search.toLowerCase();
        list = list.filter(t => t.name?.toLowerCase().includes(q) || t.notes?.toLowerCase().includes(q));
      }
      if (filters.startDate) {
        list = list.filter(t => t.date >= filters.startDate);
      }
      if (filters.endDate) {
        list = list.filter(t => t.date <= filters.endDate);
      }
      return list;
    },

    async create(txData) {
      try {
        const endpoint = txData.type === 'income' ? `${API_BASE}/income` : `${API_BASE}/expenses`;
        const res = await fetch(endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
          body: JSON.stringify(txData),
        });
        if (res.ok) {
          const data = await res.json();
          this._saveLocal(data.data);
          return data.data;
        }
      } catch {
        // Fall back to local
      }

      // Local fallback
      const localItem = {
        id: `tx_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
        ...txData,
        amount: Math.abs(parseFloat(txData.amount)),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      this._saveLocal(localItem);
      return localItem;
    },

    async update(id, updates) {
      try {
        const endpoint = updates.type === 'income' ? `${API_BASE}/income/${id}` : `${API_BASE}/expenses/${id}`;
        const res = await fetch(endpoint, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
          body: JSON.stringify(updates),
        });
        if (res.ok) {
          const data = await res.json();
          this._updateLocal(id, data.data);
          return data.data;
        }
      } catch {
        // Fall back to local
      }

      return this._updateLocal(id, updates);
    },

    async delete(id, type = 'expense') {
      try {
        const endpoint = type === 'income' ? `${API_BASE}/income/${id}` : `${API_BASE}/expenses/${id}`;
        await fetch(endpoint, {
          method: 'DELETE',
          headers: { ...getAuthHeader() },
        });
      } catch {
        // Fall back to local
      }

      const stored = localStorage.getItem(LOCAL_TX_KEY);
      if (stored) {
        const list = JSON.parse(stored).filter(t => t.id !== id);
        localStorage.setItem(LOCAL_TX_KEY, JSON.stringify(list));
      }
      return true;
    },

    _saveLocal(item) {
      const stored = localStorage.getItem(LOCAL_TX_KEY);
      const list = stored ? JSON.parse(stored) : [];
      list.unshift(item);
      localStorage.setItem(LOCAL_TX_KEY, JSON.stringify(list));
    },

    _updateLocal(id, updates) {
      const stored = localStorage.getItem(LOCAL_TX_KEY);
      const list = stored ? JSON.parse(stored) : [];
      const index = list.findIndex(t => t.id === id);
      if (index !== -1) {
        list[index] = { ...list[index], ...updates, updatedAt: new Date().toISOString() };
        localStorage.setItem(LOCAL_TX_KEY, JSON.stringify(list));
        return list[index];
      }
      return null;
    }
  },

  // ── CATEGORIES ──
  categories: {
    async getAll() {
      try {
        const res = await fetch(`${API_BASE}/categories`, { headers: { ...getAuthHeader() } });
        if (res.ok) {
          const data = await res.json();
          return data.data;
        }
      } catch {
        // Fall back to local
      }

      const stored = localStorage.getItem(LOCAL_CAT_KEY);
      return stored ? JSON.parse(stored) : [];
    },

    async create(catData) {
      try {
        const res = await fetch(`${API_BASE}/categories`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
          body: JSON.stringify(catData),
        });
        if (res.ok) {
          const data = await res.json();
          return data.data;
        }
      } catch {
        // Fall back to local
      }

      const newCat = {
        id: `cat_${Date.now()}`,
        ...catData,
        isCustom: true,
      };
      const stored = localStorage.getItem(LOCAL_CAT_KEY);
      const list = stored ? JSON.parse(stored) : [];
      list.push(newCat);
      localStorage.setItem(LOCAL_CAT_KEY, JSON.stringify(list));
      return newCat;
    },

    async delete(id) {
      try {
        await fetch(`${API_BASE}/categories/${id}`, {
          method: 'DELETE',
          headers: { ...getAuthHeader() },
        });
      } catch {
        // Fall back to local
      }

      const stored = localStorage.getItem(LOCAL_CAT_KEY);
      if (stored) {
        const list = JSON.parse(stored).filter(c => c.id !== id);
        localStorage.setItem(LOCAL_CAT_KEY, JSON.stringify(list));
      }
      return true;
    }
  },

  // ── BUDGETS ──
  budgets: {
    async getAll(month) {
      try {
        const url = month ? `${API_BASE}/budgets?month=${month}` : `${API_BASE}/budgets`;
        const res = await fetch(url, { headers: { ...getAuthHeader() } });
        if (res.ok) {
          const data = await res.json();
          return data.data;
        }
      } catch {
        // Fall back to local
      }

      const stored = localStorage.getItem(LOCAL_BUDGET_KEY);
      return stored ? JSON.parse(stored) : [];
    },

    async create(budgetData) {
      try {
        const res = await fetch(`${API_BASE}/budgets`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
          body: JSON.stringify(budgetData),
        });
        if (res.ok) {
          const data = await res.json();
          return data.data;
        }
      } catch {
        // Fall back to local
      }

      const newBudget = {
        id: `bg_${Date.now()}`,
        ...budgetData,
        monthlyLimit: Math.abs(parseFloat(budgetData.monthlyLimit)),
        createdAt: new Date().toISOString(),
      };
      const stored = localStorage.getItem(LOCAL_BUDGET_KEY);
      const list = stored ? JSON.parse(stored) : [];
      list.push(newBudget);
      localStorage.setItem(LOCAL_BUDGET_KEY, JSON.stringify(list));
      return newBudget;
    },

    async update(id, updates) {
      try {
        const res = await fetch(`${API_BASE}/budgets/${id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
          body: JSON.stringify(updates),
        });
        if (res.ok) {
          const data = await res.json();
          return data.data;
        }
      } catch {
        // Fall back to local
      }

      const stored = localStorage.getItem(LOCAL_BUDGET_KEY);
      const list = stored ? JSON.parse(stored) : [];
      const idx = list.findIndex(b => b.id === id);
      if (idx !== -1) {
        list[idx] = { ...list[idx], ...updates };
        localStorage.setItem(LOCAL_BUDGET_KEY, JSON.stringify(list));
        return list[idx];
      }
      return null;
    },

    async delete(id) {
      try {
        await fetch(`${API_BASE}/budgets/${id}`, {
          method: 'DELETE',
          headers: { ...getAuthHeader() },
        });
      } catch {
        // Fall back to local
      }

      const stored = localStorage.getItem(LOCAL_BUDGET_KEY);
      if (stored) {
        const list = JSON.parse(stored).filter(b => b.id !== id);
        localStorage.setItem(LOCAL_BUDGET_KEY, JSON.stringify(list));
      }
      return true;
    }
  }
};
