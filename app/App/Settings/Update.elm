module App.Settings.Update exposing (..)

import App.Settings as Settings
import App.Maybe exposing (maybeToCommand)
import FetchAlertsAndSchedules exposing (fetchAlertsAndSchedules)
import NativeUi.Alert exposing (alert)
import NativeUi.AsyncStorage as AsyncStorage
import UpsertInstallation exposing (upsertInstallation)
import Message exposing (..)
import Model exposing (Model)
import Types exposing (..)
import Task


receiveSettingsResult : Model -> SettingsResult -> ( Model, Cmd Msg )
receiveSettingsResult model settingsResult =
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
            [ maybePromptForPushNotifications settings
            , maybeStop |> maybeToCommand fetchAlertsAndSchedules
            , Maybe.map2 upsertInstallation maybeStop maybeDeviceToken
                |> Maybe.withDefault Cmd.none
            ]


maybePromptForPushNotifications : Settings -> Cmd Msg
maybePromptForPushNotifications settings =
    if Settings.promptedForNotifications settings then
        Cmd.none
    else
        Cmd.batch
            [ setPromptedForNotifications
            , prePromptForPushNotifications
            ]


setPromptedForNotifications : Cmd Msg
setPromptedForNotifications =
    Task.attempt
        SetItem
        (AsyncStorage.setItem Settings.promptedForNotificationsKey "something")


prePromptForPushNotifications : Cmd Msg
prePromptForPushNotifications =
    Task.attempt ReceivePushPrePromptResponse <|
        alert
            "This is what it sounds like when trains cry"
            "Purple Train can send you notifications when your trains are cancelled!"
            [ { text = "Not Now", value = False }
            , { text = "Give Access", value = True }
            ]
