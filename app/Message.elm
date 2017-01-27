module Message exposing (..)

import Http
import Time exposing (Time)
import Types exposing (..)
import NativeUi.AsyncStorage as AsyncStorage
import App.Settings exposing (Settings)


type alias SettingsResult =
    Result AsyncStorage.Error Settings


type Msg
    = PickStop Stop
    | LoadStops (Result Http.Error Stops)
    | LoadSchedule Direction (Result Http.Error Schedule)
    | ToggleStopPicker
    | SetItem (Result AsyncStorage.Error ())
    | GetItem (Result AsyncStorage.Error (Maybe String))
    | Tick Time
    | ReportIssue Direction (Maybe Stop)
    | IssueResponse (Result Http.Error ())
    | ToggleAlerts
    | LoadAlerts (Result Http.Error Alerts)
    | DismissAlert Alert
    | ReceiveSettings SettingsResult
