# Purple Train

[Purple Train] is a mobile app that provides schedules, predictions, and alerts
for [MBTA Commuter Rail] riders.

The app is written in the [elm] language, using the experimental [elm-native-ui]
library. See the [Elm Native UI in Production] blog post about why we are
excited about writing mobile apps in elm.

[Purple Train]: https://purpletrainapp.com
[MBTA Commuter Rail]: http://www.mbta.com/schedules_and_maps/rail/
[elm]: http://elm-lang.org
[elm-native-ui]: https://github.com/ohanhi/elm-native-ui
[Elm Native UI in Production]: https://robots.thoughtbot.com/elm-native-ui-in-production

## Setup

* Make sure you have [elm v0.18](https://guide.elm-lang.org/install.html)
  installed
* Run `bin/setup`

## Development

Run `yarn run watch`

This will start a watch server, which will recompile the elm files when they are
saved.

We recommend using [elm-format](https://github.com/avh4/elm-format) with your
editor. You can set it up to format your Elm files when automatically saving
them.

## Running the app

Run `yarn run start` to start the react native packager, which will serve the
javascript bundle to your mobile devices and simulators.

### iOS

Open `ios/PurpleTrain.xcodeproj` and run the project to launch an iPhone
simulator.

### Android

Follow the [React Native Getting Started guide] to create and run a virtual
Android device.

[React Native Getting Started guide]:
https://facebook.github.io/react-native/docs/getting-started.html

## Contributing

See the [CONTRIBUTING] document.
Thank you, [contributors]!

[CONTRIBUTING]: CONTRIBUTING.md
[contributors]: https://github.com/thoughtbot/PurpleTrainElm/graphs/contributors

## Updating dependencies

Updating elm packages for this project is more complicated than most. See
[DEPENDENCIES.md](/DEPENDENCIES.md) for detailed instructions.

## Releasing a new version

See [RELEASING.md](/RELEASING.md)

## License

Purple Train is Copyright (c) 2016-2017 Josh Steiner, Ian C. Anderson, and
thoughtbot, inc. It is free software, and may be redistributed under the GPL
license detailed in the [LICENSE] file.

[LICENSE]: /LICENSE

## About thoughtbot

![thoughtbot](http://presskit.thoughtbot.com/images/thoughtbot-logo-for-readmes.svg)

Purple Train is maintained and funded by thoughtbot, inc.
The names and logos for thoughtbot are trademarks of thoughtbot, inc.

We love open source software, Elm, and React Native. [Work with thoughtbot's
React Native development team][react-native] to design, develop, and grow your
product.

[react-native]:
https://thoughtbot.com/services/react?utm_source=github
