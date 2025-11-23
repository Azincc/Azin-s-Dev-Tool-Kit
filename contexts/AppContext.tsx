import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type Theme = 'dark' | 'light';
type Language = 'en' | 'zh';

interface AppContextType {
  theme: Theme;
  toggleTheme: () => void;
  language: Language;
  toggleLanguage: () => void;
  t: (key: string) => string;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const translations: Record<string, { en: string; zh: string }> = {
  // Navigation
  "nav.home": { en: "Home", zh: "首页" },
  "nav.formatters": { en: "Formatters", zh: "格式化工具" },
  "nav.json": { en: "JSON Tools", zh: "JSON 工具" },
  "nav.code": { en: "Code Format", zh: "代码格式化" },
  "nav.encoders": { en: "Encoders", zh: "编解码" },
  "nav.security": { en: "Security", zh: "安全工具" },
  "nav.hashing": { en: "Hashing", zh: "哈希计算" },
  "nav.encryption": { en: "Encryption", zh: "加密解密" },
  "nav.jwt": { en: "JWT Debugger", zh: "JWT 调试" },
  "nav.passwords": { en: "Passwords", zh: "密码生成" },
  "nav.frontend": { en: "Frontend", zh: "前端工具" },
  "nav.colors": { en: "Colors", zh: "颜色工具" },
  "nav.images": { en: "Image Tools", zh: "图片工具" },
  "nav.css": { en: "CSS Gen", zh: "CSS 生成" },
  "nav.text": { en: "Text Data", zh: "文本数据" },
  "nav.editor": { en: "Text Editor", zh: "文本编辑器" },
  "nav.regex": { en: "Regex", zh: "正则测试" },
  "nav.diff": { en: "Diff Checker", zh: "文本比对" },
  
  // Home
  "home.title": { en: "Welcome to Azin's Dev Toolkit", zh: "欢迎使用 Azin 的开发工具集" },
  "home.desc": { en: "One-stop solution for JSON formatting, cryptography testing, color manipulation, and more.", zh: "一站式解决 JSON 格式化、加解密测试、颜色处理等开发需求。" },
  "home.start": { en: "Get Started", zh: "开始使用" },

  // Tools
  "tool.json.title": { en: "JSON Toolkit", zh: "JSON 工具箱" },
  "tool.json.desc": { en: "Format, Minify, and Convert JSON to Type Definitions.", zh: "格式化、压缩及 JSON 转代码定义。" },
  "tool.code.title": { en: "Code Formatter", zh: "代码格式化" },
  "tool.code.desc": { en: "Simple formatting for HTML, SQL, and CSS.", zh: "HTML, SQL, CSS 代码美化。" },
  
  "tool.encoder.title": { en: "Encoders & Decoders", zh: "编码转换工具" },
  "tool.encoder.desc": { en: "Base64, URL, and Hex conversions.", zh: "Base64, URL, 进制转换。" },
  
  "tool.hash.title": { en: "Hash Calculator", zh: "哈希计算器" },
  "tool.hash.desc": { en: "Compute MD5, SHA1, SHA256, SHA512 hashes.", zh: "计算 MD5, SHA1, SHA256, SHA512 散列值。" },
  
  "tool.encrypt.title": { en: "Encryption Tools", zh: "加密工具" },
  "tool.encrypt.desc": { en: "Basic encryption and decryption tests.", zh: "基础加解密测试。" },
  
  "tool.jwt.title": { en: "JWT Debugger", zh: "JWT 调试器" },
  "tool.jwt.desc": { en: "Decode and inspect JSON Web Tokens.", zh: "解析并查看 JSON Web Tokens。" },
  
  "tool.pass.title": { en: "Password Generator", zh: "密码生成器" },
  "tool.pass.desc": { en: "Generate secure random passwords.", zh: "生成安全随机密码。" },
  
  "tool.color.title": { en: "Color Palette", zh: "调色板" },
  "tool.color.desc": { en: "Color picker, conversion and shades.", zh: "取色器、格式转换及色阶生成。" },
  
  "tool.image.title": { en: "Image Tools", zh: "图片工具" },
  "tool.image.desc": { en: "Base64 conversion and QR Code generation.", zh: "图片转 Base64 及二维码生成。" },
  
  "tool.css.title": { en: "CSS Generators", zh: "CSS 生成器" },
  "tool.css.desc": { en: "Visual generators for Shadow and Border Radius.", zh: "阴影与圆角可视化生成。" },
  
  "tool.editor.title": { en: "Text Editor & Stats", zh: "文本编辑与统计" },
  "tool.editor.desc": { en: "Text manipulation and word count.", zh: "文本处理、去重与字数统计。" },
  
  "tool.regex.title": { en: "Regex Tester", zh: "正则表达式测试" },
  "tool.regex.desc": { en: "Test and validate regular expressions.", zh: "测试与验证正则表达式。" },
  
  "tool.diff.title": { en: "Diff Checker", zh: "文本比对" },
  "tool.diff.desc": { en: "Compare two text blocks for differences.", zh: "比较两段文本的差异。" },
};

export const AppProvider: React.FC<{ children?: ReactNode }> = ({ children }) => {
  // Theme state
  const [theme, setTheme] = useState<Theme>(() => {
    if (typeof window !== 'undefined' && window.localStorage) {
      const stored = window.localStorage.getItem('theme');
      if (stored === 'dark' || stored === 'light') return stored;
    }
    return 'dark'; // Default to dark mode
  });

  // Language state
  const [language, setLanguage] = useState<Language>('en');

  // Apply theme class to html element
  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  const toggleLanguage = () => {
    setLanguage(prev => prev === 'en' ? 'zh' : 'en');
  };

  const t = (key: string): string => {
    const translation = translations[key];
    if (!translation) return key;
    return translation[language] || translation['en'];
  };

  return (
    <AppContext.Provider value={{ theme, toggleTheme, language, toggleLanguage, t }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};
