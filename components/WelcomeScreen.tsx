import React from 'react';
import { Button } from './common';
import { useI18n } from '../lib/i18n';

interface WelcomeScreenProps {
    onSignIn: () => void;
    onSignUp: () => void;
    isPinSet: boolean;
}

const OjirkuLogo = ({ className }: { className?: string }) => (
    <div className={`w-28 h-28 rounded-[8px] flex items-center justify-center bg-white/20 backdrop-blur-lg border border-white/30 ${className}`}>
        <svg
            id="Layer_1"
            data-name="Layer 1"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 189.52 190.62"
            className="w-16 h-16"
        >
            <defs>
                <style>
                {`
                    .cls-1 {
                        fill: #ffffff;
                    }
                `}
                </style>
            </defs>
            <rect className="cls-1" x="54.65" y="116.49" width="31.7" height="12.7" transform="translate(-66.22 85.83) rotate(-45)"/>
            <path className="cls-1" d="M59.8,107.19l13.8-3.6c-1.7-7.2.2-15,5.8-20.6,8.5-8.5,22.4-8.5,30.9,0s8.5,22.4,0,30.9c-5.6,5.6-13.4,7.5-20.6,5.8l-3.6,13.8c11.9,2.9,24.9-.2,34.2-9.5,14.1-14.1,14.1-36.9,0-51-14.1-14.1-36.9-14.1-51,0s-12.4,22.3-9.5,34.2Z"/>
            <path className="cls-1" d="M83.9,30.39c-11,1.8-21.5,6.5-30.6,13.9l10.4,10.4c6.4-5,13.7-8.2,21.2-9.6,0,0-1-14.7-1-14.7Z"/>
            <path className="cls-1" d="M38.3,38.29c8.7-8.7,18.9-14.9,29.7-18.8l-3.9-14.4c-13.3,4.5-25.8,12.1-36.4,22.7-2.8,2.8-5.4,5.8-7.8,8.9l12.4,8.4c1.8-2.3,3.8-4.6,6-6.7v-.1Z"/>
            <path className="cls-1" d="M127.8,22.09l7.2-13.1C116.6.39,96-2.11,76.4,1.79l3.9,14.5c15.9-2.9,32.5-1,47.5,5.8Z"/>
            <path className="cls-1" d="M131.7,40.99c-10.6-7.3-22.8-11.1-35.1-11.4l1,14.7c8.6.5,17.1,3.2,24.6,8,0,0,9.5-11.3,9.5-11.3Z"/>
            <path className="cls-1" d="M169.1,65.49l14.3-4.4c-4.6-12.1-11.8-23.5-21.6-33.3-4.8-4.8-10.1-9-15.6-12.6l-7.2,13.1c4.4,2.9,8.5,6.2,12.3,10.1,8,8,13.9,17.2,17.8,27.1Z"/>
            <path className="cls-1" d="M158.7,81.69c-2.4-11.9-8.2-23.3-17.3-32.6l-9.5,11.3c6.2,6.7,10.2,14.6,12.1,22.9l14.7-1.5v-.1Z"/>
            <g>
                <path className="cls-1" d="M162.8,136.59c-3.2,5.2-7,10.2-11.6,14.7-31.2,31.2-81.7,31.2-112.9,0S8,85.99,25.2,55.59l-12.4-8.4c-21.1,36.3-16.1,83.6,14.9,114.6,37,37,100.1,39.86,134,0,11.7-13.76,10.4-11.9,14.3-18.4l-13.3-6.8h.1Z"/>
                <path className="cls-1" d="M172.8,77.59c3.5,15.8,2.1,32.5-4.2,47.7l13.3,6.8c8-18.6,9.7-39.3,5.1-58.9l-14.3,4.4h.1Z"/>
            </g>
            <path className="cls-1" d="M149.9,129.79c6.9-10.8,10.3-23.1,10.2-35.5l-14.6,1.5c-.2,8.6-2.6,17.2-7.2,24.9l11.6,9.1Z"/>
        </svg>
    </div>
);


export const WelcomeScreen = ({ onSignIn, onSignUp, isPinSet }: WelcomeScreenProps) => {
    const { t } = useI18n();

    return (
        <div className="flex flex-col h-screen text-white relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-600 via-pink-500 to-yellow-400 z-0"></div>
            <div className="absolute inset-0 bg-black/30 z-10 backdrop-blur-[2px]"></div>
            
            <main className="flex-grow flex flex-col justify-center items-center p-6 text-center max-w-[1280px] mx-auto w-full z-20">
                <OjirkuLogo className="mb-6 shadow-2xl" />
                
                <h1 className="text-[32px] font-black text-white tracking-tight">OJIRKU</h1>
                <p className="mt-2 text-[14px] text-gray-100 max-w-sm">{t('welcome_subtitle')}</p>

                <div className="w-full max-w-xs mt-12 space-y-3">
                    <Button onClick={onSignIn} disabled={!isPinSet} variant="primary">
                        {t('sign_in')}
                    </Button>
                    <Button onClick={onSignUp} disabled={isPinSet} variant="secondary" className="bg-white/20 text-white hover:bg-white/30 border border-white/20">
                        {t('sign_up_welcome')}
                    </Button>
                </div>
            </main>
            <footer className="text-center p-6 text-[12px] text-gray-200 z-20">
                by NALAKARA
            </footer>
        </div>
    );
};