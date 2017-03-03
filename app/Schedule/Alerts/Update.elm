module Schedule.Alerts.Update exposing (dismissAlert)

import NativeUi.AsyncStorage as AsyncStorage
import Message exposing (Msg(..))
import Model exposing (Model, visibleAlertsExist)
import App.Settings as Settings
import Task
import Types exposing (..)


dismissAlert : Model -> Alert -> ( Model, Cmd Msg )
dismissAlert model alert =
    let
        newDismissedAlertIds =
            alert.id :: model.dismissedAlertIds

        command =
            saveDismissedAlertsCommand newDismissedAlertIds

        modelWithDismissedAlert =
            { model | dismissedAlertIds = newDismissedAlertIds }
    in
        if visibleAlertsExist modelWithDismissedAlert then
            ( modelWithDismissedAlert, command )
        else
            ( { modelWithDismissedAlert | alertsAreExpanded = False }, command )


saveDismissedAlertsCommand : List Int -> Cmd Msg
saveDismissedAlertsCommand dismissedAlertIds =
    let
        dismissedAlertIdsCsv =
            String.join "," <| List.map toString dismissedAlertIds
    in
        Task.attempt
            SetItem
            (AsyncStorage.setItem Settings.dismissedAlertsKey dismissedAlertIdsCsv)
