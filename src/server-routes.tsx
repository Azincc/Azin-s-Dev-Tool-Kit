import type { RouteComponentMap } from './routes';
import Home from './pages/Home';
import { JsonTools } from './components/tools/JsonTools';
import { JsonEscapeTools } from './components/tools/JsonEscapeTools';
import { CsvTools } from './components/tools/CsvTools';
import { CodeTools } from './components/tools/CodeTools';
import { EncoderTools } from './components/tools/EncoderTools';
import { HashTools } from './components/tools/HashTools';
import { EncryptTools } from './components/tools/EncryptTools';
import { JwtTools } from './components/tools/JwtTools';
import { PasswordTools } from './components/tools/PasswordTools';
import { ColorPaletteTools } from './components/tools/ColorPaletteTools';
import { ImageTools } from './components/tools/ImageTools';
import { CssGenTools } from './components/tools/CssGenTools';
import { EditorTools } from './components/tools/EditorTools';
import { RegexTools } from './components/tools/RegexTools';
import { DiffTools } from './components/tools/DiffTools';
import { CrontabTools } from './components/tools/CrontabTools';
import { WorldClockTools } from './components/tools/WorldClockTools';
import { SubnetCalculator } from './components/tools/SubnetCalculator';
import { UAParserTool } from './components/tools/UAParserTool';
import { CurlGenerator } from './components/tools/CurlGenerator';
import { LatencyTools } from './components/tools/LatencyTools';
import { TimestampTools } from './components/tools/TimestampTools';

export const serverRoutesMap: RouteComponentMap = {
  '/': Home,
  '/json': JsonTools,
  '/json-escape': JsonEscapeTools,
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
  '/subnet': SubnetCalculator,
  '/ua': UAParserTool,
  '/curl': CurlGenerator,
  '/latency': LatencyTools,
  '/timestamp': TimestampTools,
};
