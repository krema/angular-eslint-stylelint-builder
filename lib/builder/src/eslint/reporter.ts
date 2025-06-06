import type { BuilderContext } from '@angular-devkit/architect';

import type * as ESLintLibrary from 'eslint';
import type { Schema } from '../schema';
import { writeFileSync } from 'fs';
import { dirname, join } from 'path';

import { createDirectory } from '../utils/create-directory';
import { filterLintResults, outputFixes } from './eslint-utils';

export async function report(
  context: BuilderContext,
  eslintInstance: ESLintLibrary.ESLint,
  lintResults: ESLintLibrary.ESLint.LintResult[],
  options: Schema,
  workspaceRoot: string
): Promise<boolean> {
  /**
   * Depending on user configuration we may not want to report on all the
   * results, so we need to adjust them before formatting.
   */
  const finalLintResults = filterLintResults(lintResults, options);

  /**
   * It's important that we format all results together so that custom
   * formatters, such as checkstyle, can provide a valid output for the
   * whole project being linted.
   *
   * Additionally, apart from when outputting to a file, we want to always
   * log (even when no results) because different formatters handled the
   * "no results" case differently.
   */
  const formatter = await eslintInstance.loadFormatter(options.format);
  const formattedResults = await formatter.format(finalLintResults.lintResults);
  const printInfo = options.format && !options.silent;
  const maxWarnings = options.maxWarnings;
  const reportOnlyErrors = options.quiet;

  // output fixes to disk, if applicable based on the options
  await outputFixes(finalLintResults.lintResults);

  if (options.outputFile) {
    const pathToOutputFile = join(workspaceRoot, options.outputFile);
    createDirectory(dirname(pathToOutputFile));
    try {
      writeFileSync(pathToOutputFile, formattedResults || '');
    } catch (err) {
      context.logger.error(`[DEBUG] Failed to write output file: ${err}`);
    }
  } else {
    context.logger.info(formattedResults);
  }

  if (finalLintResults.hasWarningsToPrint && printInfo) {
    context.logger.warn('Lint warnings found in the listed files.\n');
  }

  if (finalLintResults.hasErrorsToPrint && printInfo) {
    context.logger.error('Lint errors found in the listed files.\n');
  }

  if ((finalLintResults.totalWarnings === 0 || reportOnlyErrors) && finalLintResults.totalErrors === 0 && printInfo) {
    context.logger.info('All files pass linting.\n');
  }

  const tooManyWarnings = maxWarnings >= 0 && finalLintResults.totalWarnings > maxWarnings;
  if (tooManyWarnings && printInfo) {
    context.logger.error(
      `Found ${finalLintResults.totalWarnings} warnings, which exceeds your configured limit (${options.maxWarnings}). Either increase your maxWarnings limit or fix some of the lint warnings.`
    );
  }

  return finalLintResults.totalErrors === 0 && !tooManyWarnings;
}
