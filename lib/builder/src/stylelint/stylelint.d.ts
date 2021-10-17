	import type { Warning } from 'postcss';

	export type StylelintStandaloneOptions = {
		files?: string | string[];
		globbyOptions?: Record<string, unknown>;
		cache?: boolean;
		cacheLocation?: string;
		code?: string;
		codeFilename?: string;
		config?: StylelintConfig;
		configFile?: string;
		configBasedir?: string;
		configOverrides?: StylelintConfig;
		printConfig?: string;
		ignoreDisables?: boolean;
		ignorePath?: string;
		ignorePattern?: string[];
		reportDescriptionlessDisables?: boolean;
		reportNeedlessDisables?: boolean;
		reportInvalidScopeDisables?: boolean;
		maxWarnings?: number;
		syntax?: string;
		customSyntax?: CustomSyntax;
		formatter?: FormatterIdentifier;
		disableDefaultIgnores?: boolean;
		fix?: boolean;
		allowEmptyInput?: boolean;
	};

	 type StylelintWarning = {
		line: number;
		column: number;
		rule: string;
		severity: Severity;
		text: string;
		stylelintType?: string;
	};

	type StylelintResult = {
		source?: string;
		deprecations: {
			text: string;
			reference: string;
		}[];
		invalidOptionWarnings: {
			text: string;
		}[];
		parseErrors: (Warning & { stylelintType: string })[];
		errored?: boolean;
		warnings: StylelintWarning[];
		ignored?: boolean;
		_postcssResult?: PostcssResult;
	};

	export type StylelintStandaloneReturnValue = {
		results: StylelintResult[];
		errored: boolean;
		output: unknown;
		maxWarningsExceeded?: {
			maxWarnings: number;
			foundWarnings: number;
		};
		reportedDisables: StylelintDisableOptionsReport;
		descriptionlessDisables?: StylelintDisableOptionsReport;
		needlessDisables?: StylelintDisableOptionsReport;
		invalidScopeDisables?: StylelintDisableOptionsReport;
	};

	export type StylelintPublicAPI = {
		lint: (options: StylelintStandaloneOptions) => StylelintStandaloneReturnValue;
	};