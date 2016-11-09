var { AsyncStorage } = require('react-native')

var _user$project$Native_AsyncStorage = function () {
  function setItem(key, value) {
    return _elm_lang$core$Native_Scheduler.nativeBinding(function(callback) {
      AsyncStorage.setItem(key, value).then(function() {
        return callback(_elm_lang$core$Native_Scheduler.succeed(value));
      })
      .catch(function(e) {
        return callback(_elm_lang$core$Native_Scheduler.fail({ ctor: 'Error', _0: e.message }));
      });
    });
  }

  function getItem(key) {
    return _elm_lang$core$Native_Scheduler.nativeBinding(function(callback) {
      AsyncStorage.getItem(key).then(function(value) {
        const elmValue = value ? { ctor: 'Just', _0: value } : { ctor: 'Nothing' };
        return callback(_elm_lang$core$Native_Scheduler.succeed(elmValue));
      })
      .catch(function(e) {
        return callback(_elm_lang$core$Native_Scheduler.fail({ ctor: 'Error', _0: e.message }));
      });
    });
  }

  return {
    setItem: F2(setItem),
    getItem: getItem,
  };
}();
