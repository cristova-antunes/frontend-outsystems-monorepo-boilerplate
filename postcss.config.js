import postcssImportExtGlob from "postcss-import-ext-glob";
import postcssImport from "postcss-import";
import postcssMixins from "postcss-mixins";
import postcssEach from "postcss-each";
import postcssSimpleVars from "postcss-simple-vars";
import postcssPxtorem from "postcss-pxtorem";
import postcssPresetEnv from "postcss-preset-env";
import postcssCombineDuplicatedSelectors from "postcss-combine-duplicated-selectors";
import cssnano from "cssnano";
import perfectionist from "postcss-perfectionist"; // For the "middle-ground" format

export default {
	plugins: [
		postcssImportExtGlob(),
		postcssImport(),
		postcssMixins(),
		postcssEach(),
		postcssSimpleVars(),
		postcssPxtorem({
			propList: ["*"],
		}),
		postcssPresetEnv({
			stage: 1,
			features: {
				"nesting-rules": true,
				"custom-properties": true,
			},
		}),
		postcssCombineDuplicatedSelectors(),
		// Only use cssnano for logic optimizations, not whitespace
		cssnano({
			preset: [
				"default",
				{
					zindex: false,
					normalizeWhitespace: false, // Let perfectionist handle this
					discardComments: { removeAll: true },
					mergeIdent: true,
					discardUnused: true,
					mergeRules: true, // Consolidates your authored code
					reduceIdents: false,
				},
			],
		}),

		// "Middle-ground" formatting to prevent Outsystems issues with large css files
		perfectionist({
			format: "compact", // Options: 'expanded', 'compact', 'compressed'
			indentSize: 2,
		}),
	],
};
