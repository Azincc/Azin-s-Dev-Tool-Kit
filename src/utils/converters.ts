import YAML from 'js-yaml';

export type FormatType = 'json' | 'yaml' | 'xml';

interface ConversionOptions {
  indent?: number;
}

const detectFormat = (input: string): FormatType | null => {
  const trimmed = input.trim();

  if (trimmed.startsWith('{') || trimmed.startsWith('[')) {
    return 'json';
  }

  if (trimmed.startsWith('<?xml') || trimmed.startsWith('<')) {
    return 'xml';
  }

  if (trimmed.includes(':') && !trimmed.includes('{')) {
    return 'yaml';
  }

  return null;
};

const jsonToYaml = (obj: any, options: ConversionOptions = {}): string => {
  try {
    return YAML.dump(obj, {
      indent: options.indent || 2,
      lineWidth: -1,
      quotingType: '"',
    });
  } catch (e) {
    throw new Error(`YAML conversion failed: ${(e as Error).message}`);
  }
};

const yamlToJson = (yaml: string): any => {
  try {
    const parsed = YAML.load(yaml);
    return parsed;
  } catch (e) {
    throw new Error(`YAML parsing failed: ${(e as Error).message}`);
  }
};

const xmlToJson = (xml: string): any => {
  try {
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xml, 'text/xml');

    if (xmlDoc.getElementsByTagName('parsererror').length > 0) {
      throw new Error('Invalid XML structure');
    }

    return xmlNodeToObject(xmlDoc.documentElement);
  } catch (e) {
    throw new Error(`XML parsing failed: ${(e as Error).message}`);
  }
};

const xmlNodeToObject = (node: Element): any => {
  const obj: any = {};

  if (node.children.length === 0) {
    const text = node.textContent?.trim();
    return text || null;
  }

  const childMap: { [key: string]: any[] } = {};

  for (let i = 0; i < node.children.length; i++) {
    const child = node.children[i] as Element;
    const childName = child.nodeName;
    const childValue = xmlNodeToObject(child);

    if (!childMap[childName]) {
      childMap[childName] = [];
    }
    childMap[childName].push(childValue);
  }

  for (const [key, values] of Object.entries(childMap)) {
    obj[key] = values.length === 1 ? values[0] : values;
  }

  return obj;
};

const jsonToXml = (obj: any, rootName = 'root', indent = 0): string => {
  const indentStr = '  '.repeat(indent);
  const nextIndent = '  '.repeat(indent + 1);

  if (obj === null || obj === undefined) {
    return `${indentStr}<${rootName} />`;
  }

  if (typeof obj !== 'object') {
    return `${indentStr}<${rootName}>${escapeXml(String(obj))}</${rootName}>`;
  }

  if (Array.isArray(obj)) {
    return obj.map((item, idx) => jsonToXml(item, rootName, indent)).join('\n');
  }

  const entries = Object.entries(obj);
  if (entries.length === 0) {
    return `${indentStr}<${rootName} />`;
  }

  const children = entries.map(([key, value]) => jsonToXml(value, key, indent + 1)).join('\n');

  return `${indentStr}<${rootName}>\n${children}\n${indentStr}</${rootName}>`;
};

const escapeXml = (str: string): string => {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
};

const convert = (
  input: string,
  sourceFormat: FormatType,
  targetFormat: FormatType,
  options: ConversionOptions = {}
): string => {
  try {
    if (sourceFormat === targetFormat) {
      if (sourceFormat === 'json') {
        return JSON.stringify(JSON.parse(input), null, options.indent || 2);
      } else if (sourceFormat === 'yaml') {
        return jsonToYaml(yamlToJson(input), options);
      } else if (sourceFormat === 'xml') {
        return jsonToXml(xmlToJson(input), 'root', 0);
      }
    }

    let intermediate: any;

    if (sourceFormat === 'json') {
      intermediate = JSON.parse(input);
    } else if (sourceFormat === 'yaml') {
      intermediate = yamlToJson(input);
    } else if (sourceFormat === 'xml') {
      intermediate = xmlToJson(input);
    }

    let output: string;

    if (targetFormat === 'json') {
      output = JSON.stringify(intermediate, null, options.indent || 2);
    } else if (targetFormat === 'yaml') {
      output = jsonToYaml(intermediate, options);
    } else if (targetFormat === 'xml') {
      output = `<?xml version="1.0" encoding="UTF-8"?>\n${jsonToXml(intermediate, 'root', 0)}`;
    } else {
      throw new Error('Invalid target format');
    }

    return output;
  } catch (e) {
    throw new Error((e as Error).message);
  }
};

export { detectFormat, convert, jsonToYaml, yamlToJson, xmlToJson, jsonToXml };
