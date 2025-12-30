# test

**Project Name**: `test`

**Bundle Id / Package Name**: `com.simform.test`

[![react-native](https://img.shields.io/badge/react--native-0.81.4-brightgreen)](https://reactnative.dev/docs/0.81/getting-started)
[![code-style](https://img.shields.io/badge/code%20style-standard%20TS-brightgreen)](https://www.typescriptlang.org/)

---

## Project Desctiption

A test boilerplate to kickstart your project with some commonly used setups, components, navigation and screens.

## Prerequisites

**iOS** : XCode(16) onwards

**Android** : Android Studio Narwhal(2025.1.1)(Patch 1) with gradle(8.1) onwards

**Editor** : Visual Studio Code

## How to Run the Project

1. Open the project directory in to terminal
2. Run and build for either OS

   - Run iOS app

     ```bash
     yarn run ios
     ```

   - Run Android app

     ```bash
     yarn run android
     ```

   - Note: This yarn scripts will lint your code first. If there are no lint errors, then it will run the ios or android app. Otherwise it will show the lint errors in the terminal.

## Coding Style used

This project adheres to JavaScript Standard for coding style. To maintain coding standards, utilizing features of ES6 and follow best development practices of react-native, this project also uses [ES6](http://es6-features.org/#Constants), some rules of [eslint-config](https://www.npmjs.com/package/@react-native-community/eslint-config), [import-resolver-typescript](https://github.com/import-js/eslint-import-resolver-typescript) and [eslint-plugin-import](https://github.com/import-js/eslint-plugin-import).

**Do not disable lint inside the code. Try to understand the rule and then follow it into your code. Disabling lint will be considered a violation of coding standards. Exceptions will be allowed by the code-reviewer and team lead after understanding the need to ignore lint.**

1. **To Lint**

   Use the yarn script `lint`. To run it

```bash
  yarn lint
```

2. **Auto Lint on Commit**

   This is implemented using [husky](https://github.com/typicode/husky). So husky will prevent code-commits having lint errors. There is no additional setup needed.

3. **Understanding Linting Errors**

   The linting rules are from JS Standard and React-Standard. [Regular JS errors can be found with descriptions here](http://eslint.org/docs/rules/), while [React errors and descriptions can be found here](https://github.com/yannickcr/eslint-plugin-react).

## Extra steps for android

_Describe any extra steps which need to be taken for the auto-generated android project. Eg. Some specific setup of any manifest file, some manual linking which is buggy and needs to be corrected for first checkout etc. Here is an example:_

- Mind the version of google services used in the project. All google services must have same version. This is implemented using project level build.gradle.

## Extra steps for ios

_Describe any extra steps which need to be taken for the auto-generated ios project. Eg. Some specific setup of any certificates, pods, linking, information in Info.plist, some manual linking which is buggy and needs to be corrected for first checkout etc. Here is an example:_

- You will need all the certificates to run the ios project in a real device.

## List of all dependencies used in the project with their usage

List all dependencies from the package.json file along with their usage. This list must be updated every time you change/add any dependency. Here are some examples:

- **Framework:**
  - [React Native](https://github.com/facebook/react-native)

- **State management libraries:**
  - [React Redux](https://react-redux.js.org/), [redux-persist](https://github.com/rt2zz/redux-persist)  
  
- **Middleware libraries:**
  - [Redux Toolkit](https://redux-toolkit.js.org/) 

- **Navigation:**

  - [react-navigation](https://github.com/react-navigation/react-navigation), [react-native-gesture-handler](https://github.com/kmagiera/react-native-gesture-handler),
  [react-native-safe-area-context](https://github.com/th3rdwave/react-native-safe-area-context)
    [react-native-screens](https://github.com/software-mansion/react-native-screens)

- **For Api**
  - [apisauce](https://github.com/infinitered/apisauce), [axios](https://github.com/axios/axios)

- **Storage:**

  - [react-native-mmkv](https://github.com/mrousavy/react-native-mmkv)

- **Config:**

  - [react-native-config](https://github.com/luggit/react-native-config)

- **Crash report:**

  - [@sentry/react-native](https://github.com/getsentry/sentry-react-native)

- **For Validations:**

  - [formik](https://github.com/jaredpalmer/formik), [yup](https://github.com/jquense/yup)

- **For Utilities**

  - [lodash](https://lodash.com/), [i18next](https://github.com/i18next/i18next), [react-i18next](https://github.com/i18next/react-i18next), [react-native-localize](https://github.com/zoontek/react-native-localize), [react-native-permissions](https://github.com/zoontek/react-native-permissions)

## Following accounts are used for the mentioned platforms

_Mention all the accounts used for various development and deployment platforms. Just email/username should be mentioned but never a password. Make sure this information stays in a private repository. If your repository is public, do not share this kind of private information via readme. Provide another private source. Like a private file on our zoho or a file in Microsoft Teams._

**Sonarqube**: N/A

**Bitrise**: N/A

**Google Play**: N/A

**Apple Store and developer account**: N/A

**Firebase/Google service**: N/A

## Troubleshoot Notes

_Provide troubleshoot guideline for any known issues. For example, a specific error for build or deployment processes or even an error in any third party dependency._

_For example_

- Application crashes in production because of react-native-maps. Follow this [link](https://github.com/react-native-community/react-native-maps/issues/2997) to fix it.

_If there no known issues:_

- There are no known issues for run or build processes right now.

## Notes

_Here any information which is important but not mentioned above and must be passed among all developers, should be mentioned. Like which branch is used for build releases, library deprecations etc._

_For example_

- Release builds are distributed from release branch and all pull requests are done to develop branch.