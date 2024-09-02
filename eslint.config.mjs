import globals from "globals";
import pluginJs from "@eslint/js";

export default [
  {
    files: ["**/*.js"],
    languageOptions: {
      sourceType: "commonjs",
      // Declare variables as globals to avoid no-undef errors
      globals: {
        __dirname: "readonly",
        inject: "readonly",   
        Given: "readonly",    
        When: "readonly",     
        actor: "readonly",    
        process: "readonly",  
        locate: "readonly",
        ...globals.browser,   
      }
    },
    rules: {
      'indent': ['error', 2],
      'no-mixed-spaces-and-tabs': 'error',
      'space-before-function-paren': ['error', 'always'],
      'no-trailing-spaces': 'error',
      'space-in-parens': ['error', 'never'],
      'space-infix-ops': 'error',
    },
  },
  pluginJs.configs.recommended,
];
