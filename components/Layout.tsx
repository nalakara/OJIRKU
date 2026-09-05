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
        <div className="flex flex-col h-screen">
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
      <header className="sticky top-0 z-10 p-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between h-16">
            <h1 className="text-2xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-br from-white to-gray-400">OJIRKU</h1>
            <h2 className="text-lg font-bold capitalize">{title}</h2>
            <button onClick={onSettingsClick} className="p-2 rounded-full text-gray-300 hover:text-white hover:bg-white/10 transition-colors" aria-label={t('settings')}>
                <SettingsIcon className="w-6 h-6" />
            </button>
          </div>
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
        <nav className="fixed bottom-4 left-1/2 -translate-x-1/2 w-[95%] max-w-lg z-20">
            <div className="flex justify-around items-center h-20 bg-black/20 backdrop-blur-xl border border-white/10 rounded-full shadow-2xl">
                {navItems.map(item => (
                    <button
                        key={item.id}
                        onClick={() => setActivePage(item.id)}
                        className={`flex flex-col items-center justify-center w-full h-full text-xs transition-all duration-300 rounded-full ${
                            activePage === item.id 
                            ? 'text-white' 
                            : 'text-gray-400 hover:text-white'
                        }`}
                        style={{ WebkitTapHighlightColor: 'transparent' }}
                    >
                        <div className="relative w-8 h-8 flex items-center justify-center">
                            {activePage === item.id && <div className="absolute inset-0 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full blur-md opacity-70"></div>}
                             <item.icon className="w-6 h-6 z-10" />
                        </div>
                        <span className={`mt-1 font-bold ${activePage === item.id ? 'text-white' : 'text-gray-400'}`}>{t(item.labelKey)}</span>
                    </button>
                ))}
            </div>
        </nav>
    );
};

export const Page = ({ children, className }: { children: ReactNode, className?: string }) => (
    <div className={`px-4 sm:px-6 space-y-6 ${className}`}>
        {children}
    </div>
);