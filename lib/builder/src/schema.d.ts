import type { JsonObject } from '@angular-devkit/core';

export type BuilderOptions = Schema & JsonObject;

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
  eslintIgnorePatterns?: string[];
  stylelintIgnorePatterns?: string[];
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
