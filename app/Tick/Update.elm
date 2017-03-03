module Tick.Update exposing (tick)

import Date exposing (Date)
import Time exposing (Time)
import FetchAlertsAndSchedules exposing (fetchAlertsAndSchedules)
import FetchStops exposing (..)
import Message exposing (..)
import Model exposing (Model)
import Types exposing (..)


tick : Model -> Time -> ( Model, Cmd Msg )
tick model now =
    ( { model | now = Date.fromTime now }
    , tickCommand model
    )


tickCommand : Model -> Cmd Msg
tickCommand model =
    case ( model.selectedStop, model.stopPickerDataSource ) of
        ( Nothing, Error ) ->
            fetchStops

        ( Just selectedStop, _ ) ->
            fetchAlertsAndSchedules selectedStop

        _ ->
            Cmd.none
