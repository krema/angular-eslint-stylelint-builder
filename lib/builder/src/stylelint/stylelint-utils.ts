import type { ESLint } from 'eslint';
import type { LinterResult, PublicApi } from 'stylelint';

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

export function convertToLintResult(stylelintResults: LinterResult): ESLint.LintResult[] {
  return stylelintResults.results.map(
    result =>
      ({
        errorCount: result.warnings.length,
        filePath: result.source,
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
