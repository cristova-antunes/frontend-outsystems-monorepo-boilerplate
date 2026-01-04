import postcssImportExtGlob from "postcss-import-ext-glob";
import postcssImport from "postcss-import";
import postcssMixins from "postcss-mixins";
import postcssEach from "postcss-each";
import postcssSimpleVars from "postcss-simple-vars";
import postcssPxtorem from "postcss-pxtorem";
import postcssPresetEnv from "postcss-preset-env";
import postcssCombineDuplicatedSelectors from "postcss-combine-duplicated-selectors";
import postcssDiscardComments from "postcss-discard-comments";
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
			mediaQuery: false,
		}),
		postcssPresetEnv({
			stage: 1,
			features: {
				"nesting-rules": false, // Handled by postcss-nested for better control
				"custom-properties": true,
			},
		}),
		postcssCombineDuplicatedSelectors(),
		postcssDiscardComments({ removeAll: true }),
		// "Middle-ground" formatting:
		perfectionist({
			format: "compact", // Options: 'expanded', 'compact', 'compressed'
			indentSize: 2,
		}),
		// Only use cssnano for logic optimizations, not whitespace
		cssnano({
			preset: [
				"default",
				{
					zindex: false,
					normalizeWhitespace: false, // Let perfectionist handle this
					discardComments: false, // Handled above
					mergeIdent: true,
					discardUnused: true,
				},
			],
		}),
	],
};
