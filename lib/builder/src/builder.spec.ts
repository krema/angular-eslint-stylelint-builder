import { toArray, map } from 'rxjs/operators';

import { Architect } from '@angular-devkit/architect';
import { TestingArchitectHost } from '@angular-devkit/architect/testing';
import { logging, schema } from '@angular-devkit/core';
import * as path from 'path';

describe('Lint', () => {
  let architect: Architect;
  let architectHost: TestingArchitectHost;
  let logger: logging.Logger;

  beforeEach(async () => {
    const fs = await import('fs/promises');
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
    const fs = await import('fs/promises');
    // Remove test files but keep the .bak files
    await Promise.all([
      fs.rm('test/src/autofixable.ts', { force: true }),
      fs.rm('test/src/file.ts', { force: true }),
      fs.rm('test/src/file.css', { force: true }),
    ]);
  });

  it('has created the correct linting results', async () => {
    // A "run" can have multiple outputs, and contains progress information.
    const run = await architect.scheduleBuilder(
      '@krema/angular-eslint-stylelint-builder:lint',
      {
        eslintFilePatterns: ['src/**/*.ts'],
        stylelintFilePatterns: ['src/**/*.css'],
      },
      { logger: logger }
    );
    const loggerPromise = logger
      .pipe(
        toArray(),
        map(messages =>
          messages.map(y => {
            console.log('>>', y.message);
            return { level: y.level, message: y.message };
          })
        )
      )
      .toPromise();

    // The "result" member (of type BuilderOutput) is the next output.
    await run.result;

    // Stop the builder from running. This stops Architect from keeping
    // the builder-associated states in memory, since builders keep waiting
    // to be scheduled.
    await run.stop();
    logger.complete();

    console.log('ACTUAL LOGGER OUTPUT:', JSON.stringify(await loggerPromise, null, 2));
    expect(loggerPromise).resolves.toEqual([
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
          '\n' +
          '/workspaces/angular-eslint-stylelint-builder/test/src/autofixable.ts\n' +
          "  8:10  error  Unnecessary 'else' after 'return'  eslint\tno-else-return\n" +
          '\n' +
          '/workspaces/angular-eslint-stylelint-builder/test/src/file.css\n' +
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
          '\n' +
          '/workspaces/angular-eslint-stylelint-builder/test/src/file.ts\n' +
          "  3:3  error  Unexpected 'debugger' statement  eslint\tno-debugger\n" +
          '\n' +
          '✖ 15 problems (15 errors, 0 warnings)\n  1 error and 0 warnings potentially fixable with the `--fix` option.\n',
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
        stylelintFilePatterns: ['src/**/*.css'],
        fix: true,
      },
      { logger }
    );
    const loggerPromise = logger
      .pipe(
        toArray(),
        map(messages =>
          messages.map(y => {
            console.log('>>', y.message);
            return { level: y.level, message: y.message };
          })
        )
      )
      .toPromise();

    await run.result;
    await run.stop();
    logger.complete();

    // After autofix, expect all stylelint errors to remain (since most are not autofixable)
    expect(loggerPromise).resolves.toEqual([
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
          '\n' +
          '/workspaces/angular-eslint-stylelint-builder/test/src/file.css\n' +
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
          '\n' +
          '/workspaces/angular-eslint-stylelint-builder/test/src/file.ts\n' +
          "  3:3  error  Unexpected 'debugger' statement  eslint\tno-debugger\n" +
          '\n' +
          '✖ 11 problems (11 errors, 0 warnings)\n',
      },
      {
        level: 'error',
        message: 'Lint errors found in the listed files.\n',
      },
    ]);
  });
});
