module Update exposing (..)

import Types exposing (..)
import Model exposing (..)
import Message exposing (..)
import ReportIssue
import App.Settings.Update exposing (receiveSettingsResult)
import Http
import PushNotifications.Update exposing (..)
import Schedule.Alerts.Update exposing (dismissAlert)
import Stops.Update exposing (receiveStops, pickStop)
import Tick.Update exposing (tick)
import App.Maybe exposing (maybeToCommand)


update : Msg -> Model -> ( Model, Cmd Msg )
update msg model =
    case msg of
        ReceiveInstallationResponse _ ->
            ( model, Cmd.none )

        ReceiveIssueResponse _ ->
            ( model, Cmd.none )

        PickStop stop ->
            pickStop model stop

        SetItem _ ->
            ( model, Cmd.none )

        ReceivePushPrePromptResponse accepted ->
            ( model, handlePushPrePromptResponse accepted )

        ReceivePushToken result ->
            case result of
                Ok tokenString ->
                    ( { model | deviceToken = Just (DeviceToken tokenString) }
                    , receiveDeviceToken model.selectedStop (DeviceToken tokenString)
                    )

                Err registerError ->
                    Debug.crash registerError

        ReceiveAlerts result ->
            ( { model | alerts = toLoadable result }, Cmd.none )

        ReceiveStops result ->
            receiveStops model result

        ReceiveSchedule direction result ->
            case direction of
                Inbound ->
                    ( { model | inboundSchedule = toLoadable result }, Cmd.none )

                Outbound ->
                    ( { model | outboundSchedule = toLoadable result }, Cmd.none )

        ToggleStopPicker ->
            ( { model | stopPickerOpen = not model.stopPickerOpen }, Cmd.none )

        Tick now ->
            tick model now

        ReportIssue direction mstop ->
            ( model, maybeToCommand (ReportIssue.report direction) mstop )

        ToggleAlerts ->
            ( { model | alertsAreExpanded = not model.alertsAreExpanded }
            , Cmd.none
            )

        DismissAlert alert ->
            dismissAlert model alert

        ReceiveSettings settingsResult ->
            receiveSettingsResult model settingsResult

        DeviceTokenChanged deviceTokenString ->
            ( { model | deviceToken = Just <| DeviceToken deviceTokenString }
            , Cmd.none
            )


toLoadable : Result Http.Error a -> Loadable a
toLoadable result =
    case result of
        Ok a ->
            Ready a

        Err _ ->
            Error
