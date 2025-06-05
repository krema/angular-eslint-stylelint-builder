import { toArray, map } from 'rxjs/operators';
import { lastValueFrom } from 'rxjs';

import { Architect } from '@angular-devkit/architect';
import { TestingArchitectHost } from '@angular-devkit/architect/testing';
import { logging, schema } from '@angular-devkit/core';
import * as path from 'path';
import * as fs from 'fs/promises';

describe('Lint', () => {
  let architect: Architect;
  let architectHost: TestingArchitectHost;
  let logger: logging.Logger;

  beforeEach(async () => {
    await fs.copyFile('test/src/autofixable.ts.bak', 'test/src/autofixable.ts');
    await fs.copyFile('test/src/file.ts.bak', 'test/src/file.ts');
    await fs.copyFile('test/src/file.css.bak', 'test/src/file.css');
    console.log(path.join(process.cwd(), './out'));
    const registry = new schema.CoreSchemaRegistry();
    registry.addPostTransform(schema.transforms.addUndefinedDefaults);

    // TestingArchitectHost() takes workspace and current directories.
    // Since we don't use those, both are the same in this case.
    architectHost = new TestingArchitectHost('./test', './test');
    architect = new Architect(architectHost, registry);
    logger = new logging.Logger('test');

    // This will either take a Node package name, or a path to the directory
    // for the package.json file.
    await architectHost.addBuilderFromPackage(path.join(process.cwd(), './out'));
    // @ts-ignore
    console.info('#', Array.from(architectHost._builderMap.keys()));
  });

  afterEach(async () => {
    // Remove test files but keep the .bak files
    await Promise.all([
      fs.rm('test/src/autofixable.ts', { force: true }),
      fs.rm('test/src/file.ts', { force: true }),
      fs.rm('test/src/file.css', { force: true }),
      fs.rm('test/lint-report.txt', { force: true }),
    ]);
  });

  // Normalize file paths in logger output for CI compatibility
  function normalizePaths(str: string): string {
    return str
      .replace(
        /\/home\/runner\/work\/angular-eslint-stylelint-builder\/angular-eslint-stylelint-builder\//g,
        '/<ROOT>/'
      )
      .replace(/\/workspaces\/angular-eslint-stylelint-builder\//g, '/<ROOT>/');
  }

  it('has created the correct linting results', async () => {
    // A "run" can have multiple outputs, and contains progress information.
    const run = await architect.scheduleBuilder(
      '@krema/angular-eslint-stylelint-builder:lint',
      {
        eslintFilePatterns: ['src/**/*.ts'],
        eslintConfig: 'eslint.config.js',
        stylelintFilePatterns: ['src/**/*.css'],
        stylelintConfig: 'stylelint.config.js',
      },
      { logger: logger }
    );
    const loggerPromise = lastValueFrom(
      logger.pipe(
        toArray(),
        map(messages =>
          messages.map(y => {
            console.log('>>', y.message);
            return { level: y.level, message: y.message };
          })
        )
      )
    );

    // The "result" member (of type BuilderOutput) is the next output.
    await run.result;

    // Stop the builder from running. This stops Architect from keeping
    // the builder-associated states in memory, since builders keep waiting
    // to be scheduled.
    await run.stop();
    logger.complete();

    const normalizedLoggerPromise = loggerPromise.then(messages =>
      messages.map(({ level, message }) => ({
        level,
        message: typeof message === 'string' ? normalizePaths(message) : message,
      }))
    );

    console.log('ACTUAL LOGGER OUTPUT:', JSON.stringify(await normalizedLoggerPromise, null, 2));
    expect(normalizedLoggerPromise).resolves.toEqual([
      {
        level: 'info',
        message: '\nLinting "<???>"...',
      },
      {
        level: 'debug',
        message: 'Running eslint...',
      },
      {
        level: 'debug',
        message: 'Running stylelint...',
      },
      {
        level: 'info',
        message:
          '\n/<ROOT>/test/src/autofixable.ts\n' +
          "  8:10  error  Unnecessary 'else' after 'return'  eslint\tno-else-return\n" +
          '\n/<ROOT>/test/src/file.css\n' +
          '   1:1   error  Unknown rule number-leading-zero                                              stylelint\tnumber-leading-zero\n' +
          '   1:1   error  Unknown rule string-quotes                                                    stylelint\tstring-quotes\n' +
          '   1:1   error  Unknown rule no-extra-semicolons                                              stylelint\tno-extra-semicolons\n' +
          '  15:5   error  Unexpected empty block (block-no-empty)                                       stylelint\tblock-no-empty\n' +
          '   5:10  error  Unexpected invalid hex color "#ZZZZZZ" (color-no-invalid-hex)                 stylelint\tcolor-no-invalid-hex\n' +
          '  20:10  error  Unexpected invalid hex color "#12345G" (color-no-invalid-hex)                 stylelint\tcolor-no-invalid-hex\n' +
          '   9:3   error  Unexpected duplicate "font-size" (declaration-block-no-duplicate-properties)  stylelint\tdeclaration-block-no-duplicate-properties\n' +
          '   6:23  error  Unexpected duplicate font-family name Arial (font-family-no-duplicate-names)  stylelint\tfont-family-no-duplicate-names\n' +
          '   2:13  error  Unexpected unit (length-zero-no-unit)                                         stylelint\tlength-zero-no-unit\n' +
          '   3:13  error  Unexpected unit (length-zero-no-unit)                                         stylelint\tlength-zero-no-unit\n' +
          '   8:3   error  Unexpected unknown property "font-weigth" (property-no-unknown)               stylelint\tproperty-no-unknown\n' +
          '  19:1   error  Unexpected unknown type selector "foo" (selector-type-no-unknown)             stylelint\tselector-type-no-unknown\n' +
          '  12:13  error  Unexpected unknown unit "pixels" (unit-no-unknown)                            stylelint\tunit-no-unknown\n' +
          '\n/<ROOT>/test/src/file.ts\n' +
          "  3:3  error  Unexpected 'debugger' statement  eslint\tno-debugger\n" +
          '\n✖ 15 problems (15 errors, 0 warnings)\n  1 error and 0 warnings potentially fixable with the `--fix` option.\n',
      },
      {
        level: 'error',
        message: 'Lint errors found in the listed files.\n',
      },
    ]);
  });

  it('autofix lint issues when using fix option', async () => {
    // A "run" can have multiple outputs, and contains progress information.
    const run = await architect.scheduleBuilder(
      '@krema/angular-eslint-stylelint-builder:lint',
      {
        eslintFilePatterns: ['src/**/*.ts'],
        eslintConfig: 'eslint.config.js',
        fix: true,
        stylelintFilePatterns: ['src/**/*.css'],
        stylelintConfig: 'stylelint.config.js',
      },
      { logger }
    );
    const loggerPromise = lastValueFrom(
      logger.pipe(
        toArray(),
        map(messages =>
          messages.map(y => {
            console.log('>>', y.message);
            return { level: y.level, message: y.message };
          })
        )
      )
    );

    await run.result;
    await run.stop();
    logger.complete();

    const normalizedLoggerPromise = loggerPromise.then(messages =>
      messages.map(({ level, message }) => ({
        level,
        message: typeof message === 'string' ? normalizePaths(message) : message,
      }))
    );

    expect(normalizedLoggerPromise).resolves.toEqual([
      {
        level: 'info',
        message: '\nLinting "<???>"...',
      },
      {
        level: 'debug',
        message: 'Running eslint...',
      },
      {
        level: 'debug',
        message: 'Running stylelint...',
      },
      {
        level: 'info',
        message:
          '\n/<ROOT>/test/src/file.css\n' +
          '   1:1   error  Unknown rule number-leading-zero                                              stylelint\tnumber-leading-zero\n' +
          '   1:1   error  Unknown rule string-quotes                                                    stylelint\tstring-quotes\n' +
          '   1:1   error  Unknown rule no-extra-semicolons                                              stylelint\tno-extra-semicolons\n' +
          '  15:5   error  Unexpected empty block (block-no-empty)                                       stylelint\tblock-no-empty\n' +
          '   5:10  error  Unexpected invalid hex color "#ZZZZZZ" (color-no-invalid-hex)                 stylelint\tcolor-no-invalid-hex\n' +
          '  20:10  error  Unexpected invalid hex color "#12345G" (color-no-invalid-hex)                 stylelint\tcolor-no-invalid-hex\n' +
          '   6:23  error  Unexpected duplicate font-family name Arial (font-family-no-duplicate-names)  stylelint\tfont-family-no-duplicate-names\n' +
          '   8:3   error  Unexpected unknown property "font-weigth" (property-no-unknown)               stylelint\tproperty-no-unknown\n' +
          '  19:1   error  Unexpected unknown type selector "foo" (selector-type-no-unknown)             stylelint\tselector-type-no-unknown\n' +
          '  12:13  error  Unexpected unknown unit "pixels" (unit-no-unknown)                            stylelint\tunit-no-unknown\n' +
          '\n/<ROOT>/test/src/file.ts\n' +
          "  3:3  error  Unexpected 'debugger' statement  eslint\tno-debugger\n" +
          '\n✖ 11 problems (11 errors, 0 warnings)\n',
      },
      {
        level: 'error',
        message: 'Lint errors found in the listed files.\n',
      },
    ]);
  });

  it('ignores files matching eslintIgnorePatterns and stylelintIgnorePatterns', async () => {
    const run = await architect.scheduleBuilder(
      '@krema/angular-eslint-stylelint-builder:lint',
      {
        eslintFilePatterns: ['src/**/*.ts'],
        stylelintFilePatterns: ['src/**/*.css'],
        eslintIgnorePatterns: ['**/file.ts'],
        stylelintIgnorePatterns: ['**/file.css'],
        stylelintConfig: 'stylelint.config.js',
      },
      { logger }
    );
    const loggerPromise = lastValueFrom(
      logger.pipe(
        toArray(),
        map(messages =>
          messages.map(y => {
            return { level: y.level, message: y.message };
          })
        )
      )
    );

    await run.result;
    await run.stop();
    logger.complete();

    // The output should not mention file.ts or file.css
    const output = JSON.stringify(await loggerPromise);
    expect(output).not.toContain('file.ts');
    expect(output).not.toContain('file.css');
  });

  it('writes JSON output to file with fix enabled', async () => {
    const outputFile = 'lint-report.txt';

    const run = await architect.scheduleBuilder(
      '@krema/angular-eslint-stylelint-builder:lint',
      {
        eslintFilePatterns: ['src/**/*.ts'],
        stylelintFilePatterns: ['src/**/*.css'],
        fix: true,
        outputFile,
        format: 'json',
        eslintConfig: 'eslint.config.js',
        stylelintConfig: 'stylelint.config.js',
      },
      { logger }
    );
    await run.result;
    await run.stop();
    logger.complete();

    // Check that the output file exists and contains valid JSON
    let exists = false;
    try {
      await fs.access(path.join('test', outputFile));
      exists = true;
    } catch {
      exists = false;
    }
    expect(exists).toBe(true);
    if (exists) {
      const content = await fs.readFile(path.join('test', outputFile), 'utf8');
      expect(() => JSON.parse(content)).not.toThrow();
    }
  });
});
