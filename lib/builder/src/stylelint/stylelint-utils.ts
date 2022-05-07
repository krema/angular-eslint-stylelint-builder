import type { ESLint } from 'eslint';
import type { LinterResult, PublicApi } from 'stylelint';
import { normalize as normalizePath } from 'path';

export async function loadStylelint(): Promise<PublicApi> {
  let stylelint: PromiseLike<PublicApi>;

  try {
    // @ts-ignore
    stylelint = await import('stylelint');
    return stylelint;
  } catch {
    throw new Error('Unable to find stylelint. Ensure stylelint is installed.');
  }
}

// todo: this should not be mixed with eslint, introduce a LintResult inside your lib
export function convertToLintResult(stylelintResults: LinterResult): ESLint.LintResult[] {
  return stylelintResults.results.map(
    result =>
      ({
        errorCount: result.warnings.length,
        filePath: normalizePath(result.source as string),
        fixableErrorCount: 0,
        fixableWarningCount: 0,
        usedDeprecatedRules: [],
        warningCount: 0,
        messages: result.warnings.map(warning => ({
          column: warning.column,
          line: warning.line,
          message: warning.text,
          ruleId: `stylelint\t${warning.rule}`,
          severity: warning.severity === 'error' ? 2 : 1,
        })),
      } as ESLint.LintResult)
  );
}
