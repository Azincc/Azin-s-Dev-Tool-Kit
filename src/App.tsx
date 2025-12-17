import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ToastProvider } from './components/ui/Toast';
import { Sidebar } from './components/Sidebar';
import { NavGroup } from './types';
import {
  FileJsonIcon,
  LockIcon,
  PaletteIcon,
  FileTextIcon,
  CodeIcon,
  ShuffleIcon,
  HashIcon,
  KeyIcon,
  ShieldIcon,
  ImageIcon,
  BoxIcon,
  RegexIcon,
  DiffIcon,
  ClockIcon,
  GlobeIcon,
  TableIcon,
  ShareIcon,
  ActivityIcon,
  ServerIcon,
  MonitorIcon,
  LayoutGridIcon,
} from './components/ui/Icons';
import { AppProvider } from './contexts/AppContext';

// Pages & Tools - Lazy loaded
const Home = React.lazy(() => import('./pages/Home'));
const JsonTools = React.lazy(() =>
  import('./components/tools/JsonTools').then((m) => ({
    default: m.JsonTools,
  }))
);
const CodeTools = React.lazy(() =>
  import('./components/tools/CodeTools').then((m) => ({
    default: m.CodeTools,
  }))
);
const EncoderTools = React.lazy(() =>
  import('./components/tools/EncoderTools').then((m) => ({
    default: m.EncoderTools,
  }))
);
const CsvTools = React.lazy(() =>
  import('./components/tools/CsvTools').then((m) => ({ default: m.CsvTools }))
);
const HashTools = React.lazy(() =>
  import('./components/tools/HashTools').then((m) => ({
    default: m.HashTools,
  }))
);
const EncryptTools = React.lazy(() =>
  import('./components/tools/EncryptTools').then((m) => ({
    default: m.EncryptTools,
  }))
);
const JwtTools = React.lazy(() =>
  import('./components/tools/JwtTools').then((m) => ({ default: m.JwtTools }))
);
const PasswordTools = React.lazy(() =>
  import('./components/tools/PasswordTools').then((m) => ({
    default: m.PasswordTools,
  }))
);
const ColorPaletteTools = React.lazy(() =>
  import('./components/tools/ColorPaletteTools').then((m) => ({
    default: m.ColorPaletteTools,
  }))
);
const ImageTools = React.lazy(() =>
  import('./components/tools/ImageTools').then((m) => ({
    default: m.ImageTools,
  }))
);
const CssGenTools = React.lazy(() =>
  import('./components/tools/CssGenTools').then((m) => ({
    default: m.CssGenTools,
  }))
);
const EditorTools = React.lazy(() =>
  import('./components/tools/EditorTools').then((m) => ({
    default: m.EditorTools,
  }))
);
const RegexTools = React.lazy(() =>
  import('./components/tools/RegexTools').then((m) => ({
    default: m.RegexTools,
  }))
);
const DiffTools = React.lazy(() =>
  import('./components/tools/DiffTools').then((m) => ({
    default: m.DiffTools,
  }))
);
const CrontabTools = React.lazy(() =>
  import('./components/tools/CrontabTools').then((m) => ({
    default: m.CrontabTools,
  }))
);
const WorldClockTools = React.lazy(() =>
  import('./components/tools/WorldClockTools').then((m) => ({
    default: m.WorldClockTools,
  }))
);
const SubnetTools = React.lazy(() =>
  import('./components/tools/SubnetCalculator').then((m) => ({
    default: m.SubnetCalculator,
  }))
);
const UATools = React.lazy(() =>
  import('./components/tools/UAParserTool').then((m) => ({
    default: m.UAParserTool,
  }))
);
const CurlTools = React.lazy(() =>
  import('./components/tools/CurlGenerator').then((m) => ({
    default: m.CurlGenerator,
  }))
);
const LatencyTools = React.lazy(() =>
  import('./components/tools/LatencyTools').then((m) => ({
    default: m.LatencyTools,
  }))
);

