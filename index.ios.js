const { AppRegistry } = require('react-native');
const Elm = require('./elm');
import initPushNotifications from './init-push-notifications';

const component = Elm.Main.start(app => {
  initPushNotifications(app);
});

AppRegistry.registerComponent('PurpleTrain', () => component);
