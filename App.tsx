
import React, { useState, useEffect } from 'react';
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
import { WalkthroughModal, WALKTHROUGH_STEPS } from './components/Walkthrough';

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

const WALKTHROUGH_STORAGE_KEY = 'ojirku_walkthrough_completed';

const AppContent = () => {
    const { isAuthenticated, isPinSet, authStatus } = useAuth();
    const [showAuthScreen, setShowAuthScreen] = useState(false);
    const [activePage, setActivePage] = useState('dashboard');
    
    // Walkthrough state
    const [isWalkthroughOpen, setIsWalkthroughOpen] = useState(false);
    const [currentStepIndex, setCurrentStepIndex] = useState(0);

    // Check first-time visit on authentication
    useEffect(() => {
        if (isAuthenticated) {
            const hasCompleted = localStorage.getItem(WALKTHROUGH_STORAGE_KEY);
            if (!hasCompleted) {
                // First-visit user: launch walkthrough
                setIsWalkthroughOpen(true);
                setCurrentStepIndex(0);
            }
        }
    }, [isAuthenticated]);

    // Listen for custom trigger from Settings
    useEffect(() => {
        const handleStartWalkthrough = () => {
            setCurrentStepIndex(0);
            setIsWalkthroughOpen(true);
            setActivePage('dashboard');
        };

        window.addEventListener('ojirku_start_walkthrough', handleStartWalkthrough);
        return () => window.removeEventListener('ojirku_start_walkthrough', handleStartWalkthrough);
    }, []);

    // Sync active page with walkthrough step
    const goToStep = (stepIdx: number) => {
        const targetStep = WALKTHROUGH_STEPS[stepIdx];
        if (targetStep) {
            setCurrentStepIndex(stepIdx);
            if (targetStep.targetPage) {
                setActivePage(targetStep.targetPage);
            }
        }
    };

    const handleWalkthroughNext = () => {
        if (currentStepIndex < WALKTHROUGH_STEPS.length - 1) {
            goToStep(currentStepIndex + 1);
        } else {
            handleWalkthroughFinish();
        }
    };

    const handleWalkthroughPrev = () => {
        if (currentStepIndex > 0) {
            goToStep(currentStepIndex - 1);
        }
    };

    const handleWalkthroughSkip = () => {
        localStorage.setItem(WALKTHROUGH_STORAGE_KEY, 'true');
        setIsWalkthroughOpen(false);
    };

    const handleWalkthroughFinish = () => {
        localStorage.setItem(WALKTHROUGH_STORAGE_KEY, 'true');
        setIsWalkthroughOpen(false);
        setActivePage('dashboard');
    };
    
    if (authStatus === 'loading') {
        return null; // Or a global spinner/splash screen
    }

    if (isAuthenticated) {
        const ActivePageComponent = pages[activePage] || Dashboard;
        return (
            <>
                <Layout activePage={activePage} setActivePage={setActivePage}>
                    <ActivePageComponent />
                </Layout>

                <WalkthroughModal
                    isOpen={isWalkthroughOpen}
                    currentStepIndex={currentStepIndex}
                    onNext={handleWalkthroughNext}
                    onPrev={handleWalkthroughPrev}
                    onSkip={handleWalkthroughSkip}
                    onFinish={handleWalkthroughFinish}
                />
            </>
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