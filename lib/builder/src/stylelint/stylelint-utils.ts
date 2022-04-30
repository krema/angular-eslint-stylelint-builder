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
    x =>
      ({
        errorCount: x.warnings.length,
        filePath: x.source,
        fixableErrorCount: 0,
        fixableWarningCount: 0,
        usedDeprecatedRules: [],
        warningCount: 0,
        messages: x.warnings.map(y => ({
          column: y.column,
          line: y.line,
          message: y.text,
          ruleId: `stylelint\t${y.rule}`,
          severity: y.severity === 'error' ? 2 : 1,
        })),
      } as ESLint.LintResult)
  );
}
