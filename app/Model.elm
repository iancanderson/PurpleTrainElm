module Model exposing (..)

import Set exposing (Set)

import Types exposing (..)
import StopPicker.Model as StopPicker


type alias Model =
    { routes : Routes
    , stopPicker : StopPicker.Model
    , selectedRouteStop : Maybe RouteStop
    }


initialModel : Model
initialModel =
    { routes = []
    , stopPicker = StopPicker.initialModel
    , selectedRouteStop = Nothing
    }
