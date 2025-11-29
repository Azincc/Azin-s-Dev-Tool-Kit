import React, { useState, useRef, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { NavGroup } from '../types';
import { MenuIcon, SunIcon, MoonIcon, GlobeIcon } from './ui/Icons';
import { useAppContext } from '../contexts/AppContext';

interface SidebarProps {
  groups: NavGroup[];
}

export const Sidebar: React.FC<SidebarProps> = ({ groups }) => {
  const [collapsed, setCollapsed] = useState(true);
  const { theme, toggleTheme, language, toggleLanguage, t } = useAppContext();
  
  // Tooltip State
  const [hoveredItem, setHoveredItem] = useState<{ label: string; top: number } | null>(null);

  // Debounce ref
  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    return () => {
      if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
    };
  }, []);

  // Clear tooltip when expanding
  useEffect(() => {
    if (!collapsed) {
      setHoveredItem(null);
    }
  }, [collapsed]);

  const handleItemMouseEnter = (e: React.MouseEvent<HTMLAnchorElement>, label: string) => {
    if (!collapsed) return;
    const rect = e.currentTarget.getBoundingClientRect();
    setHoveredItem({ label, top: rect.top });
  };

  const handleItemMouseLeave = () => {
    setHoveredItem(null);
  };

  const toggleCollapsed = () => {
    setCollapsed(prev => !prev);
  };

  const handleSidebarMouseEnter = () => {
    if (window.innerWidth < 768) return;
    
    if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
    
    hoverTimeoutRef.current = setTimeout(() => {
      setCollapsed(false);
    }, 150);
  };

  const handleSidebarMouseLeave = () => {
    if (window.innerWidth < 768) return;
    
    if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
    setCollapsed(true);
  };

  return (
    <>
      <aside 
        className={`fixed left-0 top-0 z-50 h-[100dvh] bg-white dark:bg-slate-950 border-r border-slate-200 dark:border-slate-800 transition-all duration-300 ease-in-out flex flex-col group/sidebar ${collapsed ? 'w-16' : 'w-64'}`}
        onMouseEnter={handleSidebarMouseEnter}
        onMouseLeave={handleSidebarMouseLeave}
      >
        <div className={`flex items-center justify-between h-16 px-4 border-b border-slate-200 dark:border-slate-800 shrink-0`}>
          <div className={`overflow-hidden transition-all duration-300 ease-in-out ${collapsed ? 'w-0 opacity-0' : 'w-40 opacity-100'}`}>
            <span className="font-bold text-lg text-blue-600 dark:text-blue-400 tracking-tight whitespace-nowrap">Azin's Toolkit</span>
          </div>
          <button 
            onClick={toggleCollapsed}
            className={`p-1.5 rounded-md text-slate-500 dark:text-slate-400 transition-colors duration-300 shrink-0`}
          >
            <MenuIcon className="w-5 h-5" />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto overflow-x-hidden py-4 px-2 space-y-6 scrollbar-hide">
          {groups.map((group, groupIdx) => (
            <div key={groupIdx} className="space-y-1">
              {/* Category Header */}
              <div className={`px-3 mb-2 text-xs font-semibold text-slate-500 dark:text-slate-500 uppercase tracking-wider overflow-hidden transition-all duration-300 ease-in-out whitespace-nowrap ${collapsed ? 'h-0 opacity-0' : 'h-auto opacity-100'}`}>
                 {t(group.title)}
              </div>
              
              {collapsed && group.title && groupIdx > 0 && (
                <div className="border-t border-slate-200 dark:border-slate-800 mx-2 my-2"></div>
              )}

              {group.items.map((item) => (
                <NavLink
                  key={item.id}
                  to={item.path}
                  onMouseEnter={(e) => handleItemMouseEnter(e, t(item.label))}
                  onMouseLeave={handleItemMouseLeave}
                  className={({ isActive }) => `
                    flex items-center py-2.5 rounded-lg transition-all duration-300 group relative px-0
                    ${isActive 
                      ? 'bg-blue-600 text-white shadow-md shadow-blue-900/20' 
                      : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'}
                  `}
                >
                  <span className="shrink-0 flex items-center justify-center w-12">
                    {item.icon}
                  </span>
                  
                  <span className={`font-medium whitespace-nowrap overflow-hidden text-sm transition-all duration-300 ease-in-out ${collapsed ? 'max-w-0 opacity-0' : 'max-w-[200px] opacity-100'}`}>
                    {t(item.label)}
                  </span>
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
               className="p-2 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 transition-colors duration-300"
             >
               {theme === 'dark' ? <SunIcon className="w-5 h-5" /> : <MoonIcon className="w-5 h-5" />}
             </button>

             <button
               onClick={toggleLanguage}
               title={language === 'en' ? "切换到中文" : "Switch to English"}
               className="p-2 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 transition-colors duration-300 flex items-center"
             >
               <GlobeIcon className="w-5 h-5" />
               <span className={`text-xs font-bold whitespace-nowrap overflow-hidden transition-all duration-300 ease-in-out ${collapsed ? 'max-w-0 opacity-0 ml-0' : 'max-w-[50px] opacity-100 ml-2'}`}>{language === 'en' ? 'ZH' : 'EN'}</span>
             </button>
           </div>

           <div className={`text-xs text-slate-400 dark:text-slate-600 text-center mt-2 whitespace-nowrap overflow-hidden transition-all duration-300 ease-in-out ${collapsed ? 'h-0 opacity-0' : 'h-auto opacity-100'}`}>
              v1.2.0 • © 2024 Azin
           </div>
        </div>
      </aside>
    </>
  );
};
