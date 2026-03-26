import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ToastProvider } from './components/ui/Toast';
import { Sidebar } from './components/Sidebar';
import { AppProvider } from './contexts/AppContext';
import { navGroups, routesMap, type RouteComponentMap } from './routes';

interface AppProps {
  routes?: RouteComponentMap;
}

const MainLayout = ({ routes }: { routes: RouteComponentMap }) => {
  return (
    <div className="flex min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 font-sans selection:bg-blue-500/30 transition-colors duration-300">
      <Sidebar groups={navGroups} />

      <main className="flex-1 ml-16 md:ml-16 transition-all duration-300 group-hover/sidebar:md:ml-64">
        <div className="container mx-auto p-6 md:p-8 lg:p-12 max-w-7xl animate-fade-in">
          <React.Suspense fallback={null}>
            <Routes>
              {Object.entries(routes).map(([path, Component]) => (
                <Route key={path} path={path} element={<Component />} />
              ))}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </React.Suspense>
        </div>
      </main>
    </div>
  );
};

const App: React.FC<AppProps> = ({ routes = routesMap }) => {
  return (
    <AppProvider>
      <ToastProvider>
        <MainLayout routes={routes} />
      </ToastProvider>
    </AppProvider>
  );
};

export default App;
