import type { BuilderContext } from '@angular-devkit/architect';
import type { ESLint } from 'eslint';
import { type LinterOptions } from 'stylelint';
import stylelint from 'stylelint';

import type { Schema } from '../schema';
import { join, resolve, normalize } from 'path';

import { convertToLintResult } from './stylelint-utils';

export async function lint(context: BuilderContext, options: Schema): Promise<ESLint.LintResult[]> {
  const workspaceRoot = context.workspaceRoot;

  /**
   * We want users to have the option of not specifying the config path, and let
   * stylelint automatically resolve the `.stylelintrc` files in each folder.
   */
  const configPath = options.stylelintConfig ? resolve(workspaceRoot, options.stylelintConfig) : undefined;

  const stylelintOptions: LinterOptions = {
    cache: !!options.stylelintCache,
    cacheLocation: options.stylelintCacheLocation ?? undefined,
    fix: !!options.fix,
    ignorePattern: options.stylelintIgnorePatterns ?? [],
    maxWarnings: options.maxWarnings,
    configFile: configPath,
    files: options.stylelintFilePatterns?.map(p => normalize(join(workspaceRoot, p)).replace(/\\/g, '/')) || [],
  };

  if (!stylelintOptions?.files?.length) {
    return [];
  }

  const stylelintResults = await stylelint.lint(stylelintOptions);

  const lintResults = convertToLintResult(stylelintResults);
  return lintResults;
}
