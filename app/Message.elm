module Message exposing (..)

import Http
import Time exposing (Time)

import Types exposing (..)
import NativeUi.AsyncStorage as AsyncStorage

type Msg
    = ChangeDirection
    | PickStop Stop
    | LoadStops (Result Http.Error Stops)
    | LoadSchedule Direction (Result Http.Error Schedule)
    | ToggleStopPicker
    | SetItem (Result AsyncStorage.Error ())
    | GetItem (Result AsyncStorage.Error (Maybe String))
    | Minute Time
