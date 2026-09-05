import React, { ReactNode, useEffect } from 'react';
import { useI18n } from '../lib/i18n';

// --- Icon Components ---
export const HomeIcon = (props: React.SVGProps<SVGSVGElement>) => <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M11.47 3.841a.75.75 0 0 1 1.06 0l8.69 8.69a.75.75 0 1 0 1.06-1.061l-8.689-8.69a2.25 2.25 0 0 0-3.182 0l-8.69 8.69a.75.75 0 1 0 1.061 1.06l8.69-8.69Z" /><path d="m12 5.432 8.159 8.159c.03.03.06.058.091.086v6.198c0 1.035-.84 1.875-1.875 1.875H15a.75.75 0 0 1-.75-.75v-4.5a.75.75 0 0 0-.75-.75h-3a.75.75 0 0 0-.75.75V21a.75.75 0 0 1-.75.75H5.625a1.875 1.875 0 0 1-1.875-1.875v-6.198a2.29 2.29 0 0 0 .091-.086L12 5.432Z" /></svg>;
export const ListIcon = (props: React.SVGProps<SVGSVGElement>) => <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path fillRule="evenodd" d="M3 6.75A.75.75 0 0 1 3.75 6h16.5a.75.75 0 0 1 0 1.5H3.75A.75.75 0 0 1 3 6.75ZM3 12a.75.75 0 0 1 .75-.75h16.5a.75.75 0 0 1 0 1.5H3.75A.75.75 0 0 1 3 12Zm0 5.25a.75.75 0 0 1 .75-.75h16.5a.75.75 0 0 1 0 1.5H3.75a.75.75 0 0 1-.75-.75Z" clipRule="evenodd" /></svg>;
export const PieChartIcon = (props: React.SVGProps<SVGSVGElement>) => <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M10.5 4.5a7.5 7.5 0 0 0-7.5 7.5h7.5V4.5Z" /><path d="M13.5 4.5v7.5h7.5a7.5 7.5 0 0 0-7.5-7.5Z" /><path d="M4.5 13.5h7.5v7.5a7.5 7.5 0 0 0 7.5-7.5h-15Z" /></svg>;
export const TargetIcon = (props: React.SVGProps<SVGSVGElement>) => <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M12 1.5a.75.75 0 0 1 .75.75V3a.75.75 0 0 1-1.5 0V2.25A.75.75 0 0 1 12 1.5ZM12 21a.75.75 0 0 1 .75.75v1.5a.75.75 0 0 1-1.5 0v-1.5A.75.75 0 0 1 12 21ZM22.5 12a.75.75 0 0 1-.75.75H21a.75.75 0 0 1 0-1.5h.75a.75.75 0 0 1 .75.75ZM3 12a.75.75 0 0 1-.75.75H1.5a.75.75 0 0 1 0-1.5H2.25A.75.75 0 0 1 3 12ZM12 6a.75.75 0 0 1 .75.75v.75a.75.75 0 0 1-1.5 0v-.75A.75.75 0 0 1 12 6Zm-3.184-.872a.75.75 0 0 1 1.058 1.065l-.53.532a.75.75 0 0 1-1.061-1.058l.533-.539Zm1.06 8.354a.75.75 0 0 1-1.06-1.06l-.53-.531a.75.75 0 0 1 1.058-1.061l.532.53Z" /><path fillRule="evenodd" d="M12 4.5a7.5 7.5 0 1 0 0 15 7.5 7.5 0 0 0 0-15ZM1.5 12a10.5 10.5 0 1 1 21 0 10.5 10.5 0 0 1-21 0Z" clipRule="evenodd" /></svg>;
export const DebtIcon = (props: React.SVGProps<SVGSVGElement>) => <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M3.375 3C2.339 3 1.5 3.84 1.5 4.875v.75c0 1.036.84 1.875 1.875 1.875h17.25c1.035 0 1.875-.84 1.875-1.875v-.75C22.5 3.839 21.66 3 20.625 3H3.375Z" /><path fillRule="evenodd" d="M3.087 9l.54 9.176A3 3 0 0 0 6.623 21h10.754a3 3 0 0 0 2.996-2.824L20.913 9H3.087Zm6.163 3.75a.75.75 0 0 1 .75-.75h3a.75.75 0 0 1 0 1.5h-3a.75.75 0 0 1-.75-.75Z" clipRule="evenodd" /></svg>;
export const BotIcon = (props: React.SVGProps<SVGSVGElement>) => <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path fillRule="evenodd" d="M15.75 2.25a.75.75 0 0 1 .75.75v.75h.75a.75.75 0 0 1 0 1.5h-.75v.75a.75.75 0 0 1-1.5 0v-.75h-.75a.75.75 0 0 1 0-1.5h.75V3a.75.75 0 0 1 .75-.75Zm-7.5 0a.75.75 0 0 1 .75.75v.75h.75a.75.75 0 0 1 0 1.5h-.75v.75a.75.75 0 0 1-1.5 0v-.75h-.75a.75.75 0 0 1 0-1.5h.75V3a.75.75 0 0 1 .75-.75ZM12 8.25a3.75 3.75 0 1 0 0 7.5 3.75 3.75 0 0 0 0-7.5Z" clipRule="evenodd" /><path d="M12.065 18.272a.75.75 0 0 1-.13 0l-.065-.018-1.756-.502a.75.75 0 0 1 .39-1.463l1.522.434.434 1.522a.75.75 0 0 1-1.071.956Z" /><path d="M16.473 16.82a.75.75 0 0 1-1.014-1.114l1.017-1.109a.75.75 0 1 1 1.114 1.014l-1.117 1.21Z" /><path fillRule="evenodd" d="M10.832 7.687a.75.75 0 0 1-1.114 1.014l-1.117-1.21a.75.75 0 1 1 1.014-1.114l1.217 1.31Z" clipRule="evenodd" /></svg>;
export const SettingsIcon = (props: React.SVGProps<SVGSVGElement>) => <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path fillRule="evenodd" d="M11.078 2.25c-.917 0-1.699.663-1.947 1.52l-.568 1.931c-.34.115-.66.26-1.001.439l-1.879-.567a1.875 1.875 0 0 0-2.22.46l-1.583 2.742a1.875 1.875 0 0 0 .46 2.22l1.569 1.316c-.03.111-.052.225-.069.342l-1.931.568c-.857.248-1.52.93-1.52 1.798v3.164c0 .868.663 1.55 1.52 1.798l1.931.568c.017.117.039.231.069.342l-1.569 1.316a1.875 1.875 0 0 0-.46 2.22l1.583 2.742a1.875 1.875 0 0 0 2.22.46l1.879-.567c.341.179.661.324 1.001.439l.568 1.931c.248.857.93 1.52 1.798 1.52h3.164c.868 0 1.55-.663 1.798-1.52l.568-1.931c.34-.115.66-.26 1.001-.439l1.879.567a1.875 1.875 0 0 0 2.22-.46l1.583-2.742a1.875 1.875 0 0 0-.46-2.22l-1.569-1.316c.03-.111.052-.225-.069-.342l1.931-.568c.857-.248 1.52-.93 1.52-1.798v-3.164c0-.868-.663-1.55-1.52-1.798l-1.931-.568c-.017-.117-.039-.231-.069-.342l1.569-1.316a1.875 1.875 0 0 0 .46-2.22l-1.583-2.742a1.875 1.875 0 0 0-2.22-.46l-1.879.567c-.341-.179-.661-.324-1.001-.439l-.568-1.931A1.875 1.875 0 0 0 14.242 2.25h-3.164Zm-1.54 9.75a4.5 4.5 0 1 1 9 0 4.5 4.5 0 0 1-9 0Z" clipRule="evenodd" /></svg>;
export const EditIcon = (props: React.SVGProps<SVGSVGElement>) => <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path d="m2.695 14.762-1.262 3.155a.5.5 0 0 0 .65.65l3.155-1.262a4 4 0 0 0 1.343-.885L17.5 5.501a2.121 2.121 0 0 0-3-3L3.58 13.42a4 4 0 0 0-.885 1.343Z" /></svg>;
export const TrashIcon = (props: React.SVGProps<SVGSVGElement>) => <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M8.75 1A2.75 2.75 0 0 0 6 3.75v.443c-.795.077-1.58.177-2.365.298a.75.75 0 1 0 .23 1.482l.149-.022.841 10.518A2.75 2.75 0 0 0 7.596 19h4.807a2.75 2.75 0 0 0 2.742-2.53l.841-10.52.149.023a.75.75 0 0 0 .23-1.482A41.03 41.03 0 0 0 14 4.193v-.443A2.75 2.75 0 0 0 11.25 1h-2.5ZM10 4c.84 0 1.673.025 2.5.075V3.75c0-.69-.56-1.25-1.25-1.25h-2.5c-.69 0-1.25.56-1.25 1.25v.325C8.327 4.025 9.16 4 10 4ZM8.58 7.72a.75.75 0 0 0-1.5.06l.3 7.5a.75.75 0 1 0 1.5-.06l-.3-7.5Zm4.34.06a.75.75 0 1 0-1.5-.06l-.3 7.5a.75.75 0 1 0 1.5.06l.3-7.5Z" clipRule="evenodd" /></svg>;
export const PlusIcon = (props: React.SVGProps<SVGSVGElement>) => <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" ><path fillRule="evenodd" d="M12 3.75a.75.75 0 0 1 .75.75v6.75h6.75a.75.75 0 0 1 0 1.5h-6.75v6.75a.75.75 0 0 1-1.5 0v-6.75H4.5a.75.75 0 0 1 0-1.5h6.75V4.5a.75.75 0 0 1 .75-.75Z" clipRule="evenodd" /></svg>;

