const API_BASE = '/api';

// Helper to get token
function getAuthHeader() {
  const token = localStorage.getItem('hollow_token');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

// Safely parse JSON from fetch response without throwing syntax error if HTML or empty
async function parseJsonResponse(res) {
  if (!res) return null;
  try {
    const contentType = res.headers.get('content-type') || '';
    if (!contentType.toLowerCase().includes('application/json')) {
      return null;
    }
    return await res.json();
  } catch {
    return null;
  }
}

// Check if online API is reachable
let isBackendAvailable = null;

async function checkBackend() {
  try {
    const res = await fetch(`${API_BASE}/health`, { signal: AbortSignal.timeout(2000) });
    const data = await parseJsonResponse(res);
    isBackendAvailable = res.ok && !!data;
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
const LOCAL_ACCOUNTS_KEY = 'hollow_registered_accounts';

function getLocalAccounts() {
  try {
    const data = localStorage.getItem(LOCAL_ACCOUNTS_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

function saveLocalAccounts(accounts) {
  try {
    localStorage.setItem(LOCAL_ACCOUNTS_KEY, JSON.stringify(accounts));
  } catch (err) {
    console.debug('Failed to save accounts locally:', err);
  }
}

export const api = {
  isOnline: async () => {
    return await checkBackend();
  },

  // ── AUTH ──
  auth: {
    async register(name, email, password) {
      const cleanEmail = (email || '').trim().toLowerCase();
      const cleanName = (name || '').trim();

      // 1. Try remote API if available
      try {
        const res = await fetch(`${API_BASE}/auth/register`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name: cleanName, email: cleanEmail, password }),
        });
        const data = await parseJsonResponse(res);
        if (data && res.ok && data.token) {
          localStorage.setItem('hollow_token', data.token);
          localStorage.setItem(LOCAL_USER_KEY, JSON.stringify(data.user));
          return data;
        }
        if (data && !res.ok) {
          throw new Error(data.message || 'Registration failed.');
        }
      } catch (err) {
        // If the backend gave a specific JSON validation error (e.g. email in use), throw it
        if (err.message && !err.message.includes('JSON') && !err.message.includes('fetch') && !err.message.includes('network')) {
          throw err;
        }
        // Backend not available (e.g. GitHub Pages static hosting / offline) -> Proceed to local accounts fallback
      }

      // 2. Standalone & Offline Local Account Management
      const accounts = getLocalAccounts();
      const existing = accounts.find(a => a.email.toLowerCase() === cleanEmail);
      if (existing) {
        throw new Error('An account with this email already exists. Please sign in instead.');
      }

      const newUser = {
        id: `usr_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
        name: cleanName,
        email: cleanEmail,
        currency: 'INR',
        role: 'user',
        createdAt: new Date().toISOString(),
      };

      accounts.push({ ...newUser, password });
      saveLocalAccounts(accounts);

      const token = `local_jwt_${Date.now()}`;
      localStorage.setItem('hollow_token', token);
      localStorage.setItem(LOCAL_USER_KEY, JSON.stringify(newUser));

      // Reset ledger to fresh state ₹0 for the brand new user
      localStorage.removeItem(LOCAL_TX_KEY);
      localStorage.removeItem(LOCAL_BUDGET_KEY);

      return { success: true, token, user: newUser, isOffline: true };
    },

    async login(email, password) {
      const cleanEmail = (email || '').trim().toLowerCase();

      // 1. Try remote API if available
      try {
        const res = await fetch(`${API_BASE}/auth/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: cleanEmail, password }),
        });
        const data = await parseJsonResponse(res);
        if (data && res.ok && data.token) {
          localStorage.setItem('hollow_token', data.token);
          localStorage.setItem(LOCAL_USER_KEY, JSON.stringify(data.user));
          return data;
        }
        if (data && !res.ok) {
          throw new Error(data.message || 'Invalid email or password.');
        }
      } catch (err) {
        // If the backend explicitly returned a bad credentials error, propagate it
        if (err.message && !err.message.includes('JSON') && !err.message.includes('fetch') && !err.message.includes('network')) {
          throw err;
        }
        // Backend not available or 404 HTML -> Fall through to local accounts check
      }

      // 2. Local Account Verification
      const accounts = getLocalAccounts();
      const account = accounts.find(a => a.email.toLowerCase() === cleanEmail);
      if (account) {
        if (account.password === password) {
          const userObj = {
            id: account.id,
            name: account.name,
            email: account.email,
            currency: account.currency || 'INR',
            role: account.role || 'user',
            createdAt: account.createdAt,
          };
          const token = `local_jwt_${Date.now()}`;
          localStorage.setItem('hollow_token', token);
          localStorage.setItem(LOCAL_USER_KEY, JSON.stringify(userObj));
          return { success: true, user: userObj, token, isOffline: true };
        } else {
          throw new Error('Incorrect password. Please verify your password and try again.');
        }
      }

      // Check if user session was already active in LOCAL_USER_KEY
      const saved = localStorage.getItem(LOCAL_USER_KEY);
      if (saved) {
        try {
          const currentUser = JSON.parse(saved);
          if (currentUser.email && currentUser.email.toLowerCase() === cleanEmail) {
            return {
              success: true,
              user: currentUser,
              token: localStorage.getItem('hollow_token') || 'local_token',
              isOffline: true,
            };
          }
        } catch {
          // ignore parse error
        }
      }

      throw new Error('No account found with this email. Please click "Create an account" below to register.');
    },

    async getCurrentUser() {
      try {
        const res = await fetch(`${API_BASE}/auth/me`, {
          headers: { ...getAuthHeader() },
        });
        const data = await parseJsonResponse(res);
        if (data && res.ok && data.user) {
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
        const data = await parseJsonResponse(res);
        if (data && res.ok && data.user) {
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

      const accounts = getLocalAccounts();
      const idx = accounts.findIndex(a => a.id === user.id || a.email === user.email);
      if (idx !== -1) {
        accounts[idx] = { ...accounts[idx], ...updates };
        saveLocalAccounts(accounts);
      }

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
        const data = await parseJsonResponse(res);
        if (data && res.ok && data.data) {
          return data.data;
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
        const data = await parseJsonResponse(res);
        if (data && res.ok && data.data) {
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
        const data = await parseJsonResponse(res);
        if (data && res.ok && data.data) {
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
        const data = await parseJsonResponse(res);
        if (data && res.ok && data.data) {
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
        const data = await parseJsonResponse(res);
        if (data && res.ok && data.data) {
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
        const data = await parseJsonResponse(res);
        if (data && res.ok && data.data) {
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
        const data = await parseJsonResponse(res);
        if (data && res.ok && data.data) {
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
        const data = await parseJsonResponse(res);
        if (data && res.ok && data.data) {
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
