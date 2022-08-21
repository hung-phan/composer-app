const withMT = require("@material-tailwind/react/utils/withMT");

module.exports = withMT({
  content: [
    "node_modules/@material-tailwind/react/components/**/*.{js,ts,jsx,tsx}",
    "node_modules/@material-tailwind/react/theme/components/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{tsx,ts}",
    "./app/**/*.{tsx,ts}",
    "./share/elements/**/*.{tsx,ts}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
});
