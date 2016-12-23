module Update exposing (..)

import Task
import Date exposing (Date)
import Types exposing (..)
import Model exposing (..)
import Message exposing (..)
import FetchStops exposing (..)
import FetchSchedule exposing (..)
import ReportIssue
import String
import NativeUi.AsyncStorage as AsyncStorage


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
                    (AsyncStorage.setItem stopKey stop)
                ]
                    ++ fetchSchedules stop
            )

        GetItem result ->
            case result of
                Ok Nothing ->
                    ( model, Cmd.none )

                Ok (Just stop) ->
                    ( { model | selectedStop = Just stop }
                    , Cmd.batch <| fetchSchedules stop
                    )

                Result.Err _ ->
                    ( model, Cmd.none )

        SetItem result ->
            case result of
                Ok _ ->
                    ( model, Cmd.none )

                Result.Err a ->
                    ( model, Cmd.none )

        LoadStops result ->
            ( { model | stops = Ready result }, Cmd.none )

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
                task =
                    case model.stops of
                        Ready (Err _) ->
                            fetchStops

                        _ ->
                            Task.attempt GetItem (AsyncStorage.getItem stopKey)
            in
                ( { model | now = Date.fromTime now }, task )

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


stopKey : String
stopKey =
    "stop"


toggleDirection : Direction -> Direction
toggleDirection direction =
    case direction of
        Inbound ->
            Outbound

        Outbound ->
            Inbound


fetchSchedules : Stop -> List (Cmd Msg)
fetchSchedules stop =
    [ fetchSchedule Inbound stop
    , fetchSchedule Outbound stop
    ]
