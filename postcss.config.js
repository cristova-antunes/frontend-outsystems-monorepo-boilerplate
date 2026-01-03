import postcssCombineDuplicatedSelectors from "postcss-combine-duplicated-selectors"
import postcssPxtorem from "postcss-pxtorem"
import postcssPresetEnv from "postcss-preset-env"
import postcssSafeParser from "postcss-safe-parser"
import postcssEach from "postcss-each"
import postcssSimpleVars from "postcss-simple-vars"
import postcssImportExtGlob from "postcss-import-ext-glob"
import postcssImport from "postcss-import"
import postcssMixins from "postcss-mixins"
import postcssNested from "postcss-nested"
import cssnano from "cssnano"
import stylelint from "stylelint"

//const preset = cssNanoPresetAdvanced({ discardComments: { removeAll: true } });

export default {
  parser: postcssSafeParser,
  plugins: [
    postcssImportExtGlob(),
    postcssImport(),
    postcssMixins(),
    postcssNested(),
    postcssEach(),
    postcssSimpleVars(),
    /*
    postcssSimpleVars({
      unknown(node, name, result) {
        // Print out warning if the node still exists at the end.
        // node.warn(result, "Unknown variable " + name);
      },
    }),*/

    postcssCombineDuplicatedSelectors(),
    postcssPxtorem(),
    postcssPresetEnv({
      stage: 1,
      features: {
        "nesting-rules": true,
        "custom-properties": true,
      },
      browsers: "last 2 versions",
    }),
    stylelint(),
    cssnano({
      preset: [
        "default",
        {
          zindex: false, // don't change z-indices and prevent clash with OSUI z-indices
          normalizeWhitespace: true,
        },
      ],
    }),
  ],
}
