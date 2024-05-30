/** @type {import("prettier").Config} */
module.exports = {
  arrowParens: "always",
  printWidth: 80,
  singleQuote: false,
  jsxSingleQuote: false,
  semi: true,
  trailingComma: "es5",
  tabWidth: 2,
  plugins: [require.resolve("prettier-plugin-tailwindcss")],
  tailwindConfig: require.resolve("./tailwind.config.js"),
};
