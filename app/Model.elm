module Model exposing (..)

import NativeUi.ListView exposing (DataSource, emptyDataSource)
import Date.Format as Date
import Date exposing (Date)
import Http
import Time exposing (Time)
import Types exposing (..)


type alias Model =
    { inboundSchedule : Loadable (Result Http.Error Schedule)
    , outboundSchedule : Loadable (Result Http.Error Schedule)
    , stops : Loadable (Result Http.Error Stops)
    , selectedStop : Maybe Stop
    , stopPickerOpen : Bool
    , now : Date
    , alerts : Loadable (Result Http.Error Alerts)
    , alertsAreExpanded : Bool
    , dismissedAlertIds : List Int
    , stopPickerDataSource : DataSource Stop
    }


initialModel : Model
initialModel =
    { inboundSchedule = Loading
    , outboundSchedule = Loading
    , stops = Loading
    , selectedStop = Nothing
    , stopPickerOpen = False
    , now = Date.fromTime 0
    , alerts = Loading
    , alertsAreExpanded = False
    , dismissedAlertIds = []
    , stopPickerDataSource = emptyDataSource
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


visibleAlerts : List Alert -> List Int -> List Alert
visibleAlerts allAlerts dismissedIds =
    let
        isNotDismissed alert =
            not <| List.member alert.id dismissedIds
    in
        List.filter isNotDismissed allAlerts


visibleAlertsExist : Model -> Bool
visibleAlertsExist { alerts, dismissedAlertIds } =
    case alerts of
        Loading ->
            False

        Ready (Err _) ->
            False

        Ready (Ok loadedAlerts) ->
            not <| List.isEmpty <| visibleAlerts loadedAlerts dismissedAlertIds
