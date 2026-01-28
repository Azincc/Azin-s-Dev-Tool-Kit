import React from 'react';
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
  GlobeIcon,
  ShareIcon,
  ActivityIcon,
  ServerIcon,
  MonitorIcon,
  LayoutGridIcon,
  ClockIcon,
} from './components/ui/Icons';

// Pages & Tools - Lazy loaded
export const Home = React.lazy(() => import('./pages/Home'));
export const JsonTools = React.lazy(() =>
  import('./components/tools/JsonTools').then((m) => ({
    default: m.JsonTools,
  }))
);
export const CodeTools = React.lazy(() =>
  import('./components/tools/CodeTools').then((m) => ({
    default: m.CodeTools,
  }))
);
export const EncoderTools = React.lazy(() =>
  import('./components/tools/EncoderTools').then((m) => ({
    default: m.EncoderTools,
  }))
);
export const CsvTools = React.lazy(() =>
  import('./components/tools/CsvTools').then((m) => ({ default: m.CsvTools }))
);
export const HashTools = React.lazy(() =>
  import('./components/tools/HashTools').then((m) => ({
    default: m.HashTools,
  }))
);
export const EncryptTools = React.lazy(() =>
  import('./components/tools/EncryptTools').then((m) => ({
    default: m.EncryptTools,
  }))
);
export const JwtTools = React.lazy(() =>
  import('./components/tools/JwtTools').then((m) => ({ default: m.JwtTools }))
);
export const PasswordTools = React.lazy(() =>
  import('./components/tools/PasswordTools').then((m) => ({
    default: m.PasswordTools,
  }))
);
export const ColorPaletteTools = React.lazy(() =>
  import('./components/tools/ColorPaletteTools').then((m) => ({
    default: m.ColorPaletteTools,
  }))
);
export const ImageTools = React.lazy(() =>
  import('./components/tools/ImageTools').then((m) => ({
    default: m.ImageTools,
  }))
);
export const CssGenTools = React.lazy(() =>
  import('./components/tools/CssGenTools').then((m) => ({
    default: m.CssGenTools,
  }))
);
export const EditorTools = React.lazy(() =>
  import('./components/tools/EditorTools').then((m) => ({
    default: m.EditorTools,
  }))
);
export const RegexTools = React.lazy(() =>
  import('./components/tools/RegexTools').then((m) => ({
    default: m.RegexTools,
  }))
);
export const DiffTools = React.lazy(() =>
  import('./components/tools/DiffTools').then((m) => ({
    default: m.DiffTools,
  }))
);
export const CrontabTools = React.lazy(() =>
  import('./components/tools/CrontabTools').then((m) => ({
    default: m.CrontabTools,
  }))
);
export const WorldClockTools = React.lazy(() =>
  import('./components/tools/WorldClockTools').then((m) => ({
    default: m.WorldClockTools,
  }))
);
export const SubnetTools = React.lazy(() =>
  import('./components/tools/SubnetCalculator').then((m) => ({
    default: m.SubnetCalculator,
  }))
);
export const UATools = React.lazy(() =>
  import('./components/tools/UAParserTool').then((m) => ({
    default: m.UAParserTool,
  }))
);
export const CurlTools = React.lazy(() =>
  import('./components/tools/CurlGenerator').then((m) => ({
    default: m.CurlGenerator,
  }))
);
export const LatencyTools = React.lazy(() =>
  import('./components/tools/LatencyTools').then((m) => ({
    default: m.LatencyTools,
  }))
);
export const TimestampTools = React.lazy(() =>
  import('./components/tools/TimestampTools').then((m) => ({
    default: m.TimestampTools,
  }))
);

// Map paths to components for easier routing
export const routesMap: Record<string, React.ComponentType<any>> = {
  '/': Home,
  '/json': JsonTools,
  '/csv': CsvTools,
  '/code': CodeTools,
  '/encoders': EncoderTools,
  '/hashing': HashTools,
  '/encryption': EncryptTools,
  '/jwt': JwtTools,
  '/passwords': PasswordTools,
  '/colors': ColorPaletteTools,
  '/images': ImageTools,
  '/css': CssGenTools,
  '/editor': EditorTools,
  '/regex': RegexTools,
  '/diff': DiffTools,
  '/crontab': CrontabTools,
  '/worldclock': WorldClockTools,
  '/subnet': SubnetTools,
  '/ua': UATools,
  '/curl': CurlTools,
  '/latency': LatencyTools,
  '/timestamp': TimestampTools,
};

export const navGroups: NavGroup[] = [
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
      {
        id: 'timestamp',
        label: 'nav.timestamp',
        icon: <ClockIcon />,
        path: '/timestamp',
      },
    ],
  },
];
