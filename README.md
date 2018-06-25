# Fusing Angular CLI

_Faster CLI tool for Angular_

[![CircleCI](https://circleci.com/gh/patrickmichalina/fusing-angular-cli.svg?style=shield)](https://circleci.com/gh/patrickmichalina/fusing-angular-cli)
[![Greenkeeper badge](https://badges.greenkeeper.io/patrickmichalina/fusing-angular-cli.svg)](https://greenkeeper.io/)
[![dependencies Status](https://david-dm.org/patrickmichalina/fusing-angular-cli/status.svg)](https://david-dm.org/patrickmichalina/fusing-angular-cli)
[![devDependencies Status](https://david-dm.org/patrickmichalina/fusing-angular-cli/dev-status.svg)](https://david-dm.org/patrickmichalina/fusing-angular-cli?type=dev)
[![Fusebox-bundler](https://img.shields.io/badge/gitter-join%20chat%20%E2%86%92-brightgreen.svg)](https://gitter.im/fusing-angular-cli/Lobby)

**WARNING: WORK IN PROGRESS**

## Prerequisites

The CLI has dependencies that require Node 10.0.0 or higher, together with NPM 6.0.0 or higher.

## Table of Contents

- [Roadmap](#roadmap)
- [Installation](#installation)
- [Usage](#usage)
- [Updating Fusing Angular CLI](#updating-fusing-angular-cli)
- [Developing Fusing Angular CLI](#developing-fusing-angular-cli)
- [License](#license)

## Roadmap

You can learn more about what we aim to achieve by reading our [roadmap](ROADMAP.md)

## Installation

```bash
npm install -g fusing-angular-cli
```

## Usage

```bash
fng help
```

### Updating Fusing Angular CLI

```bash
fng update

or

npm i -g fusing-angular-cli@latest
```

## Developing Fusing Angular CLI

### Bundling and runnng the code

```bash
# to run local CLI
$ npm start

# to run local CLI w/ continuous testing
$ npm run start.dev

# issuing CLI commands to local build
$ .build/fng [some commands go here]
```

### Testing your code

```bash
# test your code
npm test
```

## License

MIT
