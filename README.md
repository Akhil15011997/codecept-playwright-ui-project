
This project is written using [CodeceptJS](https://codecept.io/) framework using [BDD](https://cucumber.io/docs/bdd/) and [Playwright](https://playwright.dev/docs/intro) to interface with the browser

## Pre-requisites

Have a working node, recommended to use the [latest version](https://nodejs.org/en/download/package-manager/current).

# Setup

Once node is ready simply run `npm install` from the root folder and install all dependencies

## How to start tests

The following commands can be used for testing : 

`npx codeceptjs run` or `npm test` for running all the scripts
`TAG="@allScripts" npm run withTags` for running the scripts with specific tags where `@allScripts` can be changed to any custom tags which can be added to the featurefile
Add `--verbose` for internal logs and `--debug` for debug mode
