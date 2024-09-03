
This project is written using [CodeceptJS](https://codecept.io/) framework using [BDD](https://cucumber.io/docs/bdd/) and [Playwright](https://playwright.dev/docs/intro) to interface with the browser

## Pre-requisites

Have a working node, recommended to use the [latest version](https://nodejs.org/en/download/package-manager/current) and then `npm install -g pnpm` to install pnpm

# Setup

Once the dependencies are ready simply run `pnpm install` from the root folder and install all dependencies

## How to start tests

The following commands can be used for testing : 

`pnpm test:prod:tag @thisIsMyTag` or `npm test` for running the scripts where `@allScripts` can be changed to any custom tags which can be added to the featurefile and `prod` can also be `staging` environment
`pnpm test:headless:tag @thisIsMyTag` similar to the above command but the scripts will run in headless mode with default as `staging` environment
`pnpm lint` to find any linting issues. Note: You will not be able to commit if there are any linting issues. For linting rules related to this project please check __eslint.config.mjs__ file
`pnpm playwright codegen` to use the playwright record function
To view trace go to [playwright trace](https://trace.playwright.dev) and upload the zip file geenrated in the reports/trace folder 
