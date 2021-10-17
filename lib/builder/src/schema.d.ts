import type { JsonObject } from '@angular-devkit/core';

export type BuilderOptions = typeof Schema & JsonObject

export interface Schema {
  eslintFilePatterns: string[];
  stylelintFilePatterns: string[];
  eslintConfig: string | null;
  stylelintConfig: string | null;
  noEslintrc: boolean;
  fix: boolean;
  eslintCache: boolean;
  stylelintCache: boolean;
  eslintCacheLocation: string | null;
  stylelintCacheLocation: string | null;
  eslintCacheStrategy: 'content' | 'metadata' | null;
  eslintIgnorePath: string | null;
  stylelintIgnorePath: string | null;
  eslintRulesDir: string[];
  eslintResolvePluginsRelativeTo: string | null;
  outputFile: string | null;
  format: Formatter;
  silent: boolean;
  quiet: boolean;
  maxWarnings: number;
  force: boolean;
}

type Formatter =
  | 'stylish'
  | 'compact'
  | 'codeframe'
  | 'unix'
  | 'visualstudio'
  | 'checkstyle'
  | 'html'
  | 'jslint-xml'
  | 'json'
  | 'json-with-metadata'
  | 'junit'
  | 'tap';