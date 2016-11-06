module Message exposing (..)

import Http
import StopPicker.Update as StopPicker
import Types exposing (..)

type Msg
    = StopPickerMsg StopPicker.Msg
    | ChangeDirection Direction
    | PickStop RouteStop
    | LoadRoutes (Result Http.Error Routes)
    | LoadSchedule (Result Http.Error Schedule)
