module Model exposing (..)

import Date.Format as Date
import Date exposing (Date)
import Time exposing (Time)
import Types exposing (..)


type alias Model =
    { inboundSchedule : Loadable Schedule
    , outboundSchedule : Loadable Schedule
    , stops : Loadable Stops
    , selectedStop : Maybe Stop
    , stopPickerOpen : Bool
    , now : Date
    }


initialModel : Model
initialModel =
    { inboundSchedule = Loading
    , outboundSchedule = Loading
    , stops = Loading
    , selectedStop = Nothing
    , stopPickerOpen = False
    , now = Date.fromTime 0
    }


prettyTime : Date -> String
prettyTime =
    Date.format "%l:%M %P"


nextTrainCount : Int
nextTrainCount =
    2


nextTrains : Schedule -> Schedule
nextTrains =
    List.take nextTrainCount


laterTrains : Schedule -> Schedule
laterTrains =
    List.drop nextTrainCount
