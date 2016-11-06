module Update exposing (..)

import StopPicker.Update as StopPicker
import StopPicker.Model as StopPicker
import StopPicker.Translate as StopPicker
import Types exposing (..)
import Model exposing (..)
import Message exposing (..)

update : Msg -> Model -> ( Model, Cmd Msg )
update msg model =
    case msg of
        StopPickerMsg (StopPicker.External msg) -> update (StopPicker.translate msg) model
        StopPickerMsg (StopPicker.Internal subMsg) ->
            let
                ( updatedStopPicker, stopPickerCmd ) =
                    StopPicker.update subMsg model.stopPicker
            in
                ( { model | stopPicker = updatedStopPicker }
                , Cmd.map StopPickerMsg stopPickerCmd )
        PickStop routeStop ->
            ( { model | selectedRouteStop = Just routeStop }
            , Cmd.none )
        LoadRoutes (Ok routes) ->
            ( { model | routes = routes }, Cmd.none)
        LoadRoutes (Result.Err _) ->
            ( model, Cmd.none )