// --- UI Components ---
// --- UI Components ---
export const Card = ({ children, className }: { children: ReactNode, className?: string }) => (
  <div className={`bg-white/10 backdrop-blur-md border border-white/15 rounded-[8px] p-4 sm:p-6 shadow-sm ${className || ''}`}>
    {children}
  </div>
);

export const Button = ({ children, onClick, variant = 'primary', className, disabled, ...props }: { children: ReactNode, onClick?: (...args: any[]) => void, variant?: 'primary' | 'secondary' | 'danger' | 'icon', className?: string, disabled?: boolean, [x:string]: any }) => {
  const baseClasses = 'inline-flex items-center justify-center gap-2 font-semibold transition-all duration-150 ease-out focus:outline-none focus:ring-2 focus:ring-white/20 select-none cursor-pointer';
  const variantClasses = {
    // Button 3: Vibrant gradient with 8px radius, padding 10px 12px
    primary: 'w-full bg-gradient-to-br from-yellow-400 to-orange-500 text-white shadow-md shadow-orange-500/20 hover:shadow-orange-500/35 rounded-[8px] px-3 py-2.5 text-sm active:scale-[0.99]',
    // Button 2: Glass secondary with 8px radius, padding 6px 10px
    secondary: 'bg-white/10 text-white hover:bg-white/20 border border-white/10 rounded-[8px] px-2.5 py-1.5 text-xs active:scale-[0.99]',
    // Button 1: Icon/ghost with 8px radius, padding 8px
    icon: 'p-2 rounded-[8px] bg-transparent text-gray-300 hover:text-white hover:bg-white/10',
    danger: 'w-full bg-red-600 text-white hover:bg-red-700 rounded-[8px] px-3 py-2.5 text-sm active:scale-[0.99]',
  };
  const disabledClasses = disabled ? 'opacity-40 cursor-not-allowed pointer-events-none shadow-none' : '';
  
  return (
    <button onClick={onClick} disabled={disabled} className={`${baseClasses} ${variantClasses[variant] || variantClasses.primary} ${className || ''} ${disabledClasses}`} {...props}>
      {children}
    </button>
  );
};

