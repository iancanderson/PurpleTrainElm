# Purple Train 2: Elm Boogaloo

## Setup

* Make sure you have [elm v0.18](https://guide.elm-lang.org/install.html) installed
* Run `bin/setup`

## Developing

Run `yarn run watch` to start a watch server, which will recompile the elm files
when they are saved.

Use [elm-format](https://github.com/avh4/elm-format) with your editor. You can
set it up to format your Elm files when automatically saving them.

## Running the app

Run `yarn run start` to start the react native packager, which will serve the
javascript bundle to the device simulators.

Open the `ios/PurpleTrain.xcodeproj` and run the project to launch an iPhone simulator.

## Installing new elm packages

Elm Native UI is not in the Elm Package index, meaning we cannot use
`elm-package install`. Instead, we use `elm-github-install`, which can be
invoked with:

```
yarn run elm-github-install
```

We run in via `yarn` so you don't need to install `elm-github-install` as a
global npm package.

If you need to update our version of `elm-native-ui`, update the
`dependency-sources` section in `elm-package.json`.

If you need to install a new elm package, add it to `elm-package.json` manually,
then re-run `yarn run elm-github-install`

## Releasing a new version

### Android

#### One-time setup
To build a production version of the app, you need to add these lines to your
`~/.gradle/gradle.properties`:

```
PURPLE_TRAIN_RELEASE_STORE_FILE=prod.keystore
PURPLE_TRAIN_RELEASE_KEY_ALIAS=purpletrain
PURPLE_TRAIN_RELEASE_STORE_PASSWORD=GET_FROM_1PASSWORD
PURPLE_TRAIN_RELEASE_KEY_PASSWORD=GET_FROM_1PASSWORD
```

Fill in the values marked GET_FROM_1PASSWORD with the values from the "Purple
Train release information" secure note.

Move the `prod.keystore` file from the 1Password note to the `android/app`
directory.

Ask the Google Play developer account owner (Melissa Xie) to add you to the
account so you can create new releases.

#### For each release

Build the signed APK:
```
cd android && ./gradlew assembleRelease
```
This creates a new APK here: `android/app/build/outputs/apk/app-release.apk`

Upload the signed apk to the Google Play developer console and release the new
version from there.
