# Purple Train 2: Elm Boogaloo

## Setup

Make sure you have [elm v0.18](https://guide.elm-lang.org/install.html) installed
Run `bin/setup`

## Developing

Run `yarn run watch` to start a watch server, which will recompile the elm files
when they are saved.

Use [elm-format](https://github.com/avh4/elm-format) with your editor. You can
set it up to format your Elm files when automatically saving them.

## Running the app

Run `yarn run start` to start the react native packager, which will serve the
javascript bundle to the device simulators.

Open the `ios/App.xcodeproj` and run the project to launch an iPhone simulator.

## How to install things in the elm index

TODO: Josh make this make sense

Go into the `exact-dependencies.json` file, delete the packages that aren't in
the elm package index, then 
