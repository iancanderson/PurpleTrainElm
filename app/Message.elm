module Message exposing (..)

import Http
import StopPicker
import Types exposing (..)

type Msg
    = StopPickerMsg StopPicker.Msg
    | PickStop RouteStop
    | FetchRoutes
    | LoadRoutes (Result Http.Error Routes)
