module Model exposing (..)

import Date.Format as Date
import Date exposing (Date)
import Time exposing (Time)

import Types exposing (..)
import StopPicker.Model as StopPicker


type alias Model =
    { direction : Direction
    , inboundSchedule : Schedule
    , outboundSchedule : Schedule
    , routes : Routes
    , stopPicker : StopPicker.Model
    , selectedRouteStop : Maybe RouteStop
    , stopPickerOpen : Bool
    , now : Date
    }


initialModel : Model
initialModel =
    { direction = Inbound
    , inboundSchedule = []
    , outboundSchedule = []
    , routes = []
    , stopPicker = StopPicker.initialModel
    , selectedRouteStop = Nothing
    , stopPickerOpen = False
    , now = Date.fromTime 0
    }


prettyTime : Date -> String
prettyTime = Date.format "%l:%M %P"
