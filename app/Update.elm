module Update exposing (..)

import Task
import Date exposing (Date)
import Types exposing (..)
import Model exposing (..)
import Message exposing (..)
import FetchAlerts exposing (..)
import FetchStops exposing (..)
import FetchSchedule exposing (..)
import ReportIssue
import String
import NativeUi.AsyncStorage as AsyncStorage
import NativeUi.ListView exposing (updateDataSource, emptyDataSource)
import App.Settings as Settings


update : Msg -> Model -> ( Model, Cmd Msg )
update msg model =
    case msg of
        IssueResponse _ ->
            ( model, Cmd.none )

        PickStop stop ->
            ( { model
                | selectedStop = Just stop
                , stopPickerOpen = False
                , inboundSchedule = Loading
                , outboundSchedule = Loading
              }
            , Cmd.batch <|
                [ Task.attempt
                    SetItem
                    (AsyncStorage.setItem Settings.stopKey stop)
                , fetchAlertsAndSchedules stop
                ]
            )

        GetItem result ->
            case result of
                Ok Nothing ->
                    ( model, Cmd.none )

                Ok (Just stop) ->
                    ( { model | selectedStop = Just stop }
                    , fetchAlertsAndSchedules stop
                    )

                Result.Err _ ->
                    ( model, Cmd.none )

        SetItem result ->
            case result of
                Ok _ ->
                    ( model, Cmd.none )

                Result.Err a ->
                    ( model, Cmd.none )

        LoadAlerts result ->
            ( { model | alerts = Ready result }, Cmd.none )

        LoadStops result ->
            let
                stopPickerDataSource =
                    case ( result, model.stopPickerDataSource ) of
                        ( Ok stops, Ready (Ok originalDataSource) ) ->
                            Ready (Ok <| updateDataSource originalDataSource stops)

                        ( Ok stops, _ ) ->
                            Ready (Ok <| updateDataSource emptyDataSource stops)

                        ( Err _, Ready (Ok originalDataSource) ) ->
                            model.stopPickerDataSource

                        ( Err e, _ ) ->
                            Ready (Err e)
            in
                ( { model | stopPickerDataSource = stopPickerDataSource }, Cmd.none )

        LoadSchedule direction result ->
            case direction of
                Inbound ->
                    ( { model | inboundSchedule = Ready result }, Cmd.none )

                Outbound ->
                    ( { model | outboundSchedule = Ready result }, Cmd.none )

        ToggleStopPicker ->
            ( { model | stopPickerOpen = not model.stopPickerOpen }, Cmd.none )

        Tick now ->
            let
                fetchStopsOrLoadCurrentStop =
                    case model.stopPickerDataSource of
                        Ready (Err _) ->
                            fetchStops

                        _ ->
                            Task.attempt GetItem (AsyncStorage.getItem Settings.stopKey)

                tickCommand =
                    case model.selectedStop of
                        Nothing ->
                            fetchStopsOrLoadCurrentStop

                        Just selectedStop ->
                            fetchAlertsAndSchedules selectedStop
            in
                ( { model | now = Date.fromTime now }
                , tickCommand
                )

        ReportIssue direction mstop ->
            let
                cmd =
                    case mstop of
                        Nothing ->
                            Cmd.none

                        Just stop ->
                            ReportIssue.report direction stop
            in
                ( model, cmd )

        ToggleAlerts ->
            ( { model | alertsAreExpanded = not model.alertsAreExpanded }, Cmd.none )

        DismissAlert alert ->
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

        ReceiveSettings settingsResult ->
            case settingsResult of
                Result.Err _ ->
                    ( model, Cmd.none )

                Result.Ok settings ->
                    let
                        stop =
                            Settings.stop settings

                        dismissedAlertIds =
                            Settings.dismissedAlertIds settings
                    in
                        ( { model | dismissedAlertIds = dismissedAlertIds, selectedStop = stop }, Cmd.none )


saveDismissedAlertsCommand : List Int -> Cmd Msg
saveDismissedAlertsCommand dismissedAlertIds =
    let
        dismissedAlertIdsCsv =
            String.join "," <| List.map toString dismissedAlertIds
    in
        Task.attempt
            SetItem
            (AsyncStorage.setItem Settings.dismissedAlertsKey dismissedAlertIdsCsv)


toggleDirection : Direction -> Direction
toggleDirection direction =
    case direction of
        Inbound ->
            Outbound

        Outbound ->
            Inbound


fetchAlertsAndSchedules : Stop -> Cmd Msg
fetchAlertsAndSchedules stop =
    Cmd.batch
        [ fetchSchedule Inbound stop
        , fetchSchedule Outbound stop
        , fetchAlerts stop
        ]
