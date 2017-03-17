# Releasing a new version

## Android

### One-time setup
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

### For each release

Build the signed APK:
```
cd android && ./gradlew assembleRelease
```
This creates a new APK here: `android/app/build/outputs/apk/app-release.apk`

Upload the signed apk to the Google Play developer console and release the new
version from there.

