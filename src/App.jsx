import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import { TransactionProvider } from './context/TransactionContext';

// Layout components
import Sidebar from './components/layout/Sidebar';
import Header from './components/layout/Header';
import MobileNav from './components/layout/MobileNav';
import MobileDrawer from './components/layout/MobileDrawer';

// Modals
import TransactionModal from './components/modals/TransactionModal';
import BudgetModal from './components/modals/BudgetModal';
import CategoryModal from './components/modals/CategoryModal';
import ReceiptViewerModal from './components/modals/ReceiptViewerModal';

// Pages
import DashboardPage from './pages/DashboardPage';
import ExpensesPage from './pages/ExpensesPage';
import IncomePage from './pages/IncomePage';
import BudgetsPage from './pages/BudgetsPage';
import CategoriesPage from './pages/CategoriesPage';
import ReportsPage from './pages/ReportsPage';
import ProfilePage from './pages/ProfilePage';
import SettingsPage from './pages/SettingsPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import WelcomePage from './pages/WelcomePage';

function MainApp() {
  const { isAuthenticated, loading, loginAsGuest } = useAuth();
  const { themeTokens, darkMode, compact } = useTheme();

  // Navigation tab state
  const [currentTab, setCurrentTab] = useState('dashboard');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);

  // Auth screen switch: 'welcome', 'login', or 'register'
  const [authView, setAuthView] = useState('welcome');

  // Modals state
  const [transactionModalOpen, setTransactionModalOpen] = useState(false);
  const [transactionModalType, setTransactionModalType] = useState('expense');
  const [editingTransaction, setEditingTransaction] = useState(null);

  const [budgetModalOpen, setBudgetModalOpen] = useState(false);
  const [editingBudget, setEditingBudget] = useState(null);

  const [categoryModalOpen, setCategoryModalOpen] = useState(false);

  const [receiptViewerData, setReceiptViewerData] = useState({ isOpen: false, url: '', title: '' });

  // Handlers
  const handleOpenAddTransaction = (type = 'expense') => {
    setEditingTransaction(null);
    setTransactionModalType(type);
    setTransactionModalOpen(true);
  };

  const handleEditTransaction = (tx) => {
    setEditingTransaction(tx);
    setTransactionModalType(tx.type || 'expense');
    setTransactionModalOpen(true);
  };

  const handleOpenBudgetModal = (budget = null) => {
    setEditingBudget(budget);
    setBudgetModalOpen(true);
  };

  const handleViewReceipt = (url, title) => {
    setReceiptViewerData({ isOpen: true, url, title });
  };

  if (loading) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-slate-950 text-white">
        <div className="flex flex-col items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-indigo-600 animate-pulse flex items-center justify-center font-black text-2xl">
            H
          </div>
          <p className="text-xs font-bold tracking-widest uppercase text-slate-400">Loading Hollow...</p>
        </div>
      </div>
    );
  }

  // Render Welcome, Login or Register if not logged in
  if (!isAuthenticated) {
    if (authView === 'welcome') {
      return (
        <WelcomePage
          onEnterGuest={loginAsGuest}
          onGoToLogin={() => setAuthView('login')}
          onGoToRegister={() => setAuthView('register')}
        />
      );
    }
    if (authView === 'register') {
      return (
        <RegisterPage
          onSwitchToLogin={() => setAuthView('login')}
          onBackToWelcome={() => setAuthView('welcome')}
        />
      );
    }
    return (
      <LoginPage
        onSwitchToRegister={() => setAuthView('register')}
        onBackToWelcome={() => setAuthView('welcome')}
      />
    );
  }

  return (
    <div className={`min-h-screen flex ${themeTokens.bg} ${themeTokens.textPrimary} relative selection:bg-indigo-500 selection:text-white`}>
      {/* Background Ambient Glow */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        {darkMode ? (
          <>
            <div className="absolute -top-40 -left-40 w-96 h-96 bg-indigo-600/10 rounded-full blur-[140px]" />
            <div className="absolute top-1/3 -right-40 w-96 h-96 bg-purple-600/10 rounded-full blur-[160px]" />
            <div className="absolute -bottom-40 left-1/3 w-96 h-96 bg-blue-600/10 rounded-full blur-[150px]" />
          </>
        ) : (
          <>
            <div className="absolute -top-40 -left-40 w-96 h-96 bg-indigo-200/40 rounded-full blur-[120px]" />
            <div className="absolute top-1/3 -right-40 w-96 h-96 bg-purple-200/40 rounded-full blur-[140px]" />
          </>
        )}
      </div>

      {/* Desktop Sidebar */}
      <Sidebar
        currentTab={currentTab}
        onSelectTab={setCurrentTab}
        isCollapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 z-10">
        <Header
          currentTab={currentTab}
          onOpenMobileDrawer={() => setMobileDrawerOpen(true)}
          onOpenAddModal={() => handleOpenAddTransaction('expense')}
        />

        <main className={`flex-1 overflow-y-auto px-4 md:px-8 py-6 pb-24 md:pb-8 ${compact ? 'max-w-[1600px]' : 'max-w-7xl'} mx-auto w-full`}>
          {currentTab === 'dashboard' && (
            <DashboardPage
              onNavigate={setCurrentTab}
              onOpenAddModal={handleOpenAddTransaction}
              onEditTransaction={handleEditTransaction}
              onViewReceipt={handleViewReceipt}
            />
          )}

          {currentTab === 'expenses' && (
            <ExpensesPage
              onOpenAddModal={handleOpenAddTransaction}
              onEditTransaction={handleEditTransaction}
              onViewReceipt={handleViewReceipt}
            />
          )}

          {currentTab === 'income' && (
            <IncomePage
              onOpenAddModal={handleOpenAddTransaction}
              onEditTransaction={handleEditTransaction}
            />
          )}

          {currentTab === 'budgets' && (
            <BudgetsPage
              onOpenBudgetModal={handleOpenBudgetModal}
              onEditBudget={handleOpenBudgetModal}
            />
          )}

          {currentTab === 'categories' && (
            <CategoriesPage
              onOpenCategoryModal={() => setCategoryModalOpen(true)}
            />
          )}

          {currentTab === 'reports' && (
            <ReportsPage />
          )}

          {currentTab === 'profile' && (
            <ProfilePage />
          )}

          {currentTab === 'settings' && (
            <SettingsPage />
          )}
        </main>
      </div>

      {/* Mobile Bottom Navigation Bar */}
      <MobileNav
        currentTab={currentTab}
        onSelectTab={setCurrentTab}
        onOpenAddModal={() => handleOpenAddTransaction('expense')}
        onOpenDrawer={() => setMobileDrawerOpen(true)}
      />

      {/* Mobile Slide-out Drawer */}
      <MobileDrawer
        isOpen={mobileDrawerOpen}
        onClose={() => setMobileDrawerOpen(false)}
        currentTab={currentTab}
        onSelectTab={setCurrentTab}
      />

      {/* Modals */}
      <TransactionModal
        isOpen={transactionModalOpen}
        onClose={() => {
          setTransactionModalOpen(false);
          setEditingTransaction(null);
        }}
        initialData={editingTransaction}
        defaultType={transactionModalType}
      />

      <BudgetModal
        isOpen={budgetModalOpen}
        onClose={() => {
          setBudgetModalOpen(false);
          setEditingBudget(null);
        }}
        initialData={editingBudget}
      />

      <CategoryModal
        isOpen={categoryModalOpen}
        onClose={() => setCategoryModalOpen(false)}
      />

      <ReceiptViewerModal
        isOpen={receiptViewerData.isOpen}
        onClose={() => setReceiptViewerData({ isOpen: false, url: '', title: '' })}
        receiptUrl={receiptViewerData.url}
        title={receiptViewerData.title}
      />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <TransactionProvider>
          <MainApp />
        </TransactionProvider>
      </ThemeProvider>
    </AuthProvider>
  );
}
