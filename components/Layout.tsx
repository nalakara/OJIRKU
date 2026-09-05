import React, { ReactNode } from 'react';
import { HomeIcon, ListIcon, PieChartIcon, TargetIcon, BotIcon, SettingsIcon, DebtIcon } from './common';
import { useI18n } from '../lib/i18n';

interface LayoutProps {
  activePage: string;
  setActivePage: (page: string) => void;
  children: ReactNode;
}

const navItems = [
  { id: 'dashboard', labelKey: 'dashboard', icon: HomeIcon },
  { id: 'transactions', labelKey: 'transactions', icon: ListIcon },
  { id: 'budgets', labelKey: 'budgets', icon: PieChartIcon },
  { id: 'goals', labelKey: 'goals', icon: TargetIcon },
  { id: 'debts', labelKey: 'debts', icon: DebtIcon },
] as const;


export const Layout = ({ activePage, setActivePage, children }: LayoutProps) => {
    const { t } = useI18n();
    return (
        <div className="flex flex-col min-h-screen text-white">
            <Header title={t(activePage as any)} onSettingsClick={() => setActivePage('settings')} />
            <main className="flex-grow overflow-y-auto pb-32">
                {children}
            </main>
            <BottomNav activePage={activePage} setActivePage={setActivePage} />
        </div>
    );
};

interface HeaderProps {
    title: string;
    onSettingsClick: () => void;
}
const Header = ({ title, onSettingsClick }: HeaderProps) => {
    const { t } = useI18n();
    return (
      <header className="sticky top-0 z-30 border-b border-white/10 bg-black/25 backdrop-blur-md px-4 sm:px-6">
        <div className="max-w-[1280px] mx-auto flex items-center justify-between h-14">
          <div className="flex items-center gap-3">
            <span className="font-extrabold text-[16px] tracking-tight text-white">OJIRKU</span>
            <span className="hidden sm:inline-block text-xs font-medium px-2 py-0.5 bg-white/10 text-orange-300 rounded-[4px] border border-orange-400/20">Finance</span>
          </div>
          <h2 className="text-[20px] font-bold text-white capitalize">{title}</h2>
          <button onClick={onSettingsClick} className="p-2 rounded-[8px] border border-white/10 text-gray-200 hover:bg-white/10 hover:text-white transition-colors" aria-label={t('settings')}>
              <SettingsIcon className="w-5 h-5" />
          </button>
        </div>
      </header>
    );
};

interface BottomNavProps {
    activePage: string;
    setActivePage: (page: string) => void;
}

const BottomNav = ({ activePage, setActivePage }: BottomNavProps) => {
    const { t } = useI18n();
    return (
        <nav className="fixed bottom-4 left-1/2 -translate-x-1/2 w-[95%] max-w-[480px] z-30">
            <div className="flex justify-around items-center h-16 bg-black/40 backdrop-blur-xl border border-white/15 rounded-[8px] shadow-2xl p-1.5">
                {navItems.map(item => (
                    <button
                        key={item.id}
                        onClick={() => setActivePage(item.id)}
                        className={`flex flex-col items-center justify-center w-full h-full text-[11px] font-semibold transition-all duration-150 rounded-[6px] ${
                            activePage === item.id 
                            ? 'bg-gradient-to-br from-yellow-400/20 to-orange-500/30 text-white border border-orange-400/30 shadow-sm' 
                            : 'text-gray-300 hover:text-white hover:bg-white/5'
                        }`}
                        style={{ WebkitTapHighlightColor: 'transparent' }}
                    >
                        <item.icon className="w-5 h-5 mb-0.5" />
                        <span>{t(item.labelKey)}</span>
                    </button>
                ))}
            </div>
        </nav>
    );
};

export const Page = ({ children, className }: { children: ReactNode, className?: string }) => (
    <div className={`max-w-[1280px] mx-auto w-full px-4 sm:px-6 py-6 space-y-6 ${className || ''}`}>
        {children}
    </div>
);