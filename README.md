# Rocket.Chat ToDo App

## Attribution

Based in part on Diego Sampaio's [Rocket.Chat Poll App](https://github.com/sampaiodiego/rocket.chat.app-poll).

## Requirements

Rocket.Chat Version: **1.4.0**

## Installing

Rocket.Chat ToDo App is not yet provided via Rocket.Chat Marketplace https://rocket.chat/marketplace.

To install ToDo on your Rocket.Chat server, you have to turn on the setting `Enable development mode` on the Rocket.Chat server under `Admin > General > Apps`.

Then you can then upload a release .zip from the [Releases Page](https://github.com/ianmclinden/rocket.chat.app-todo/releases/latest).

## Usage

Use the slash command to create a todo list:

```
/todo "Changes before release" "Fix some bugs" "Adjust some formatting" "Clean up code"
```

The following todo list will be created:

![ToDo List](https://user-images.githubusercontent.com/8931381/77243183-5797e580-6bd5-11ea-8153-4d7fde0ae2c2.png)

## Contributing

You'll need to set up the Rocket.Chat Apps dev environment, please see https://rocket.chat/docs/developer-guides/developing-apps/getting-started/

To install the using the command line, you have to turn on the setting `Enable development mode` on the Rocket.Chat server under `Admin > General > Apps`.

Then you can clone this repo and then:

```bash
npm install
rc-apps deploy
```

Follow the instructions and when you're done, the app will be installed on your Rocket.Chat server.
