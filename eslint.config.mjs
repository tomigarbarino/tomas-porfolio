import nextVitals from "eslint-config-next/core-web-vitals";
import nextTypeScript from "eslint-config-next/typescript";

const eslintConfig = [
  { ignores: [".next/**", "output/**", "tmp/**", "work/**", "editorial-evidence-gate/**"] },
  ...nextVitals,
  ...nextTypeScript,
];

export default eslintConfig;
