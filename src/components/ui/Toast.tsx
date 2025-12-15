import React, { useEffect, useState, createContext, useContext, ReactNode, useCallback, useMemo } from 'react';

interface Toast {
    id: string;
    message: string;
    type: 'info' | 'success' | 'warning' | 'error';
    duration?: number;
}

interface ToastContextType {
    addToast: (message: string, type?: Toast['type'], duration?: number) => void;
    removeToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [toasts, setToasts] = useState<Toast[]>([]);

    const addToast = useCallback((message: string, type: Toast['type'] = 'info', duration = 5000) => {
        const id = Date.now().toString();
        setToasts((prev) => [...prev, { id, message, type, duration }]);
    }, []);

    const removeToast = useCallback((id: string) => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
    }, []);

    const contextValue = useMemo(() => ({ addToast, removeToast }), [addToast, removeToast]);

    return (
        <ToastContext.Provider value={contextValue}>
            {children}
            <div className="fixed top-4 right-4 z-50 flex flex-col gap-2 pointer-events-none">
                {toasts.map((toast) => (
                    <div key={toast.id} className="pointer-events-auto">
                        <ToastItem toast={toast} onDismiss={removeToast} />
                    </div>
                ))}
            </div>
        </ToastContext.Provider>
    );
};

const ToastItem: React.FC<{ toast: Toast; onDismiss: (id: string) => void }> = ({
    toast,
    onDismiss,
}) => {
    const [isVisible, setIsVisible] = useState(false);

    // Trigger enter animation on mount
    useEffect(() => {
        // Small timeout to ensure the browser paints the initial "hidden" state first
        const timer = setTimeout(() => setIsVisible(true), 10);
        return () => clearTimeout(timer);
    }, []);

    const handleDismiss = useCallback(() => {
        setIsVisible(false);
        // Wait for animation to finish before removing from state
        setTimeout(() => {
            onDismiss(toast.id);
        }, 300); // Match duration-300
    }, [toast.id, onDismiss]);

    useEffect(() => {
        if (toast.duration) {
            const timer = setTimeout(() => {
                handleDismiss();
            }, toast.duration);
            return () => clearTimeout(timer);
        }
    }, [toast.duration, handleDismiss]);

    const bgColors = {
        info: 'bg-slate-800 text-white',
        success: 'bg-green-600 text-white',
        warning: 'bg-amber-500 text-white',
        error: 'bg-red-600 text-white',
    };

    return (
        <div
            className={`${bgColors[toast.type]} px-4 py-3 rounded-md shadow-lg min-w-[300px] flex justify-between items-center 
      transition-all duration-300 ease-in-out transform
      ${isVisible ? 'translate-x-0 opacity-100' : 'translate-x-[120%] opacity-0'}`}
        >
            <span className="text-sm font-medium">{toast.message}</span>
            <button
                onClick={handleDismiss}
                className="ml-4 text-white/80 hover:text-white"
                aria-label="Close"
            >
                <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
            </button>
        </div>
    );
};

export const useToast = () => {
    const context = useContext(ToastContext);
    if (context === undefined) {
        throw new Error('useToast must be used within a ToastProvider');
    }
    return context;
};
