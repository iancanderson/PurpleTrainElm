module Model exposing (..)

import Date.Format as Date
import Date exposing (Date)
import Time exposing (Time)

import Types exposing (..)


type alias Model =
    { direction : Direction
    , inboundSchedule : Loadable Schedule
    , outboundSchedule : Loadable Schedule
    , stops : Loadable Stops
    , selectedStop : Maybe Stop
    , stopPickerOpen : Bool
    , now : Date
    }


initialModel : Model
initialModel =
    { direction = Inbound
    , inboundSchedule = Loading
    , outboundSchedule = Loading
    , stops = Loading
    , selectedStop = Nothing
    , stopPickerOpen = False
    , now = Date.fromTime 0
    }


prettyTime : Date -> String
prettyTime = Date.format "%l:%M %P"
