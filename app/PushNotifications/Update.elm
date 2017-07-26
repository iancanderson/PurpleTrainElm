module PushNotifications.Update exposing (..)

import NativeUi.Alert as NativeAlert exposing (alert)
import NativeApi.PushNotificationIOS as PushNotificationIOS exposing (register)
import Task
import Message exposing (..)
import UpsertInstallation exposing (upsertInstallation)
import Types exposing (..)


handlePushPrePromptResponse : Result String Bool -> Cmd Msg
handlePushPrePromptResponse result =
    case result of
        Ok True ->
            Task.attempt ReceivePushToken register

        _ ->
            Cmd.none


receiveDeviceToken : Maybe Stop -> DeviceToken -> Cmd Msg
receiveDeviceToken maybeStop deviceToken =
    case maybeStop of
        Just stop ->
            upsertInstallation stop deviceToken

        Nothing ->
            Cmd.none
