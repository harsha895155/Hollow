import React from 'react';
import { LayoutDashboard, Receipt, Settings, Download } from 'lucide-react';
import { exportToCSV } from '../../utils/exportUtils';

function SidebarItem({ icon, label, active, onClick, isOpen, dark }) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-4 p-4 rounded-2xl transition-all duration-300 group ${
        active
          ? 'bg-blue-600/10 text-blue-500'
          : 'opacity-40 hover:opacity-100 hover:bg-black/5 dark:hover:bg-white/5'
      } ${!isOpen && 'justify-center'}`}
    >
      <div className={`${active ? 'text-blue-500' : ''}`}>{icon}</div>
      {isOpen && <span className="font-semibold text-sm tracking-wide">{label}</span>}
      {active && isOpen && (
        <div className="ml-auto w-1.5 h-1.5 bg-blue-500 rounded-full shadow-[0_0_8px_rgba(59,130,246,1)]"></div>
      )}
    </button>
  );
}

export default function Sidebar({ currentView, onNavigate, isSidebarOpen, transactions, isDarkMode }) {
  const handleExport = () => {
    exportToCSV(transactions);
  };

  return (
    <aside
      className={`${
        isSidebarOpen ? 'w-64' : 'w-20'
      } border-r transition-all duration-300 flex flex-col z-40 print:hidden ${
        isDarkMode ? 'border-white/5 bg-[#0d0d0f]' : 'border-black/5 bg-white'
      }`}
    >
      <div className="p-8 flex items-center gap-3">
        <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center shrink-0">
          <span className="font-bold text-white text-lg">H</span>
        </div>
        {isSidebarOpen && <span className="font-bold text-xl tracking-tight">Hollow</span>}
      </div>

      <nav className="flex-1 px-4 space-y-1">
        <SidebarItem
          icon={<LayoutDashboard size={20} />}
          label="Dashboard"
          active={currentView === 'Dashboard'}
          onClick={() => onNavigate('Dashboard')}
          isOpen={isSidebarOpen}
          dark={isDarkMode}
        />
        <SidebarItem
          icon={<Receipt size={20} />}
          label="Transactions"
          active={currentView === 'Transactions'}
          onClick={() => onNavigate('Transactions')}
          isOpen={isSidebarOpen}
          dark={isDarkMode}
        />
        <SidebarItem
          icon={<Settings size={20} />}
          label="Settings"
          active={currentView === 'Settings'}
          onClick={() => onNavigate('Settings')}
          isOpen={isSidebarOpen}
          dark={isDarkMode}
        />
      </nav>

      <div className="p-4 mb-4">
        <div
          className={`p-5 rounded-[24px] ${!isSidebarOpen && 'hidden'} ${
            isDarkMode
              ? 'bg-gradient-to-br from-blue-600 to-indigo-700'
              : 'bg-blue-600 text-white shadow-lg'
          }`}
        >
          <p className="font-bold text-sm mb-3">Sync Active</p>
          <button
            onClick={handleExport}
            className="w-full py-2 bg-white/10 hover:bg-white/20 text-white text-[11px] font-bold rounded-xl transition-all flex items-center justify-center gap-2"
          >
            <Download size={14} /> CSV Export
          </button>
        </div>
      </div>
    </aside>
  );
}
