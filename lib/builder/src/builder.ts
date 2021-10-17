import type { BuilderContext, BuilderOutput } from '@angular-devkit/architect';
import type { Schema } from './schema';
import * as eslint from './eslint/eslint-linter';
import * as stylelint from './stylelint/stylelint-linter';
import { createESlintInstance } from './eslint/eslint-linter';
import { report } from './eslint/reporter';

export async function builder(options: Schema, context: BuilderContext): Promise<BuilderOutput> {
  const projectName = context?.target?.project || '<???>';
  const printInfo = options.format && !options.silent;

  if (printInfo) {
    context.logger.info(`\nLinting ${JSON.stringify(projectName)}...`);
  }

  const eslintInstance = await createESlintInstance(context.workspaceRoot, options);

  if (printInfo) {
    context.logger.debug('Running eslint...');
  }
  const eslintResults = await eslint.lint(eslintInstance, context.workspaceRoot, options);

  if (printInfo) {
    context.logger.debug('Running stylelint...');
  }
  const stylelintResults = await stylelint.lint(context, options);

  const lintResults = eslintResults.concat(stylelintResults);

  if (lintResults.length === 0) {
    throw new Error('Invalid lint configuration. Nothing to lint.');
  }

  // output results and return success status
  const success = await report(context, eslintInstance, lintResults, options, context.workspaceRoot);

  return {
    success: options.force || success,
  };
}
