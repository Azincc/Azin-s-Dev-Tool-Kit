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

  // Basic YAML detection (looking for key: value structure or document start)
  if ((trimmed.includes(':') && !trimmed.includes('{') && !trimmed.startsWith('<')) || trimmed.startsWith('---')) {
    return 'yaml';
  }

  return null;
};

const jsonToYaml = (obj: any, options: ConversionOptions = {}): string => {
  try {
    return YAML.dump(obj, {
      indent: options.indent || 2,
      lineWidth: -1,
      quotingType: '"'
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

    const rootNode = xmlDoc.documentElement;
    const result: any = {};
    result[rootNode.nodeName] = xmlNodeToObject(rootNode);
    return result;
  } catch (e) {
    throw new Error(`XML parsing failed: ${(e as Error).message}`);
  }
};

const xmlNodeToObject = (node: Element): any => {
    const obj: any = {};
    const hasAttributes = node.hasAttributes();
    const hasChildren = node.children.length > 0;

    // Process attributes
    if (hasAttributes) {
        for (let i = 0; i < node.attributes.length; i++) {
            const attr = node.attributes[i];
            obj[`@${attr.name}`] = attr.value;
        }
    }

    // Process text content
    if (!hasChildren) {
        const text = node.textContent?.trim();
        if (text) {
             if (hasAttributes) {
                 obj['#text'] = text;
             } else {
                 return text;
             }
        } else if (!hasAttributes) {
             return null;
        }
    } else {
        // Process children
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
    return obj.map((item) =>
      jsonToXml(item, rootName, indent)
    ).join('\n');
  }

  let attributes = '';
  let childrenStr = '';
  let hasText = false;
  let textValue = '';

  const keys = Object.keys(obj);

  // Separation of attributes, text, and children
  keys.forEach(key => {
      if (key.startsWith('@')) {
          attributes += ` ${key.substring(1)}="${escapeXml(String(obj[key]))}"`;
      } else if (key === '#text') {
          hasText = true;
          textValue = escapeXml(String(obj[key]));
      } else {
          childrenStr += '\n' + jsonToXml(obj[key], key, indent + 1);
      }
  });

  if (childrenStr) {
       childrenStr += '\n' + indentStr;
  }

  if (hasText && !childrenStr) {
      return `${indentStr}<${rootName}${attributes}>${textValue}</${rootName}>`;
  }

  if (!childrenStr && !hasText) {
      return `${indentStr}<${rootName}${attributes} />`;
  }

  return `${indentStr}<${rootName}${attributes}>${childrenStr}</${rootName}>`;
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
    let intermediate: any;

    if (sourceFormat === 'json') {
      intermediate = JSON.parse(input);
    } else if (sourceFormat === 'yaml') {
      intermediate = yamlToJson(input);
    } else if (sourceFormat === 'xml') {
      intermediate = xmlToJson(input);
    } else {
         throw new Error('Unsupported source format');
    }

    if (targetFormat === 'json') {
      return JSON.stringify(intermediate, null, options.indent || 2);
    } else if (targetFormat === 'yaml') {
      return jsonToYaml(intermediate, options);
    } else if (targetFormat === 'xml') {
       // Check if the object has a single root key, if so use it, otherwise wrap in root
       const keys = Object.keys(intermediate);
       if (keys.length === 1 && typeof intermediate[keys[0]] === 'object' && !Array.isArray(intermediate[keys[0]])) {
           return `<?xml version="1.0" encoding="UTF-8"?>\n${jsonToXml(intermediate[keys[0]], keys[0], 0)}`;
       }
       return `<?xml version="1.0" encoding="UTF-8"?>\n${jsonToXml(intermediate, 'root', 0)}`;
    } else {
      throw new Error('Invalid target format');
    }

  } catch (e) {
    throw new Error((e as Error).message);
  }
};

export { detectFormat, convert, jsonToYaml, yamlToJson, xmlToJson, jsonToXml };
