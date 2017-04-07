module Model exposing (..)

import NativeUi.ListView exposing (DataSource, emptyDataSource)
import Date.Format as Date
import Date exposing (Date)
import Types exposing (..)


type alias Model =
    { inboundSchedule : Loadable Schedule
    , outboundSchedule : Loadable Schedule
    , selectedStop : Maybe Stop
    , stopPickerOpen : Bool
    , now : Date
    , alerts : Loadable Alerts
    , alertsAreExpanded : Bool
    , dismissedAlertIds : List Int
    , stopPickerDataSource : Loadable (DataSource Stop)
    , deviceToken : Maybe DeviceToken
    }


initialModel : Model
initialModel =
    { inboundSchedule = Loading
    , outboundSchedule = Loading
    , selectedStop = Nothing
    , stopPickerOpen = False
    , now = Date.fromTime 0
    , alerts = Loading
    , alertsAreExpanded = False
    , dismissedAlertIds = []
    , stopPickerDataSource = Loading
    , deviceToken = Nothing
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
        Ready loadedAlerts ->
            not <| List.isEmpty <| visibleAlerts loadedAlerts dismissedAlertIds

        _ ->
            False
