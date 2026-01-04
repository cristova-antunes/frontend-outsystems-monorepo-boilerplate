export default {
	extends: ["stylelint-config-standard"],
	rules: {
		"at-rule-no-unknown": [
			true,
			{
				ignoreAtRules: ["mixin", "define-mixin", "each", "for", "util"],
			},
		],
		"no-descending-specificity": null, // Often necessary for OutSystems overrides
	},
};
