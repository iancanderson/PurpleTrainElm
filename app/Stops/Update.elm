module Stops.Update exposing (receiveStops, pickStop)

import Http
import NativeUi.AsyncStorage as AsyncStorage
import NativeUi.ListView exposing (updateDataSource, emptyDataSource)
import Task
import App.Settings as Settings
import FetchAlertsAndSchedules exposing (fetchAlertsAndSchedules)
import UpsertInstallation exposing (upsertInstallation)
import Message exposing (Msg(..))
import Model exposing (Model)
import Types exposing (..)


receiveStops : Model -> Result Http.Error Stops -> ( Model, Cmd Msg )
receiveStops model result =
    let
        stopPickerDataSource =
            case ( result, model.stopPickerDataSource ) of
                ( Ok stops, Ready originalDataSource ) ->
                    Ready (updateDataSource stops originalDataSource)

                ( Ok stops, _ ) ->
                    Ready (updateDataSource stops emptyDataSource)

                ( Err _, Ready originalDataSource ) ->
                    model.stopPickerDataSource

                ( Err e, _ ) ->
                    Error
    in
        ( { model | stopPickerDataSource = stopPickerDataSource }, Cmd.none )


pickStop : Model -> Stop -> ( Model, Cmd Msg )
pickStop model stop =
    ( { model
        | selectedStop = Just stop
        , stopPickerOpen = False
        , inboundSchedule = Loading
        , outboundSchedule = Loading
      }
    , Cmd.batch <|
        [ Task.attempt
            SetItem
            (AsyncStorage.setItem Settings.stopKey <| stopToString stop)
        , fetchAlertsAndSchedules stop
        , Maybe.map (upsertInstallation stop) model.deviceToken
            |> Maybe.withDefault Cmd.none
        ]
    )
