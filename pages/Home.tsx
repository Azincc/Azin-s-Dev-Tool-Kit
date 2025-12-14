import React from 'react';
import { Link } from 'react-router-dom';
import { useAppContext } from '../contexts/AppContext';
import {
  FileJsonIcon, CodeIcon, ShuffleIcon,
  HashIcon, LockIcon, ShieldIcon, KeyIcon,
  PaletteIcon, ImageIcon, BoxIcon,
  FileTextIcon, RegexIcon, DiffIcon,
  ClockIcon, GlobeIcon, ServerIcon, ActivityIcon, ShareIcon
} from '../components/ui/Icons';
import { Card, CardContent } from '../components/ui/Shared';

const PokeBall = () => (
  <svg width="120" height="120" viewBox="0 0 100 100" className="drop-shadow-xl">
    <defs>
      <clipPath id="topHalf">
        <rect x="0" y="0" width="100" height="50" />
      </clipPath>
      <clipPath id="bottomHalf">
        <rect x="0" y="50" width="100" height="50" />
      </clipPath>
    </defs>
    <circle cx="50" cy="50" r="45" fill="#ef4444" clipPath="url(#topHalf)" />
    <circle cx="50" cy="50" r="45" fill="white" clipPath="url(#bottomHalf)" />
    <circle cx="50" cy="50" r="45" fill="none" stroke="#1e293b" strokeWidth="4" />
    <rect x="5" y="47" width="90" height="6" fill="#1e293b" />
    <circle cx="50" cy="50" r="14" fill="white" stroke="#1e293b" strokeWidth="4" />
    <circle cx="50" cy="50" r="8" fill="none" stroke="#94a3b8" strokeWidth="1" />
  </svg>
);

const Home: React.FC = () => {
  const { t } = useAppContext();

  const features = [
    // Formatters
    { title: 'tool.json.title', desc: 'tool.json.desc', icon: <FileJsonIcon className="w-6 h-6" />, path: '/json', color: 'text-orange-500' },
    { title: 'tool.code.title', desc: 'tool.code.desc', icon: <CodeIcon className="w-6 h-6" />, path: '/code', color: 'text-blue-500' },
    { title: 'tool.encoder.title', desc: 'tool.encoder.desc', icon: <ShuffleIcon className="w-6 h-6" />, path: '/encoders', color: 'text-purple-500' },

    // Security
    { title: 'tool.hash.title', desc: 'tool.hash.desc', icon: <HashIcon className="w-6 h-6" />, path: '/hashing', color: 'text-green-500' },
    { title: 'tool.encrypt.title', desc: 'tool.encrypt.desc', icon: <LockIcon className="w-6 h-6" />, path: '/encryption', color: 'text-red-500' },
    { title: 'tool.jwt.title', desc: 'tool.jwt.desc', icon: <ShieldIcon className="w-6 h-6" />, path: '/jwt', color: 'text-pink-500' },
    { title: 'tool.pass.title', desc: 'tool.pass.desc', icon: <KeyIcon className="w-6 h-6" />, path: '/passwords', color: 'text-yellow-500' },

    // Frontend
    { title: 'tool.color.title', desc: 'tool.color.desc', icon: <PaletteIcon className="w-6 h-6" />, path: '/colors', color: 'text-indigo-500' },
    { title: 'tool.image.title', desc: 'tool.image.desc', icon: <ImageIcon className="w-6 h-6" />, path: '/images', color: 'text-sky-500' },
    { title: 'tool.css.title', desc: 'tool.css.desc', icon: <BoxIcon className="w-6 h-6" />, path: '/css', color: 'text-cyan-500' },

    // Text
    { title: 'tool.editor.title', desc: 'tool.editor.desc', icon: <FileTextIcon className="w-6 h-6" />, path: '/editor', color: 'text-slate-500' },
    { title: 'tool.regex.title', desc: 'tool.regex.desc', icon: <RegexIcon className="w-6 h-6" />, path: '/regex', color: 'text-emerald-500' },
    { title: 'tool.diff.title', desc: 'tool.diff.desc', icon: <DiffIcon className="w-6 h-6" />, path: '/diff', color: 'text-amber-500' },

    // Time
    { title: 'tool.crontab.title', desc: 'tool.crontab.desc', icon: <CodeIcon className="w-6 h-6" />, path: '/crontab', color: 'text-teal-500' },
    { title: 'tool.worldclock.title', desc: 'tool.worldclock.desc', icon: <GlobeIcon className="w-6 h-6" />, path: '/worldclock', color: 'text-rose-500' },

    // Network
    { title: 'tool.subnet.title', desc: 'tool.subnet.desc', icon: <ServerIcon className="w-6 h-6" />, path: '/subnet', color: 'text-violet-500' },
    { title: 'tool.ua.title', desc: 'tool.ua.desc', icon: <ActivityIcon className="w-6 h-6" />, path: '/ua', color: 'text-fuchsia-500' },
    { title: 'tool.curl.title', desc: 'tool.curl.desc', icon: <ShareIcon className="w-6 h-6" />, path: '/curl', color: 'text-cyan-600' },
  ];

  return (
    <div className="flex flex-col items-center justify-center p-4 md:p-8 space-y-12 max-w-6xl mx-auto">
      {/* Hero Section */}
      <div className="flex flex-col items-center text-center space-y-6 mt-8">
        <div className="relative group cursor-pointer">
          <div className="absolute -inset-4 bg-gradient-to-r from-red-500 to-blue-500 rounded-full blur-xl opacity-20 group-hover:opacity-40 transition duration-500"></div>
          <div className="relative">
            <PokeBall />
          </div>
        </div>

        <div className="space-y-4 max-w-2xl">
          <h1 className="text-3xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-300 pb-2">
            {t('home.title')}
          </h1>
          <p className="text-slate-600 dark:text-slate-400 text-lg leading-relaxed">
            {t('home.desc')}
          </p>
        </div>
      </div>

      {/* Tools Grid */}
      <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-4 md:gap-6">
        {features.map((feature, idx) => (
          <Link key={idx} to={feature.path} className="group">
            <Card className="h-full hover:shadow-md dark:hover:shadow-blue-900/10 hover:-translate-y-1 transition-all duration-300 border-slate-200 dark:border-slate-800">
              <CardContent className="p-5 flex items-start space-x-4">
                <div className={`p-3 rounded-xl bg-slate-50 dark:bg-slate-900 ${feature.color} ring-1 ring-slate-100 dark:ring-slate-800`}>
                  {feature.icon}
                </div>
                <div className="flex-1 space-y-1">
                  <h3 className="font-semibold text-slate-900 dark:text-slate-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300">
                    {t(feature.title)}
                  </h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-2">
                    {t(feature.desc)}
                  </p>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      <div className="text-sm text-slate-400 dark:text-slate-600 pt-8">
        {t('home.footer')}
      </div>
    </div>
  );
};

export default Home;