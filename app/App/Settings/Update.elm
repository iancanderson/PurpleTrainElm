module App.Settings.Update exposing (..)

import App.Settings as Settings
import App.Maybe exposing (maybeToCommand)
import FetchAlertsAndSchedules exposing (fetchAlertsAndSchedules)
import UpsertInstallation exposing (upsertInstallation)
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
                , deviceToken = Settings.deviceToken settings
              }
            , onReceiveSettings settings
            )


onReceiveSettings : Settings -> Cmd Msg
onReceiveSettings settings =
    let
        maybeDeviceToken =
            Settings.deviceToken settings

        maybeStop =
            Settings.stop settings
    in
        Cmd.batch
            [ maybeStop |> maybeToCommand fetchAlertsAndSchedules
            , maybeStop |> maybeToCommand (upsertInstallation maybeDeviceToken)
            ]
