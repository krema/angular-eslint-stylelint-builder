import type { Schema } from '../schema';
import type { ESLint } from 'eslint';
import { join, resolve } from 'path';
import { checkESlintVersion, loadESLint } from './eslint-utils';

export async function lint(
  linterInstance: ESLint,
  workspaceRoot: string,
  options: Schema
): Promise<ESLint.LintResult[]> {
  const lintResults = await linterInstance.lintFiles(
    // lintFilePatterns are defined relative to the root of the Angular-CLI workspace
    options.eslintFilePatterns.map(p => join(workspaceRoot, p))
  );

  return lintResults.map(result => ({
    ...result,
    messages: result.messages.map(message => ({
      ...message,
      ruleId: `eslint\t${message.ruleId}`,
    })),
  }));
}

export async function createESlintInstance(workspaceRoot: string, options: Schema): Promise<ESLint> {
  checkESlintVersion();

  /**
   * We want users to have the option of not specifying the config path, and let
   * eslint automatically resolve the `.eslintrc` files in each folder.
   */
  const configPath = options.eslintConfig ? resolve(workspaceRoot, options.eslintConfig) : undefined;

  const eslintOptions: ESLint.Options = {
    useEslintrc: !options.noEslintrc,
    overrideConfigFile: configPath,
    ignorePath: options.eslintIgnorePath || undefined,
    fix: !!options.fix,
    cache: !!options.eslintCache,
    cacheLocation: options.eslintCacheLocation || undefined,
    cacheStrategy: options.eslintCacheStrategy || undefined,
    resolvePluginsRelativeTo: options.eslintResolvePluginsRelativeTo || undefined,
    rulePaths: options.eslintRulesDir || [],
    /**
     * Default is `true` and if not overridden the eslint.lintFiles() method will throw an error
     * when no target files are found.
     *
     * We don't want ESLint to throw an error if a user has only just created
     * a project and therefore doesn't necessarily have matching files, for example.
     */
    errorOnUnmatchedPattern: false,
  };

  const projectESLint = await loadESLint();
  return new projectESLint.ESLint(eslintOptions);
}