const navGroups: NavGroup[] = [
  {
    items: [{ id: 'home', label: 'nav.home', icon: <LayoutGridIcon />, path: '/' }],
  },
  {
    title: 'nav.formatters',
    items: [
      { id: 'json', label: 'nav.json', icon: <FileJsonIcon />, path: '/json' },
      { id: 'code', label: 'nav.code', icon: <CodeIcon />, path: '/code' },
      {
        id: 'encoders',
        label: 'nav.encoders',
        icon: <ShuffleIcon />,
        path: '/encoders',
      },
    ],
  },
  {
    title: 'nav.security',
    items: [
      {
        id: 'hashing',
        label: 'nav.hashing',
        icon: <HashIcon />,
        path: '/hashing',
      },
      {
        id: 'encrypt',
        label: 'nav.encryption',
        icon: <LockIcon />,
        path: '/encryption',
      },
      { id: 'jwt', label: 'nav.jwt', icon: <ShieldIcon />, path: '/jwt' },
      {
        id: 'pass',
        label: 'nav.passwords',
        icon: <KeyIcon />,
        path: '/passwords',
      },
    ],
  },
  {
    title: 'nav.frontend',
    items: [
      {
        id: 'colors',
        label: 'nav.colors',
        icon: <PaletteIcon />,
        path: '/colors',
      },
      {
        id: 'images',
        label: 'nav.images',
        icon: <ImageIcon />,
        path: '/images',
      },
      { id: 'css', label: 'nav.css', icon: <BoxIcon />, path: '/css' },
    ],
  },
  {
    title: 'nav.network',
    items: [
      {
        id: 'subnet',
        label: 'nav.subnet',
        icon: <ServerIcon />,
        path: '/subnet',
      },
      { id: 'ua', label: 'nav.ua', icon: <MonitorIcon />, path: '/ua' },
      { id: 'curl', label: 'nav.curl', icon: <ShareIcon />, path: '/curl' },
      {
        id: 'latency',
        label: 'nav.latency',
        icon: <ActivityIcon />,
        path: '/latency',
      },
    ],
  },
  {
    title: 'nav.text',
    items: [
      {
        id: 'editor',
        label: 'nav.editor',
        icon: <FileTextIcon />,
        path: '/editor',
      },
      { id: 'regex', label: 'nav.regex', icon: <RegexIcon />, path: '/regex' },
      { id: 'diff', label: 'nav.diff', icon: <DiffIcon />, path: '/diff' },
    ],
  },
  {
    title: 'nav.time',
    items: [
      {
        id: 'crontab',
        label: 'nav.crontab',
        icon: <CodeIcon />,
        path: '/crontab',
      },
      {
        id: 'worldclock',
        label: 'nav.worldclock',
        icon: <GlobeIcon />,
        path: '/worldclock',
      },
    ],
  },
];

const MainLayout = () => {
  return (
    <div className="flex min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 font-sans selection:bg-blue-500/30 transition-colors duration-300">
      <Sidebar groups={navGroups} />

      <main className="flex-1 ml-16 md:ml-16 transition-all duration-300 group-hover/sidebar:md:ml-64">
        <div className="container mx-auto p-6 md:p-8 lg:p-12 max-w-7xl animate-fade-in">
          <React.Suspense fallback={null}>
            <Routes>
              <Route path="/" element={<Home />} />

              {/* Formatters */}
              <Route path="/json" element={<JsonTools />} />
              <Route path="/csv" element={<CsvTools />} />
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

              {/* Network */}
              <Route path="/subnet" element={<SubnetTools />} />
              <Route path="/ua" element={<UATools />} />
              <Route path="/curl" element={<CurlTools />} />
              <Route path="/latency" element={<LatencyTools />} />

              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </React.Suspense>
        </div>
      </main>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <HashRouter>
      <AppProvider>
        <ToastProvider>
          <MainLayout />
        </ToastProvider>
      </AppProvider>
    </HashRouter>
  );
};

export default App;
