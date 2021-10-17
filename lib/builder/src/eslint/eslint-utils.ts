import type * as ESLintLibrary from 'eslint';
import type { Schema } from '../schema';

export async function loadESLint(): Promise<typeof ESLintLibrary> {
  let eslint;
  try {
    eslint = await import('eslint');
    return eslint;
  } catch {
    throw new Error('Unable to find ESLint. Ensure ESLint is installed.');
  }
}

export async function checkESlintVersion(): Promise<void> {
  const projectESLint = await loadESLint();
  const version = projectESLint.ESLint?.version?.split('.');
  if (
    !version ||
    version.length < 2 ||
    Number(version[0]) < 7 ||
    (Number(version[0]) === 7 && Number(version[1]) < 6)
  ) {
    throw new Error('ESLint must be version 7.6 or higher.');
  }
}

export async function outputFixes(lintResults: ESLintLibrary.ESLint.LintResult[]): Promise<void> {
  const projectESLint = await loadESLint();
  await projectESLint.ESLint.outputFixes(lintResults);
}

export interface LintOutputResults {
  hasWarningsToPrint: boolean;
  hasErrorsToPrint: boolean;
  totalErrors: number;
  totalWarnings: number;
  lintResults: ESLintLibrary.ESLint.LintResult[];
}

export function filterLintResults(lintResults: ESLintLibrary.ESLint.LintResult[], options: Schema): LintOutputResults {
  const reportOnlyErrors = options.quiet;
  let totalErrors = 0;
  let totalWarnings = 0;

  const finalLintResults: ESLintLibrary.ESLint.LintResult[] = lintResults
    .map((result): ESLintLibrary.ESLint.LintResult | null => {
      totalErrors += result.errorCount;
      totalWarnings += result.warningCount;

      if (result.errorCount || (result.warningCount && !reportOnlyErrors)) {
        if (reportOnlyErrors) {
          // Collect only errors (Linter.Severity === 2)
          result.messages = result.messages.filter(({ severity }) => severity === 2);
        }

        return result;
      }

      return null;
    })
    // Filter out the null values
    .filter(Boolean) as ESLintLibrary.ESLint.LintResult[];

  return {
    hasWarningsToPrint: totalWarnings > 0 && !reportOnlyErrors,
    hasErrorsToPrint: totalErrors > 0,
    totalErrors,
    totalWarnings,
    lintResults: finalLintResults,
  };
}
