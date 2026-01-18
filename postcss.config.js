import postcssCombineDuplicatedSelectors from "postcss-combine-duplicated-selectors";
import postcssPxtorem from "postcss-pxtorem";
import postcssPresetEnv from "postcss-preset-env";
import postcssSafeParser from "postcss-safe-parser";
import postcssEach from "postcss-each";
import postcssSimpleVars from "postcss-simple-vars";
import postcssImportExtGlob from "postcss-import-ext-glob";
import postcssImport from "postcss-import";
import postcssMixins from "postcss-mixins";
import postcssNested from "postcss-nested";
import cssnano from "cssnano";

const nodeEnv = process.env.NODE_ENV || "";

export default (ctx) => {
  // Check if we are in production mode
  const isProduction =
    ctx.env === "production" || nodeEnv === "production";

  return {
    parser: postcssSafeParser,
    plugins: [
      postcssImportExtGlob(),
      postcssImport(),
      postcssMixins(),
      postcssNested(),
      postcssEach(),
      postcssSimpleVars({
        unknown(node, name, result) {
          // Print out warning if the node still exists at the end.
          // node.warn(result, "Unknown variable " + name);
        },
      }),
      postcssPxtorem(),
      postcssPresetEnv({
        stage: 1,
        features: {
          "nesting-rules": true,
          "custom-properties": true,
        },
        browsers: "last 2 versions",
      }),
      postcssCombineDuplicatedSelectors(),

      // ONLY minify if we are building for production
      isProduction
        ? cssnano({
            preset: [
              "default",
              {
                discardComments: { removeAll: true },
                zindex: false,
              },
            ],
          })
        : null,
    ].filter(Boolean), // This removes the 'null' if not in production,
  };
};
