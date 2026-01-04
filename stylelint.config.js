export default {
	extends: ["stylelint-config-standard"],
	customSyntax: "postcss-scss", // Helps Stylelint understand mixins/vars even if using .css files
	rules: {
		// --- OUTSYSTEMS COMPILER SAFETY ---

		// 1. Limit Nesting Depth
		// Deeply nested selectors generate long strings that crash the OS compiler.
		"max-nesting-depth": [
			3,
			{
				ignore: ["blockless-at-rules"],
			},
		],

		// 2. Limit Selector Complexity
		// Prevents ".a .b .c .d .e" which is hard for the OS parser to index.
		"selector-max-compound-selectors": 4,

		// 3. Prevent Duplicate Properties
		// Cleanliness check to keep file size down.
		"declaration-block-no-duplicate-properties": true,

		// --- POSTCSS COMPATIBILITY ---

		// Allow PostCSS at-rules (@mixin, @each, etc.)
		"at-rule-no-unknown": [
			true,
			{
				ignoreAtRules: [
					"mixin",
					"define-mixin",
					"each",
					"for",
					"util",
					"mixin-content",
				],
			},
		],

		// --- BEST PRACTICES FOR LARGE FILES ---

		// Lowers the chance of specificity wars in OutSystems
		"selector-max-id": 0,
		"no-descending-specificity": null, // Often necessary when mapping to OS Themes
	},
};
