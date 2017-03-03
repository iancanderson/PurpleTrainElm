module App.Settings.Update exposing (..)

import App.Settings as Settings
import App.Maybe exposing (maybeToCommand)
import FetchAlertsAndSchedules exposing (fetchAlertsAndSchedules)
import Message exposing (..)
import Model exposing (Model)
import Types exposing (..)


receiveSettings : Model -> SettingsResult -> ( Model, Cmd Msg )
receiveSettings model settingsResult =
    case settingsResult of
        Err _ ->
            ( model, Cmd.none )

        Ok settings ->
            ( { model
                | dismissedAlertIds = Settings.dismissedAlertIds settings
                , selectedStop = Settings.stop settings
              }
            , onReceiveSettings settings
            )


onReceiveSettings : Settings -> Cmd Msg
onReceiveSettings settings =
    Settings.stop settings
        |> maybeToCommand fetchAlertsAndSchedules
