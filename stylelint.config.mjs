export default {
  extends: ["stylelint-config-standard"],
  rules: {
    "nesting-selector-no-missing-scoping-root": null, // needed for postcss-nested
    "no-invalid-position-declaration": null, // needed for postcss-nested
    "import-notation": "string", // support postcss import plugin
    "selector-class-pattern": null, // OutSystems generates class names that don't follow any pattern
    "custom-property-pattern": [
      "^(_?[a-z][a-z0-9]*)(-[a-z0-9]+)*$",
      {
        message:
          "Expected custom property name to be kebab-case or private (e.g., --_private-name)",
      },
    ],
    "property-no-unknown": [
      true,
      { ignoreProperties: ["corner-shape", "overflow-scrolling"] },
    ],

    // Deeply nested selectors generate long strings that crash the OS compiler.
    //To be reduced in the future to 4
    "max-nesting-depth": [
      5,
      {
        ignore: ["blockless-at-rules"],
      },
    ],

    // 2. Limit Selector Complexity
    // Prevents ".a .b .c .d .e" which is hard for the OS parser to index.
    //To be reduced in the future to 4
    "selector-max-compound-selectors": 5,

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
          "import-glob",
          "import",
          "each",
          "for",
          "util",
          "mixin-content",
        ],
      },
    ],

    // Lowers the chance of specificity wars in OutSystems
    "selector-max-id": 0,
    "no-descending-specificity": null, // Often necessary when mapping to OS Themes
  },
};
