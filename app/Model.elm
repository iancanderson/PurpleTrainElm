module Model exposing (..)

import Date.Format as Date
import Date exposing (Date)

import Types exposing (..)
import StopPicker.Model as StopPicker


type alias Model =
    { direction : Direction
    , schedule : Schedule
    , routes : Routes
    , stopPicker : StopPicker.Model
    , selectedRouteStop : Maybe RouteStop
    , stopPickerOpen : Bool
    }


initialModel : Model
initialModel =
    { direction = Inbound
    , schedule = []
    , routes = []
    , stopPicker = StopPicker.initialModel
    , selectedRouteStop = Nothing
    , stopPickerOpen = False
    }

directionName : Direction -> String
directionName direction =
    case direction of
        Inbound -> "Inbound"
        Outbound -> "Outbound"

prettyTime : Date -> String
prettyTime = Date.format "%l:%M %P"
