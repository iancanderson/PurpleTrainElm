module PushNotifications.Update exposing (..)

import NativeUi.Alert exposing (alert)
import Task
import Message exposing (..)


handlePushPrePromptResponse : Result NativeUi.Alert.Error Bool -> Cmd Msg
handlePushPrePromptResponse result =
    case result of
        Ok accepted ->
            if accepted then
                -- TODO: show OS-level push notifications dialog now
                Debug.log "accepted!" Cmd.none
            else
                Cmd.none

        Err _ ->
            Cmd.none
