
import React, { useState } from 'react';
import { AuthProvider, useAuth } from './lib/auth';
import { I18nProvider } from './lib/i18n';
import { PinLockScreen } from './components/PinLockScreen';
import { Layout } from './components/Layout';

import { Dashboard } from './components/Dashboard';
import { Transactions } from './components/Transactions';
import { Budgets } from './components/Budgets';
import { Goals } from './components/Goals';
import { Debts } from './components/Debts';
import { Reports } from './components/Reports';
import { AISuggestions } from './components/AISuggestions';
import { Settings } from './components/Settings';
import { WelcomeScreen } from './components/WelcomeScreen';

/*
  Application Architecture:
  - UI Layer (React Components): All components in the 'components/' directory. They are responsible for rendering the UI.
  - State Management Layer (React Context):
    - AuthContext: Manages user authentication state (PIN lock).
    - I18nContext: Manages language and translations.
    - Local state (`useState`) is used for component-level state.
  - Data Layer (IndexedDB via Dexie): `lib/db.ts` provides an abstraction over IndexedDB for all data persistence (transactions, goals, etc.). This makes the app offline-first.
  - Service Worker Layer (`public/sw.js`): Caches the application shell (HTML, JS) to allow the PWA to load and run even when offline.
*/
/*
  Testing Strategy Outline:
  - Unit Tests (Jest & React Testing Library): Test individual components and utility functions (e.g., `db.ts` functions, `i18n` translations).
  - Integration Tests (React Testing Library): Test interactions between components, e.g., adding a transaction and seeing it appear in the list and affect the dashboard.
  - End-to-End Tests (Cypress or Playwright): Simulate full user flows, such as setting a PIN, adding data, and generating an AI report.
*/

const pages: { [key: string]: React.ComponentType } = {
    dashboard: Dashboard,
    transactions: Transactions,
    budgets: Budgets,
    goals: Goals,
    debts: Debts,
    reports: Reports,
    ai_suggestions: AISuggestions,
    settings: Settings,
};

const AppContent = () => {
    const { isAuthenticated, isPinSet, authStatus } = useAuth();
    const [showAuthScreen, setShowAuthScreen] = useState(false);
    const [activePage, setActivePage] = useState('dashboard');
    
    // Logic to handle navigation for new users. After PIN setup, redirect to 'debts' page.
    const onPinSet = () => {
        // This is a conceptual handler. The actual implementation is within AuthProvider.
        // We can use a flag in localStorage or context to manage first-time flow.
        const isFirstTime = !localStorage.getItem('has_seen_debts_module');
        if (isFirstTime) {
            setActivePage('debts');
            localStorage.setItem('has_seen_debts_module', 'true');
        }
    };
    
    if (authStatus === 'loading') {
        return null; // Or a global spinner/splash screen
    }

    if (isAuthenticated) {
        const ActivePageComponent = pages[activePage] || Dashboard;
        return (
            <Layout activePage={activePage} setActivePage={setActivePage}>
                <ActivePageComponent />
            </Layout>
        );
    }

    if (showAuthScreen) {
        return <PinLockScreen onBack={() => setShowAuthScreen(false)} />;
    }

    return (
        <WelcomeScreen 
            onSignIn={() => setShowAuthScreen(true)} 
            onSignUp={() => setShowAuthScreen(true)} 
            isPinSet={isPinSet} 
        />
    );
};

function App() {
  return (
    <I18nProvider>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </I18nProvider>
  );
}

export default App;