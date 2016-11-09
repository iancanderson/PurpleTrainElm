module Message exposing (..)

import Http

import StopPicker.Update as StopPicker
import Types exposing (..)
import AsyncStorage

type Msg
    = StopPickerMsg StopPicker.Msg
    | ChangeDirection Direction
    | PickStop RouteStop
    | LoadRoutes (Result Http.Error Routes)
    | LoadSchedule (Result Http.Error Schedule)
    | ToggleStopPicker
    | SetItem (Result AsyncStorage.Error String)
    | GetItem (Result AsyncStorage.Error (Maybe String))
