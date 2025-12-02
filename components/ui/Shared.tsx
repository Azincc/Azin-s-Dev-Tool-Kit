import React from "react";
import { CopyIcon, CheckIcon } from "./Icons";

export const Card = ({ children, className = "" }: { children?: React.ReactNode; className?: string }) => (
  <div className={`bg-background-surface border border-border rounded-lg shadow-sm dark:shadow-lg overflow-hidden transition-colors duration-300 ${className}`}>
    {children}
  </div>
);

export const CardHeader = ({ title, description, action }: { title: string; description?: string; action?: React.ReactNode }) => (
  <div className="px-6 py-4 border-b border-border bg-background-highlight flex flex-col sm:flex-row justify-between items-start gap-4 sm:gap-0 transition-colors duration-300">
    <div>
      <h3 className="text-lg font-semibold text-text-primary">{title}</h3>
      {description && <p className="text-sm text-text-secondary mt-1">{description}</p>}
    </div>
    {action && <div className="self-end sm:self-auto">{action}</div>}
  </div>
);

export const CardContent = ({ children, className = "" }: { children?: React.ReactNode; className?: string }) => (
  <div className={`p-6 ${className}`}>{children}</div>
);

export interface ButtonProps extends React.ComponentProps<"button"> {
  variant?: "primary" | "secondary" | "danger" | "ghost" | "outline";
  size?: "default" | "sm" | "lg" | "icon";
}

export const Button = ({ children, variant = "primary", size = "default", className = "", ...props }: ButtonProps) => {
  const baseStyle = "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-text-muted disabled:opacity-50 disabled:pointer-events-none";
  
  const variants = {
    primary: "bg-brand-primary text-text-inverse hover:bg-brand-hover shadow-sm",
    secondary: "bg-background-secondary text-text-primary hover:bg-slate-200 dark:hover:bg-slate-600",
    danger: "bg-status-error-bg text-status-error-text hover:bg-red-200 dark:hover:bg-red-900/70 border border-status-error-border",
    ghost: "hover:bg-background-secondary text-text-secondary hover:text-text-primary",
    outline: "border border-border bg-transparent hover:bg-background-secondary text-text-secondary"
  };

  const sizes = {
    default: "px-4 py-2 h-10",
    sm: "h-8 px-3 text-xs",
    lg: "h-12 px-8",
    icon: "h-10 w-10",
  };

  return (
    <button className={`${baseStyle} ${variants[variant]} ${sizes[size] || sizes.default} ${className}`} {...props}>
      {children}
    </button>
  );
};

export const Input = ({ className = "", ...props }: React.InputHTMLAttributes<HTMLInputElement>) => (
  <input
    className={`flex h-10 w-full rounded-md border border-border-input bg-background-input px-3 py-2 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-brand-primary disabled:cursor-not-allowed disabled:opacity-50 transition-colors duration-300 ${className}`}
    {...props}
  />
);

export const TextArea = ({ className = "", ...props }: React.TextareaHTMLAttributes<HTMLTextAreaElement>) => (
  <textarea
    className={`flex min-h-[80px] w-full rounded-md border border-border-input bg-background-input px-3 py-2 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-brand-primary disabled:cursor-not-allowed disabled:opacity-50 font-mono transition-colors duration-300 ${className}`}
    {...props}
  />
);

export const Select = ({ children, className = "", ...props }: React.SelectHTMLAttributes<HTMLSelectElement>) => (
  <div className="relative">
    <select
      className={`flex h-10 w-full appearance-none rounded-md border border-border-input bg-background-input px-3 py-2 text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-brand-primary disabled:cursor-not-allowed disabled:opacity-50 transition-colors duration-300 ${className}`}
      {...props}
    >
      {children}
    </select>
    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-text-muted">
      <svg className="h-4 w-4 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
    </div>
  </div>
);

export const Label = ({ children, className = "" }: { children?: React.ReactNode; className?: string }) => (
  <label className={`text-xs font-semibold text-text-secondary uppercase tracking-wider mb-1.5 block ${className}`}>
    {children}
  </label>
);

export const Slider = (props: React.InputHTMLAttributes<HTMLInputElement>) => (
  <input 
    type="range" 
    className="w-full h-2 bg-border rounded-lg appearance-none cursor-pointer accent-brand-primary"
    {...props} 
  />
);

export const CopyButton = ({ text }: { text: string }) => {
  const [copied, setCopied] = React.useState(false);

  const handleCopy = async () => {
    if (!text) return;
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Button variant="ghost" size="sm" onClick={handleCopy} className="h-8 w-8 p-0" title="Copy">
      {copied ? <CheckIcon className="w-4 h-4 text-green-500 dark:text-green-400" /> : <CopyIcon className="w-4 h-4" />}
    </Button>
  );
};

// Tabs Component System
interface TabsContextType {
  activeTab: string;
  setActiveTab: (id: string) => void;
}
const TabsContext = React.createContext<TabsContextType | undefined>(undefined);

export const Tabs = ({ defaultValue, children, className = "" }: { defaultValue: string; children?: React.ReactNode; className?: string }) => {
  const [activeTab, setActiveTab] = React.useState(defaultValue);
  return (
    <TabsContext.Provider value={{ activeTab, setActiveTab }}>
      <div className={`w-full ${className}`}>{children}</div>
    </TabsContext.Provider>
  );
};

export const TabsList = ({ children, className = "" }: { children?: React.ReactNode; className?: string }) => (
  <div className={`flex space-x-1 rounded-lg bg-background-secondary p-1 mb-6 transition-colors duration-300 ${className}`}>
    {children}
  </div>
);

export const TabsTrigger = ({ value, children, className = "" }: { value: string; children?: React.ReactNode; className?: string }) => {
  const context = React.useContext(TabsContext);
  if (!context) throw new Error("TabsTrigger must be used within Tabs");
  
  const isActive = context.activeTab === value;
  return (
    <button
      onClick={() => context.setActiveTab(value)}
      className={`flex-1 inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-2 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 
      ${isActive ? "bg-background-surface text-text-primary shadow-sm" : "text-text-secondary hover:bg-slate-200 dark:hover:bg-slate-700 hover:text-text-primary"} ${className}`}
    >
      {children}
    </button>
  );
};

export const TabsContent = ({ value, children, className = "" }: { value: string; children?: React.ReactNode; className?: string }) => {
  const context = React.useContext(TabsContext);
  if (!context) throw new Error("TabsContent must be used within Tabs");
  
  if (context.activeTab !== value) return null;
  return <div className={`animate-in fade-in slide-in-from-left-1 duration-300 ${className}`}>{children}</div>;
};
