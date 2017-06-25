module Message exposing (..)

import Http
import Time exposing (Time)
import Types exposing (..)
import NativeApi.PushNotificationIOS as Push
import NativeUi.AsyncStorage as AsyncStorage
import NativeUi.Alert as NativeAlert


type Msg
    = DismissAlert Alert
    | PickStop Stop
    | ReceiveAlerts (Result Http.Error Alerts)
    | ReceiveInstallationResponse (Result Http.Error ())
    | ReceiveIssueResponse (Result Http.Error ())
    | ReceiveSchedule Direction (Result Http.Error Schedule)
    | ReceiveSettings SettingsResult
    | ReceiveStops (Result Http.Error Stops)
    | ReportIssue Direction (Maybe Stop)
    | SetItem (Result AsyncStorage.Error ())
    | Tick Time
    | ToggleAlerts
    | ToggleStopPicker
    | DeviceTokenChanged String
    | ReceivePushPrePromptResponse (Result NativeAlert.Error Bool)
    | ReceivePushToken (Result Push.Error String)