export const Input = (props: React.InputHTMLAttributes<HTMLInputElement>) => (
  <input {...props} className={`w-full px-3 py-2.5 bg-black/20 border border-white/15 text-white placeholder-gray-400 rounded-[8px] focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-transparent text-sm transition-all ${props.className || ''}`} />
);

export const Select = (props: React.SelectHTMLAttributes<HTMLSelectElement>) => (
    <select {...props} className={`w-full px-3 py-2.5 bg-black/20 border border-white/15 text-white rounded-[8px] appearance-none focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-transparent text-sm transition-all ${props.className || ''}`}>
        {props.children}
    </select>
);

export const Modal = ({ children, isOpen, onClose }: { children: ReactNode, isOpen: boolean, onClose: () => void }) => {
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
            onClose();
        }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex justify-center items-center p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div className="w-full max-w-md m-auto" onClick={e => e.stopPropagation()}>
        <Card className="shadow-2xl border-white/20 bg-slate-900/90 backdrop-blur-xl">
            {children}
        </Card>
      </div>
    </div>
  );
};

export const ConfirmationModal = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  children,
}: {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  children: ReactNode;
}) => {
  const { t } = useI18n();
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <h2 className="text-xl font-bold mb-3 text-white">{title}</h2>
      <div className="text-gray-300 mb-6 text-sm">{children}</div>
      <div className="flex gap-3">
        <Button onClick={onClose} variant="secondary" className="!w-full !py-2.5 text-sm">
          {t('cancel')}
        </Button>
        <Button onClick={onConfirm} variant="danger" className="!w-full !py-2.5 text-sm">
          {t('confirm_action')}
        </Button>
      </div>
    </Modal>
  );
};


export const Spinner = () => (
    <div className="flex justify-center items-center p-8">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-400"></div>
    </div>
);

export const RadialProgress = ({ percentage, color, size = 40 }: { percentage: number, color: string, size?: number }) => {
    const r = (size / 2) - 4;
    const circumference = 2 * Math.PI * r;
    const offset = circumference - (percentage / 100 * circumference);

    return (
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="-rotate-90">
            <circle
                strokeWidth="4"
                stroke="rgba(255,255,255,0.1)"
                fill="transparent"
                r={r}
                cx={size / 2}
                cy={size / 2}
            />
            <circle
                strokeWidth="4"
                stroke={color}
                fill="transparent"
                strokeLinecap="round"
                r={r}
                cx={size / 2}
                cy={size / 2}
                style={{ strokeDasharray: circumference, strokeDashoffset: offset, transition: 'stroke-dashoffset 0.5s ease-out' }}
            />
            <text
                x="50%"
                y="50%"
                textAnchor="middle"
                dy=".3em"
                className="text-[10px] font-bold fill-white -rotate-90 transform-gpu"
                transform={`rotate(90, ${size/2}, ${size/2})`}
            >
                {`${Math.round(percentage)}%`}
            </text>
        </svg>
    );
};