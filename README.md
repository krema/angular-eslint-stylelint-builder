
# Angular ESLint + Stylelint Linter

![node workflow](https://github.com/krema/angular-eslint-stylelint-builder/actions/workflows/node.js.yml/badge.svg)


An Angular CLI builder inspired by [@angular-eslint/builder](https://github.com/angular-eslint/angular-eslint/tree/master/packages/builder) for linting Angular applications using [ESLint](https://eslint.org/) and [stylelint](https://stylelint.io/).

## Prerequisites

Installed and configured **eslint** and **stylelint** e.g. via `.eslintrc` and `.stylelintrc`.

For more information on converting TSLint to ESLint in Angular projects please see the following [@angular-eslint](https://github.com/angular-eslint/angular-eslint) project.

## Install

`npm install --save-dev @krema/angular-eslint-stylelint-builder`

## Usage

Add the builder *@krema/angular-eslint-stylelint-builder:lint"* to the lint task in your *angular.json*. 


**angular.json**

> projects &#8594; \<my-project> &#8594; architect &#8594; lint

Replace the builder of `@angular-eslint` with `@krema/angular-eslint-stylelint-builder`:


```diff        
 "lint": {
-    "builder": "@angular-eslint/builder:lint",
+    "builder": "@krema/angular-eslint-stylelint-builder:lint",
     "options": {
-        "lintFilePatterns": ["**/*.ts"]
+        "eslintFilePatterns": ["**/*.ts"],
+        "stylelintFilePatterns": ["**/*.scss"]
     }
 }
```

Run `ng lint`:

![](assets/BEC08221-A226-4741-BE42-7BF46004B939.png)

## Configuration

The following options can be configured:

<table>
  <tr>
    <th>Name</th>
    <th>Default Value</th>
    <th>Description</th>
    <th>Required</th>
    <th>Linter</th>
  </tr>
  <tr>
    <td colspan="5"><b>Basic configuration:</b></td>
  </tr>
  <tr>
    <td>eslintFilePatterns</td>
    <td>[]</td>
    <td>
      One or more files/dirs/globs to pass directly to ESLint&#39;s lintFiles()
      method. i.e. [&quot;src/**/*.ts&quot;]
    </td>
    <td>true</td>
    <td>eslint</td>
  </tr>
  <tr>
    <td>eslintConfig</td>
    <td></td>
    <td>
      Use this configuration, overriding .eslintrc.* config options if present
    </td>
    <td></td>
    <td>eslint</td>
  </tr>
  <tr>
    <td>stylelintFilePatterns</td>
    <td>[]</td>
    <td>
      One or more files/dirs/globs to pass directly to stylelint&#39;s lint()
      method. [&quot;src/**/*.scss&quot;]
    </td>
    <td>true</td>
    <td>stylelint</td>
  </tr>
  <tr>
    <td>stylelintConfig</td>
    <td>&nbsp;</td>
    <td>Path to the stylelint configuration file</td>
    <td></td>
    <td>stylelint</td>
  </tr>
  <tr>
    <td>noEslintrc</td>
    <td>false</td>
    <td>
      Disables use of configuration from .eslintrc.* and package.json files.
    </td>
    <td></td>
    <td>eslint</td>
  </tr>
  <tr>
    <td>fix</td>
    <td>false</td>
    <td>
      Automatically fix, where possible, violations reported by rules (may
      overwrite linted files)
    </td>
    <td></td>
    <td>eslint, stylelint</td>
  </tr>
  <tr>
    <td colspan="5"><b>Cache-related:</b></td>
  </tr>
  <tr>
    <td>eslintCache</td>
    <td>false</td>
    <td>
      Store the results of processed files so that ESLint only operates on the
      changed ones
    </td>
    <td></td>
    <td>eslint</td>
  </tr>
  <tr>
    <td>stylelintCache</td>
    <td>false</td>
    <td>
      Store the results of processed files so that stylelint only operates on
      the changed ones
    </td>
    <td></td>
    <td>stylelint</td>
  </tr>
  <tr>
    <td>eslintCacheLocation</td>
    <td>.eslintcache</td>
    <td>Path to the cache file or directory</td>
    <td></td>
    <td>eslint</td>
  </tr>
  <tr>
    <td>stylelintCacheLocation</td>
    <td>.stylelintcache</td>
    <td>Path to the cache file or directory</td>
    <td></td>
    <td>stylelint</td>
  </tr>
  <tr>
    <td>eslintCacheStrategy</td>
    <td>metadata</td>
    <td>
      Strategy to use for detecting changed files in the cache. Can be either
      metadata or content
    </td>
    <td></td>
    <td>eslint</td>
  </tr>
  <tr>
    <td colspan="5"><b>File Enumeration:</b></td>
  </tr>
  <tr>
    <td>eslintIgnorePath</td>
    <td></td>
    <td>
      A path to a file containing patterns describing files to ignore instead of
      $CWD/.eslintignore
    </td>
    <td></td>
    <td>eslint</td>
  </tr>
  <tr>
    <td>stylelintIgnorePath</td>
    <td></td>
    <td>
      A path to a file containing patterns describing files to ignore instead of
      $CWD/.stylelintignore
    </td>
    <td></td>
    <td>stylelint</td>
  </tr>
  <tr>
    <td>eslintRulesDir</td>
    <td>[]</td>
    <td>
      This option allows you to specify another directory from which to load
      rules files
    </td>
    <td></td>
    <td>eslint</td>
  </tr>
  <tr>
    <td>eslintResolvePluginsRelativeTo</td>
    <td></td>
    <td>Changes the folder where plugins are resolved from</td>
    <td></td>
    <td>eslint</td>
  </tr>
  <tr>
    <td colspan="5"><b>Output:</b></td>
  </tr>
  <tr>
    <td>outputFile</td>
    <td></td>
    <td>File to write report to instead of the console</td>
    <td></td>
    <td>eslint, stylelint</td>
  </tr>
  <tr>
    <td>format</td>
    <td>stylish</td>
    <td>
      The output is formatted by using the
      <a href="https://eslint.org/docs/user-guide/formatters/">
        ESLint Output formatter</a
      >
    </td>
    <td></td>
    <td>eslint, stylelint</td>
  </tr>
  <tr>
    <td>silent</td>
    <td>false</td>
    <td>Hide output text</td>
    <td></td>
    <td>eslint, stylelint</td>
  </tr>
  <tr>
    <td colspan="5"><b>Handling warnings:</b></td>
  </tr>
  <tr>
    <td>quiet</td>
    <td>false</td>
    <td>
      Only register violations for rules with an "error"-level severity (ignore
      "warning"-level)
    </td>
    <td></td>
    <td>eslint, stylelint</td>
  </tr>
  <tr>
    <td>maxWarnings</td>
    <td>-1</td>
    <td>Number of warnings to trigger nonzero exit code</td>
    <td></td>
    <td>eslint, stylelint</td>
  </tr>
  <tr>
    <td>force</td>
    <td>false</td>
    <td>Succeeds even if there was linting errors</td>
    <td></td>
    <td>eslint, stylelint</td>
  </tr>
</table>

## TODO

- [ ] Write tests 