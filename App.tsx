import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Sidebar } from './components/Sidebar';
import { NavGroup } from './types';
import { 
  HomeIcon, FileJsonIcon, LockIcon, PaletteIcon, FileTextIcon,
  CodeIcon, ShuffleIcon, HashIcon, KeyIcon, ShieldIcon, ImageIcon, BoxIcon, RegexIcon, DiffIcon, ClockIcon, GlobeIcon
} from './components/ui/Icons';
import { AppProvider } from './contexts/AppContext';

// Pages & Tools
import Home from './pages/Home';
import { JsonTools, CodeTools, EncoderTools } from './pages/JsonToolkit';
import { HashTools, EncryptTools, JwtTools, PasswordTools } from './pages/SecurityTools';
import { ColorPaletteTools, ImageTools, CssGenTools } from './pages/ColorTools';
import { EditorTools, RegexTools, DiffTools } from './pages/TextTools';
import { CrontabTools, WorldClockTools } from './pages/TimeTools';

const navGroups: NavGroup[] = [
  {
    items: [
      { id: 'home', label: 'nav.home', icon: <HomeIcon />, path: '/' }
    ]
  },
  {
    title: 'nav.formatters',
    items: [
      { id: 'json', label: 'nav.json', icon: <FileJsonIcon />, path: '/json' },
      { id: 'code', label: 'nav.code', icon: <CodeIcon />, path: '/code' },
      { id: 'encoders', label: 'nav.encoders', icon: <ShuffleIcon />, path: '/encoders' },
    ]
  },
  {
    title: 'nav.security',
    items: [
      { id: 'hashing', label: 'nav.hashing', icon: <HashIcon />, path: '/hashing' },
      { id: 'encrypt', label: 'nav.encryption', icon: <LockIcon />, path: '/encryption' },
      { id: 'jwt', label: 'nav.jwt', icon: <ShieldIcon />, path: '/jwt' },
      { id: 'pass', label: 'nav.passwords', icon: <KeyIcon />, path: '/passwords' },
    ]
  },
  {
    title: 'nav.frontend',
    items: [
      { id: 'colors', label: 'nav.colors', icon: <PaletteIcon />, path: '/colors' },
      { id: 'images', label: 'nav.images', icon: <ImageIcon />, path: '/images' },
      { id: 'css', label: 'nav.css', icon: <BoxIcon />, path: '/css' },
    ]
  },
  {
    title: 'nav.text',
    items: [
      { id: 'editor', label: 'nav.editor', icon: <FileTextIcon />, path: '/editor' },
      { id: 'regex', label: 'nav.regex', icon: <RegexIcon />, path: '/regex' },
      { id: 'diff', label: 'nav.diff', icon: <DiffIcon />, path: '/diff' },
    ]
  },
  {
    title: 'nav.time',
    items: [
      { id: 'crontab', label: 'nav.crontab', icon: <CodeIcon />, path: '/crontab' },
      { id: 'worldclock', label: 'nav.worldclock', icon: <GlobeIcon />, path: '/worldclock' },
    ]
  }
];

const MainLayout = () => {
  return (
    <div className="flex min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 font-sans selection:bg-blue-500/30 transition-colors duration-300">
      <Sidebar groups={navGroups} />
      
      <main className="flex-1 ml-16 md:ml-16 transition-all duration-300 group-hover/sidebar:md:ml-64">
        <div className="container mx-auto p-6 md:p-8 lg:p-12 max-w-7xl animate-fade-in">
          <Routes>
            <Route path="/" element={<Home />} />
            
            {/* Formatters */}
            <Route path="/json" element={<JsonTools />} />
            <Route path="/code" element={<CodeTools />} />
            <Route path="/encoders" element={<EncoderTools />} />

            {/* Security */}
            <Route path="/hashing" element={<HashTools />} />
            <Route path="/encryption" element={<EncryptTools />} />
            <Route path="/jwt" element={<JwtTools />} />
            <Route path="/passwords" element={<PasswordTools />} />

            {/* Frontend */}
            <Route path="/colors" element={<ColorPaletteTools />} />
            <Route path="/images" element={<ImageTools />} />
            <Route path="/css" element={<CssGenTools />} />

            {/* Text */}
            <Route path="/editor" element={<EditorTools />} />
            <Route path="/regex" element={<RegexTools />} />
            <Route path="/diff" element={<DiffTools />} />

            {/* Time */}
            <Route path="/crontab" element={<CrontabTools />} />
            <Route path="/worldclock" element={<WorldClockTools />} />

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </main>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <HashRouter>
      <AppProvider>
        <MainLayout />
      </AppProvider>
    </HashRouter>
  );
};

export default App;