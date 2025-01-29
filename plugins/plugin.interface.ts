// plugin.interface.ts
export interface Plugin {
    name: string;
    initializeBackend(app: INestApplication): void;
    initializeFrontend(nextConfig: NextConfig): void;
  }

  // plugin-loader.ts
import { Plugin } from './plugin.interface';
import * as fs from 'fs';
import * as path from 'path';

export function loadPlugins(): Plugin[] {
  const pluginsPath = path.join(__dirname, 'plugins');
  const pluginFiles = fs.readdirSync(pluginsPath).filter(file => file.endsWith('.js'));

  return pluginFiles.map(file => {
    const pluginModule = require(path.join(pluginsPath, file));
    return pluginModule.default as Plugin;
  });
}

// next.config.js
const { loadPlugins } = require('./plugin-loader');

module.exports = async () => {
  const nextConfig = {
    // Existing Next.js configurations
  };

  const plugins = loadPlugins();
  plugins.forEach(plugin => {
    plugin.initializeFrontend(nextConfig);
  });

  return nextConfig;
};
