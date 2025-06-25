import config from "@echristian/eslint-config"

export default config({
  react: {
    enabled: true,
  },
  reactHooks: {
    enabled: true,
  },
  jsx: {
    enabled: true,
    a11y: false,
  },
  prettier: {
    plugins: ["prettier-plugin-packagejson"],
  },
})
