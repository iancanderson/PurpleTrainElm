module Update exposing (..)

import Task
import Date exposing (Date)

import StopPicker.Update as StopPicker
import StopPicker.Model as StopPicker
import StopPicker.Translate as StopPicker
import Types exposing (..)
import Model exposing (..)
import Message exposing (..)
import FetchSchedule exposing (..)
import FetchRoutes exposing (..)
import String
import NativeUi.AsyncStorage as AsyncStorage

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
        ChangeDirection ->
            let newDirection = toggleDirection model.direction
            in
              ( { model | direction = newDirection }, Cmd.none )
        PickStop routeStop ->
            ( { model
              | selectedRouteStop = Just routeStop
              , stopPickerOpen = False
              }
            , Cmd.batch
              [ Task.attempt
                  SetItem
                  ( AsyncStorage.setItem
                        "routeStop"
                        (routeStop.route.id ++ "@" ++ routeStop.stop)
                  )
              , fetchSchedule model.direction (Just routeStop)
              ]
            )

        GetItem result ->
            case result of
                Ok Nothing -> ( model, fetchRoutes )
                Ok (Just routeStopString) ->
                  let
                    routeStop =
                      case String.split "@" routeStopString of
                          [routeId, stop] ->
                            Just (RouteStop (Route "asdf" [] routeId) stop)
                          _ -> Nothing
                  in
                    ( { model | selectedRouteStop = routeStop }
                    , Cmd.batch
                        [ fetchRoutes
                        , fetchSchedule model.direction routeStop
                        ]
                    )
                Result.Err _ -> ( model, fetchRoutes )
        SetItem result ->
            case result of
                Ok _ ->
                  ( model, Cmd.none )
                Result.Err a ->
                    ( model, Cmd.none )
        LoadRoutes result ->
            case result of
                Ok routes -> ( { model | routes = routes }, Cmd.none)
                Result.Err _ -> ( model, Cmd.none )
        LoadSchedule direction result ->
            case result of
                Ok schedule ->
                    case direction of
                        Inbound -> ( { model | inboundSchedule = schedule }, Cmd.none)
                        Outbound -> ( { model | outboundSchedule = schedule }, Cmd.none)
                Result.Err _ -> ( model, Cmd.none )
        ToggleStopPicker ->
            ( { model | stopPickerOpen = not model.stopPickerOpen }, Cmd.none)

        Minute now ->
            ( { model | now = Date.fromTime now }
            , Task.attempt
                  GetItem
                  (AsyncStorage.getItem "routeStop")
            )

toggleDirection : Direction -> Direction
toggleDirection direction =
    case direction of
        Inbound -> Outbound
        Outbound -> Inbound
