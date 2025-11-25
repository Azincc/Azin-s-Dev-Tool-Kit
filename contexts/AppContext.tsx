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

  // Time Tools
  "nav.time": { en: "Time Tools", zh: "时间工具" },
  "nav.crontab": { en: "Crontab", zh: "Crontab" },
  "nav.worldclock": { en: "World Clock", zh: "世界时钟" },
  
  // Home
  "home.title": { en: "Welcome to Azin's Dev Toolkit", zh: "欢迎使用 Azin 的开发工具集" },
  "home.desc": { en: "One-stop solution for JSON formatting, cryptography testing, color manipulation, and more.", zh: "一站式解决 JSON 格式化、加解密测试、颜色处理等开发需求。" },
  "home.start": { en: "Get Started", zh: "开始使用" },
  "home.footer": { en: "Built for developers, by developers.", zh: "为开发者打造，由开发者构建。" },

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

  "tool.crontab.title": { en: "Crontab Interpreter", zh: "Crontab 解释器" },
  "tool.crontab.desc": { en: "Explain cron expressions in plain English.", zh: "用自然语言解释 Cron 表达式。" },

  "tool.worldclock.title": { en: "World Clock & Calibration", zh: "世界时钟与校准" },
  "tool.worldclock.desc": { en: "Check local times and calibrate global time.", zh: "查看各地时间及全球时间校准。" },

  "tool.crontab.builder": { en: "Cron Expression Builder", zh: "Cron 表达式生成器" },
  "tool.crontab.manual": { en: "Manual Edit", zh: "手动编辑" },
  "tool.crontab.format": { en: "Format: Minute Hour Day Month Week", zh: "格式：分 时 日 月 周" },
  "tool.crontab.meaning": { en: "Meaning:", zh: "含义：" },
  "tool.crontab.minute": { en: "Minute (Min)", zh: "分" },
  "tool.crontab.hour": { en: "Hour (Hr)", zh: "时" },
  "tool.crontab.day": { en: "Day (Day)", zh: "日" },
  "tool.crontab.month": { en: "Month (Mon)", zh: "月" },
  "tool.crontab.week": { en: "Week (Wk)", zh: "周" },

  "tool.crontab.everyMin": { en: "Every Minute (*)", zh: "每分钟 (*)" },
  "tool.crontab.every5Min": { en: "Every 5 Min (*/5)", zh: "每5分钟 (*/5)" },
  "tool.crontab.every15Min": { en: "Every 15 Min (*/15)", zh: "每15分钟 (*/15)" },
  "tool.crontab.at0": { en: "At 0 (0)", zh: "整点 (0)" },
  "tool.crontab.at30": { en: "At 30 (30)", zh: "半点 (30)" },
  
  "tool.crontab.everyHour": { en: "Every Hour (*)", zh: "每小时 (*)" },
  "tool.crontab.every2Hours": { en: "Every 2 Hours (*/2)", zh: "每2小时 (*/2)" },
  "tool.crontab.midnight": { en: "Midnight (0)", zh: "午夜 (0)" },
  "tool.crontab.noon": { en: "Noon (12)", zh: "中午 (12)" },

  "tool.crontab.everyDay": { en: "Every Day (*)", zh: "每天 (*)" },
  "tool.crontab.everyMonth": { en: "Every Month (*)", zh: "每月 (*)" },

  "tool.crontab.sun": { en: "Sunday (0)", zh: "周日 (0)" },
  "tool.crontab.mon": { en: "Monday (1)", zh: "周一 (1)" },
  "tool.crontab.tue": { en: "Tuesday (2)", zh: "周二 (2)" },
  "tool.crontab.wed": { en: "Wednesday (3)", zh: "周三 (3)" },
  "tool.crontab.thu": { en: "Thursday (4)", zh: "周四 (4)" },
  "tool.crontab.fri": { en: "Friday (5)", zh: "周五 (5)" },
  "tool.crontab.sat": { en: "Saturday (6)", zh: "周六 (6)" },

  "tool.worldclock.calibration": { en: "Global Time Calibration", zh: "全球时间校准" },
  "tool.worldclock.server": { en: "Server Time (Source of Truth)", zh: "服务器时间 (标准源)" },
  "tool.worldclock.local": { en: "Local System Time", zh: "本地系统时间" },
  "tool.worldclock.offset": { en: "Offset", zh: "偏差" },
  "tool.worldclock.source": { en: "Source", zh: "来源" },
  "tool.worldclock.sync": { en: "Sync Now", zh: "立即同步" },
  "tool.worldclock.syncing": { en: "Syncing...", zh: "同步中..." },

  // JsonToolkit
  "tool.json.input": { en: "Input JSON", zh: "输入 JSON" },
  "tool.json.error": { en: "Error", zh: "错误" },
  "tool.json.output": { en: "Output", zh: "输出" },
  "tool.json.prettify": { en: "Prettify", zh: "美化" },
  "tool.json.minify": { en: "Minify", zh: "压缩" },
  "tool.code.input": { en: "Input Code", zh: "输入代码" },
  "tool.code.output": { en: "Formatted Output", zh: "格式化输出" },
  "tool.code.paste": { en: "Paste code here...", zh: "在此粘贴代码..." },
  "tool.encoder.mode": { en: "Mode", zh: "模式" },
  "tool.encoder.input": { en: "Input", zh: "输入" },
  "tool.encoder.result": { en: "Result", zh: "结果" },
  "tool.encoder.type": { en: "Type here...", zh: "在此输入..." },

  // SecurityTools
  "tool.hash.input_source": { en: "Input Source", zh: "输入源" },
  "tool.hash.text": { en: "Text", zh: "文本" },
  "tool.hash.type_placeholder": { en: "Type to hash...", zh: "输入以计算哈希..." },
  "tool.hash.or_file": { en: "Or File", zh: "或上传文件" },
  "tool.hash.skipped": { en: "Skipped for file", zh: "文件模式已跳过" },
  "tool.hash.waiting": { en: "Waiting for input...", zh: "等待输入..." },
  "tool.encrypt.demo_title": { en: "XOR Cipher Demo", zh: "XOR 加密演示" },
  "tool.encrypt.message": { en: "Message", zh: "消息" },
  "tool.encrypt.secret_placeholder": { en: "Secret Message", zh: "秘密消息" },
  "tool.encrypt.secret_key": { en: "Secret Key", zh: "密钥" },
  "tool.encrypt.action": { en: "Encrypt / Decrypt", zh: "加密 / 解密" },
  "tool.encrypt.result": { en: "Result", zh: "结果" },
  "tool.jwt.encoded": { en: "Encoded Token", zh: "编码 Token" },
  "tool.jwt.header": { en: "Header", zh: "头部" },
  "tool.jwt.payload": { en: "Payload", zh: "载荷" },
  "tool.jwt.invalid": { en: "Invalid Token", zh: "无效 Token" },
  "tool.pass.length": { en: "Length", zh: "长度" },
  "tool.pass.generate": { en: "Generate Batch", zh: "批量生成" },
  "tool.pass.click_generate": { en: "Click generate", zh: "点击生成" },

  // ColorTools
  "tool.color.picker": { en: "Picker", zh: "取色器" },
  "tool.color.shades": { en: "Shades", zh: "色阶" },
  "tool.image.base64_title": { en: "Image to Base64", zh: "图片转 Base64" },
  "tool.image.qr_title": { en: "QR Code Generator", zh: "二维码生成器" },
  "tool.image.qr_placeholder": { en: "Enter URL or Text", zh: "输入 URL 或文本" },
  "tool.css.controls": { en: "Controls", zh: "控制" },
  "tool.css.border_radius": { en: "Border Radius", zh: "圆角半径" },
  "tool.css.box_shadow": { en: "Box Shadow", zh: "阴影" },
  "tool.css.blur": { en: "Blur", zh: "模糊" },
  "tool.css.spread": { en: "Spread", zh: "扩散" },
  "tool.css.output": { en: "CSS Output", zh: "CSS 输出" },

  // TextTools
  "tool.editor.editor": { en: "Editor", zh: "编辑器" },
  "tool.editor.placeholder": { en: "Paste text here...", zh: "在此粘贴文本..." },
  "tool.editor.stats": { en: "Statistics", zh: "统计" },
  "tool.editor.chars": { en: "Chars", zh: "字符" },
  "tool.editor.words": { en: "Words", zh: "单词" },
  "tool.editor.lines": { en: "Lines", zh: "行数" },
  "tool.editor.actions": { en: "Actions", zh: "操作" },
  "tool.editor.lorem": { en: "Insert Lorem", zh: "插入 Lorem Ipsum" },
  "tool.editor.dedupe": { en: "Dedupe Lines", zh: "去重行" },
  "tool.editor.uppercase": { en: "UPPER CASE", zh: "转大写" },
  "tool.editor.clear": { en: "Clear", zh: "清空" },
  "tool.regex.pattern": { en: "Pattern", zh: "模式" },
  "tool.regex.flags": { en: "Flags", zh: "修饰符" },
  "tool.regex.test_placeholder": { en: "Test string...", zh: "测试字符串..." },
  "tool.regex.matches": { en: "Matches", zh: "匹配结果" },
  "tool.regex.invalid": { en: "Invalid Regex", zh: "无效正则表达式" },
  "tool.regex.no_matches": { en: "No matches found", zh: "未找到匹配项" },
  "tool.diff.original": { en: "Original", zh: "原始内容" },
  "tool.diff.changed": { en: "Changed", zh: "修改后" },
  "tool.diff.result": { en: "Result", zh: "结果" },
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
  const [language, setLanguage] = useState<Language>('zh');

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
