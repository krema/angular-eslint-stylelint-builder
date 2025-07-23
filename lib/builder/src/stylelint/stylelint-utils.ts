import type { ESLint } from 'eslint';
import { type LinterResult } from 'stylelint';

export function convertToLintResult(stylelintResults: LinterResult): ESLint.LintResult[] {
  return stylelintResults.results.map(
    result =>
      ({
        errorCount: result.warnings.filter(w => w.severity === 'error').length,
        filePath: result.source ?? '',
        fixableErrorCount: 0,
        fixableWarningCount: 0,
        usedDeprecatedRules: [],
        warningCount: result.warnings.filter(w => w.severity !== 'error').length,
        messages: result.warnings.map(warning => ({
          column: warning.column,
          line: warning.line,
          message: warning.text,
          ruleId: `stylelint\t${warning.rule}`,
          severity: warning.severity === 'error' ? 2 : 1,
        })),
        suppressedMessages: [],
        fatalErrorCount: 0,
      }) satisfies ESLint.LintResult
  );
}
