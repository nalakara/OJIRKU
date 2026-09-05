import React, { useState } from 'react';
import { useAuth } from '../lib/auth';
import { useI18n } from '../lib/i18n';
import { Button } from './common';

export const PinLockScreen = ({ onBack }: { onBack?: () => void }) => {
  const { isPinSet, login, setPin: setAuthPin } = useAuth();
  const { t } = useI18n();
  const [pin, setPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [error, setError] = useState('');
  const [isSettingPin, setIsSettingPin] = useState(!isPinSet);

  const handleKeyPress = (key: string) => {
    if (key === 'del') {
      setError('');
      if (isSettingPin) {
        if (confirmPin.length > 0) {
            setConfirmPin(p => p.slice(0, -1));
        } else if (pin.length > 0) {
            setPin(p => p.slice(0, -1));
        }
      } else { // logging in
        setPin(p => p.slice(0, -1));
      }
      return;
    }
    
    if (isSettingPin) {
      if (pin.length < 4) {
        setPin(p => p + key);
      } else if (confirmPin.length < 4) {
        setConfirmPin(p => p + key);
      }
    } else {
      if (pin.length < 4) {
        setPin(p => p + key);
      }
    }
  };

  const handleSubmit = async () => {
    if (isSettingPin) {
      if (pin.length !== 4 || confirmPin.length !== 4) return;
      if (pin === confirmPin) {
        await setAuthPin(pin);
      } else {
        setError(t('pin_mismatch'));
        setPin('');
        setConfirmPin('');
      }
    } else {
      const success = await login(pin);
      if (!success) {
        setError('Invalid PIN');
        setPin('');
      }
    }
  };
  
  const PinDisplay = ({ length, filled }: { length: number, filled: number }) => (
    <div className="flex justify-center space-x-6">
      {Array.from({ length }).map((_, i) => (
        <div
          key={i}
          className={`w-4 h-4 rounded-full transition-all duration-300 ${
            i < filled ? 'bg-teal-400 scale-125' : 'bg-white/20'
          }`}
        ></div>
      ))}
    </div>
  );

  const title = isSettingPin ? t('set_your_pin') : t('enter_pin');
  const subtitle = isSettingPin && pin.length === 4 ? t('confirm_pin') : '';
  const displayFilled = isSettingPin && pin.length === 4 ? confirmPin.length : pin.length;

  return (
    <div className="fixed inset-0 z-50 flex flex-col justify-center items-center p-4 bg-[#1D172E]/90 backdrop-blur-lg">
       {onBack && (
        <button onClick={onBack} className="absolute top-6 left-6 text-teal-300 hover:text-white font-semibold flex items-center gap-2 p-2 rounded-[8px] hover:bg-white/10 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5"/><path d="m12 19-7-7 7-7"/></svg>
            <span className="text-[14px]">{t('back')}</span>
        </button>
      )}
      <div className="w-full max-w-xs mx-auto text-center">
        <h1 className="text-[20px] font-bold text-white">{title}</h1>
        {subtitle && <p className="text-[14px] text-gray-300 mt-1">{subtitle}</p>}
        <div className="my-8">
          <PinDisplay length={4} filled={displayFilled} />
        </div>
        {error && <p className="text-red-400 text-[12px] mb-4">{error}</p>}
        <div className="grid grid-cols-3 gap-3">
          {'123456789'.split('').map(key => (
            <Button key={key} onClick={() => handleKeyPress(key)} variant="secondary" className="text-[20px] font-bold h-14 !rounded-[8px] !p-0 bg-white/10 hover:bg-white/20">{key}</Button>
          ))}
          <div/>
          <Button onClick={() => handleKeyPress('0')} variant="secondary" className="text-[20px] font-bold h-14 !rounded-[8px] !p-0 bg-white/10 hover:bg-white/20">0</Button>
          <Button onClick={() => handleKeyPress('del')} variant="secondary" className="text-[20px] font-bold h-14 !rounded-[8px] !p-0 bg-white/10 hover:bg-white/20">⌫</Button>
        </div>
        <div className="mt-6">
            <Button onClick={handleSubmit} variant="primary" disabled={(isSettingPin ? (pin.length !== 4 || confirmPin.length !== 4) : pin.length !== 4)}>
                {isSettingPin ? t('save') : t('sign_in')}
            </Button>
        </div>
      </div>
    </div>
  );
};