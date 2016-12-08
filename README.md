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

## Installing new versions of Elm Native UI (and other unsupported packages)

Elm Native Ui is not in the Elm Package index, meaning it has to be installed by
hand.

At some point, we should either fix the tooling around this or at least write a
script to automate this. For now, here are the steps to install a newer version
of `elm-native-ui`:

1. Clone [elm-native-ui] to a **sibling** directory.
1. Clone [elm-ops-tooling] to a **sibling** directory.
1. Run the `self_publish` script from the **parent** directory to install the
   `elm-native-ui` into the `PurpleTrain` app:

   ```
   python elm-ops-tooling/elm_self_publish.py ./elm-native-ui ./PurpleTrainElm
   ```

1. Remove the `.git`, `examples`, and `node_modules` directories from the
   installed `elm-native-ui`.

   ```
   rm -rf elm-stuff/packages/elm-native-ui/elm-native-ui/2.0.0/.git
   rm -rf elm-stuff/packages/elm-native-ui/elm-native-ui/2.0.0/examples
   rm -rf elm-stuff/packages/elm-native-ui/elm-native-ui/2.0.0/node_modules
   ```

[elm-native-ui]: https://github.com/ohani/elm-native-ui
[elm-ops-tooling]: https://github.com/NoRedInk/elm-ops-tooling)

## Installing new versions of packages in the Elm Package index

Since the `elm-package.json` and `elm-stuff/exact-dependencies.json` both
include packages that are not in the Elm Package index, you have to do some
juggling to install new packages that _are_ in the index (otherwise it complains
about "corrupt" packages).

1. Delete the `elm-native-ui` package (and any other self published packages)
   from `elm-package.json` and `elm-stuff/exact-dependencies.json`.
1. Run `elm-package install`
1. Re-add the deleted lines to both files.
