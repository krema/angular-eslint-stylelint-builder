import { toArray, map } from 'rxjs/operators';

import { Architect } from '@angular-devkit/architect';
import { TestingArchitectHost } from '@angular-devkit/architect/testing';
import { logging, schema } from '@angular-devkit/core';
import { exec } from 'child_process';

describe('Lint', () => {
  let architect: Architect;
  let architectHost: TestingArchitectHost;
  let logger: logging.Logger;

  beforeEach(async () => {
    const registry = new schema.CoreSchemaRegistry();
    registry.addPostTransform(schema.transforms.addUndefinedDefaults);

    // TestingArchitectHost() takes workspace and current directories.
    // Since we don't use those, both are the same in this case.
    architectHost = new TestingArchitectHost('./test', './test');
    architect = new Architect(architectHost, registry);
    logger = new logging.Logger('test');

    // This will either take a Node package name, or a path to the directory
    // for the package.json file.
    await architectHost.addBuilderFromPackage('../../../../out');
    // @ts-ignore
    console.info('#', Array.from(architectHost._builderMap.keys()));
  });

  afterEach(async () => {
    exec('git restore test/src/');
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
        // @ts-ignore
        message: expect.toIncludeMultiple([
          //autofixable
          'autofixable.ts\n' + "  8:10  error  Unnecessary 'else' after 'return'  eslint\tno-else-return\n",
          //file.css
          'file.css\n' +
            '  3:3  error  Expected indentation of 4 spaces (indentation)  stylelint\tindentation\n' +
            '  4:3  error  Expected indentation of 4 spaces (indentation)  stylelint\tindentation\n' +
            '  5:3  error  Expected indentation of 4 spaces (indentation)  stylelint\tindentation\n',
          //file.ts
          'file.ts\n' + "  3:3  error  Unexpected 'debugger' statement  eslint\tno-debugger\n",
          // info messages
          '✖ 5 problems (5 errors, 0 warnings)\n' +
            '  1 error and 0 warnings potentially fixable with the `--fix` option.\n',
        ]),
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

    // The "result" member (of type BuilderOutput) is the next output.
    await run.result;

    // Stop the builder from running. This stops Architect from keeping
    // the builder-associated states in memory, since builders keep waiting
    // to be scheduled.
    await run.stop();
    logger.complete();

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
        // @ts-ignore
        message: expect.toIncludeMultiple([
          //file.ts
          'file.ts\n' + "  3:3  error  Unexpected 'debugger' statement  eslint\tno-debugger\n",
          // info messages
          '✖ 1 problem (1 error, 0 warnings)\n',
        ]),
      },
      {
        level: 'error',
        message: 'Lint errors found in the listed files.\n',
      },
    ]);
  });
});
