module Model exposing (..)

import Set exposing (Set)

import Types exposing (..)
import StopPicker.Model as StopPicker


type alias Model =
    { direction : Direction
    , schedule : Schedule
    , routes : Routes
    , stopPicker : StopPicker.Model
    , selectedRouteStop : Maybe RouteStop
    }


initialModel : Model
initialModel =
    { direction = Inbound
    , schedule = []
    , routes = []
    , stopPicker = StopPicker.initialModel
    , selectedRouteStop = Nothing
    }

directionName : Direction -> String
directionName direction =
    case direction of
        Inbound -> "Inbound"
        Outbound -> "Outbound"
