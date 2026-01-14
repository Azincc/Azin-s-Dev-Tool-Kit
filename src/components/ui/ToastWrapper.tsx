import { useToast } from './Toast';

let toastInstance: {
  success: (msg: string) => void;
  error: (msg: string) => void;
  info: (msg: string) => void;
  warning: (msg: string) => void;
} | null = null;

export const ToastInitializer = () => {
  const { addToast } = useToast();
  toastInstance = {
    success: (msg) => addToast(msg, 'success'),
    error: (msg) => addToast(msg, 'error'),
    info: (msg) => addToast(msg, 'info'),
    warning: (msg) => addToast(msg, 'warning'),
  };
  return null;
};

export const toast = {
  success: (msg: string) => toastInstance?.success(msg),
  error: (msg: string) => toastInstance?.error(msg),
  info: (msg: string) => toastInstance?.info(msg),
  warning: (msg: string) => toastInstance?.warning(msg),
};
