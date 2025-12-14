import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CopyButton, Select } from '../ui/Shared';
import { useAppContext } from '../../contexts/AppContext';
import Editor from '@monaco-editor/react';

type Language = 'html' | 'css' | 'json' | 'javascript' | 'typescript' | 'xml' | 'yaml';

const MONACO_LANGUAGES: Record<Language, string> = {
  html: 'html',
  css: 'css',
  json: 'json',
  javascript: 'javascript',
  typescript: 'typescript',
  xml: 'xml',
  yaml: 'yaml',
};

export const CodeTools: React.FC = () => {
  const [codeInput, setCodeInput] = useState<string>('');
  const [codeLang, setCodeLang] = useState<Language>('html');
  const [codeOutput, setCodeOutput] = useState<string>('');
  const { t } = useAppContext();
  const editorRef = React.useRef<any>(null);
  const monacoRef = React.useRef<any>(null);

  useEffect(() => {
    handleFormat();
    handleValidation();
  }, [codeInput, codeLang]);

  const handleValidation = async () => {
    if (!editorRef.current || !monacoRef.current) return;

    const model = editorRef.current.getModel();
    if (!model) return;

    if (codeLang === 'yaml') {
      try {
        const yamlModule = await import('js-yaml');
        const load = (yamlModule as any).default?.load || (yamlModule as any).load;
        load(codeInput);
        monacoRef.current.editor.setModelMarkers(model, 'owner', []);
      } catch (e: any) {
        // Console log for debugging
        console.log('YAML Validation Error:', e);
        if (e.mark) {
          monacoRef.current.editor.setModelMarkers(model, 'owner', [
            {
              startLineNumber: e.mark.line + 1,
              startColumn: e.mark.column + 1,
              endLineNumber: e.mark.line + 1,
              endColumn: e.mark.column + 2, // Mark at least one char
              message: e.reason,
              severity: monacoRef.current.MarkerSeverity.Error,
            },
          ]);
        }
      }
    } else {
      // Clear markers for other languages (or implemented checks if we added any)
      // Built-in languages like JSON/TS usually handle their own unless we overrode them?
      // Actually, JSON validation is built-in. We should not clear markers if they are from internal.
      // But setModelMarkers with 'owner' won't clear internal ones if we use a unique owner string.
      monacoRef.current.editor.setModelMarkers(model, 'owner', []);
    }
  };

  const handleFormat = async () => {
    if (!codeInput) {
      setCodeOutput('');
      return;
    }

    try {
      let formatted = '';
      const prettier = await import('prettier/standalone');

      if (codeLang === 'html') {
        const parserHtml = await import('prettier/plugins/html');
        formatted = await prettier.format(codeInput, {
          parser: 'html',
          plugins: [parserHtml as any],
        });
      } else if (codeLang === 'css') {
        const parserCss = await import('prettier/plugins/postcss');
        formatted = await prettier.format(codeInput, {
          parser: 'css',
          plugins: [parserCss as any],
        });
      } else if (codeLang === 'javascript') {
        const parserBabel = await import('prettier/plugins/babel');
        const parserEstree = await import('prettier/plugins/estree');
        formatted = await prettier.format(codeInput, {
          parser: 'babel',
          plugins: [parserBabel as any, parserEstree as any],
        });
      } else if (codeLang === 'typescript') {
        const parserBabel = await import('prettier/plugins/babel');
        const parserEstree = await import('prettier/plugins/estree');
        formatted = await prettier.format(codeInput, {
          parser: 'typescript',
          plugins: [parserBabel as any, parserEstree as any],
        });
      } else if (codeLang === 'json') {
        const parserBabel = await import('prettier/plugins/babel');
        const parserEstree = await import('prettier/plugins/estree');
        formatted = await prettier.format(codeInput, {
          parser: 'json',
          plugins: [parserBabel as any, parserEstree as any],
        });
      } else if (codeLang === 'yaml') {
        const parserYaml = await import('prettier/plugins/yaml');
        formatted = await prettier.format(codeInput, {
          parser: 'yaml',
          plugins: [parserYaml as any],
        });
      } else {
        formatted = codeInput;
      }
      setCodeOutput(formatted);
    } catch (error) {
      // If parsing fails, just show the input as is (or maybe show error)
      // For now, we keep the previous valid output or just show input?
      // Better to show input but maybe with a warning? 
      // Actually, let's show the input but we rely on Monaco to show syntax errors.
      setCodeOutput(codeInput);
      console.error('Formatting error:', error);
    }
  };

  return (
    <div className="space-y-6 h-[calc(100vh-4rem)] flex flex-col">
      <div>
        <h2 className="text-2xl font-bold text-slate-800 dark:text-white">
          {t('tool.code.title')}
        </h2>
        <p className="text-slate-500 dark:text-slate-400">{t('tool.code.desc')}</p>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 flex-1 min-h-0">
        <Card className="flex flex-col h-full overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50 flex justify-between items-center">
            <h3 className="font-semibold text-slate-800 dark:text-white">{t('tool.code.input')}</h3>
            <div className="w-40">
              <Select value={codeLang} onChange={(e) => setCodeLang(e.target.value as Language)}>
                <option value="html">HTML</option>
                <option value="css">CSS</option>
                <option value="javascript">JavaScript</option>
                <option value="typescript">TypeScript</option>
                <option value="json">JSON</option>
                <option value="yaml">YAML</option>
              </Select>
            </div>
          </div>
          <div className="flex-1 min-h-0 border-0 bg-slate-50 dark:bg-slate-900 pt-4">
            <Editor
              height="100%"
              language={MONACO_LANGUAGES[codeLang]}
              value={codeInput}
              onChange={(value) => setCodeInput(value || '')}
              onMount={(editor, monaco) => {
                editorRef.current = editor;
                monacoRef.current = monaco;
              }}
              theme="vs-dark" // We might want to switch based on app theme, but let's stick to dark for code for now or handle theme context.
              // To properly handle theme, we'd need to know the current theme (dark/light) from context.
              // Assuming dark mode is popular for dev tools.
              options={{
                minimap: { enabled: false },
                fontSize: 14,
                wordWrap: 'on',
                automaticLayout: true,
              }}
            />
          </div>
        </Card>
        <Card className="flex flex-col h-full border-blue-900/30 overflow-hidden">
          <CardHeader title={t('tool.code.output')} action={<CopyButton text={codeOutput} />} />
          <div className="flex-1 min-h-0 border-0 bg-slate-100 dark:bg-slate-950 pt-4">
            <Editor
              height="100%"
              language={MONACO_LANGUAGES[codeLang]}
              value={codeOutput}
              options={{
                readOnly: true,
                minimap: { enabled: false },
                fontSize: 14,
                wordWrap: 'on',
                automaticLayout: true,
                domReadOnly: true,
              }}
              theme="vs-dark"
            />
          </div>
        </Card>
      </div>
    </div>
  );
};
