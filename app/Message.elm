module Message exposing (..)

import Http
import Time exposing (Time)

import StopPicker.Update as StopPicker
import Types exposing (..)
import NativeUi.AsyncStorage as AsyncStorage

type Msg
    = StopPickerMsg StopPicker.Msg
    | ChangeDirection Direction
    | PickStop RouteStop
    | LoadRoutes (Result Http.Error Routes)
    | LoadSchedule (Result Http.Error Schedule)
    | ToggleStopPicker
    | SetItem (Result AsyncStorage.Error ())
    | GetItem (Result AsyncStorage.Error (Maybe String))
    | Minute Time
