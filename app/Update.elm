module Update exposing (..)

import StopPicker.Update as StopPicker
import StopPicker.Model as StopPicker
import StopPicker.Translate as StopPicker
import Types exposing (..)
import Model exposing (..)
import Message exposing (..)
import FetchSchedule exposing (..)

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
        ChangeDirection direction ->
            ( { model | direction = direction }
            , fetchSchedule direction model.selectedRouteStop )
        PickStop routeStop ->
            ( { model
              | selectedRouteStop = Just routeStop
              , stopPickerOpen = False
              }
            , fetchSchedule model.direction (Just routeStop) )
        LoadRoutes result ->
            case result of
                Ok routes -> ( { model | routes = routes }, Cmd.none)
                Result.Err _ -> ( model, Cmd.none )
        LoadSchedule result ->
            case result of
                Ok schedule -> ( { model | schedule = schedule }, Cmd.none)
                Result.Err _ -> ( model, Cmd.none )
        ToggleStopPicker ->
            ( { model | stopPickerOpen = not model.stopPickerOpen }, Cmd.none)
