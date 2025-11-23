import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { NavGroup } from '../types';
import { MenuIcon, ChevronLeftIcon, SunIcon, MoonIcon, GlobeIcon } from './ui/Icons';
import { useAppContext } from '../contexts/AppContext';

interface SidebarProps {
  groups: NavGroup[];
}

export const Sidebar: React.FC<SidebarProps> = ({ groups }) => {
  const [collapsed, setCollapsed] = useState(false);
  const { theme, toggleTheme, language, toggleLanguage, t } = useAppContext();
  
  // Tooltip State
  const [hoveredItem, setHoveredItem] = useState<{ label: string; top: number } | null>(null);

  const handleMouseEnter = (e: React.MouseEvent<HTMLAnchorElement>, label: string) => {
    if (!collapsed) return;
    const rect = e.currentTarget.getBoundingClientRect();
    setHoveredItem({ label, top: rect.top });
  };

  const handleMouseLeave = () => {
    setHoveredItem(null);
  };

  return (
    <>
      <aside 
        className={`fixed left-0 top-0 z-50 h-[100dvh] bg-white dark:bg-slate-950 border-r border-slate-200 dark:border-slate-800 transition-all duration-300 flex flex-col ${
          collapsed ? 'w-16' : 'w-64'
        }`}
      >
        <div className="flex items-center justify-between h-16 px-4 border-b border-slate-200 dark:border-slate-800 shrink-0">
          {!collapsed && <span className="font-bold text-lg text-blue-600 dark:text-blue-400 tracking-tight">Azin's Toolkit</span>}
          <button 
            onClick={() => { setCollapsed(!collapsed); setHoveredItem(null); }}
            className={`p-1.5 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors ${collapsed ? 'mx-auto' : 'ml-auto'}`}
          >
            {collapsed ? <MenuIcon className="w-5 h-5" /> : <ChevronLeftIcon className="w-5 h-5" />}
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto py-4 px-2 space-y-6 scrollbar-hide">
          {groups.map((group, groupIdx) => (
            <div key={groupIdx} className="space-y-1">
              {/* Category Header */}
              {!collapsed && group.title && (
                <div className="px-3 mb-2 text-xs font-semibold text-slate-500 dark:text-slate-500 uppercase tracking-wider">
                  {t(group.title)}
                </div>
              )}
              
              {collapsed && group.title && groupIdx > 0 && (
                <div className="border-t border-slate-200 dark:border-slate-800 mx-2 my-2"></div>
              )}

              {group.items.map((item) => (
                <NavLink
                  key={item.id}
                  to={item.path}
                  onMouseEnter={(e) => handleMouseEnter(e, t(item.label))}
                  onMouseLeave={handleMouseLeave}
                  className={({ isActive }) => `
                    flex items-center py-2.5 rounded-lg transition-all duration-200 group relative
                    ${collapsed ? 'justify-center px-2' : 'px-3'}
                    ${isActive 
                      ? 'bg-blue-600 text-white shadow-md shadow-blue-900/20' 
                      : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'}
                  `}
                >
                  <span className="shrink-0">
                    {item.icon}
                  </span>
                  {!collapsed && (
                    <span className="ml-3 font-medium whitespace-nowrap overflow-hidden text-sm">
                      {t(item.label)}
                    </span>
                  )}
                </NavLink>
              ))}
            </div>
          ))}
        </nav>

        <div className="p-4 border-t border-slate-200 dark:border-slate-800 shrink-0 flex flex-col gap-2">
           <div className={`flex ${collapsed ? 'flex-col items-center gap-4' : 'flex-row justify-between items-center'}`}>
             <button 
               onClick={toggleTheme} 
               title={theme === 'dark' ? "Switch to Light Mode" : "Switch to Dark Mode"}
               className="p-2 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 transition-colors"
             >
               {theme === 'dark' ? <SunIcon className="w-5 h-5" /> : <MoonIcon className="w-5 h-5" />}
             </button>

             <button 
               onClick={toggleLanguage} 
               title={language === 'en' ? "切换到中文" : "Switch to English"}
               className="p-2 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 transition-colors flex items-center gap-2"
             >
               <GlobeIcon className="w-5 h-5" />
               {!collapsed && <span className="text-xs font-bold">{language.toUpperCase()}</span>}
             </button>
           </div>

          {!collapsed && (
            <div className="text-xs text-slate-400 dark:text-slate-600 text-center mt-2">
              v1.2.0 • © 2024 Azin
            </div>
          )}
        </div>
      </aside>

      {/* Fixed Tooltip Rendered Outside Overflow Container */}
      {collapsed && hoveredItem && (
        <div 
          className="fixed left-16 z-[60] bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-xs px-2 py-1.5 rounded-md shadow-lg whitespace-nowrap pointer-events-none animate-in fade-in slide-in-from-left-2 duration-150"
          style={{ top: hoveredItem.top + 5 }}
        >
          {hoveredItem.label}
          {/* Arrow */}
          <div className="absolute left-0 top-1/2 -translate-x-1 -translate-y-1/2 w-0 h-0 border-t-[4px] border-t-transparent border-r-[4px] border-r-slate-900 dark:border-r-white border-b-[4px] border-b-transparent"></div>
        </div>
      )}
    </>
  );
};