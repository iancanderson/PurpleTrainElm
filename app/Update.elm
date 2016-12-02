module Update exposing (..)

import Task
import Date exposing (Date)

import Types exposing (..)
import Model exposing (..)
import Message exposing (..)
import FetchSchedule exposing (..)
import String
import NativeUi.AsyncStorage as AsyncStorage

update : Msg -> Model -> ( Model, Cmd Msg )
update msg model =
    case msg of
        ChangeDirection ->
            let newDirection = toggleDirection model.direction
            in
              ( { model | direction = newDirection }, Cmd.none )
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
                    ( AsyncStorage.setItem stopKey stop
                    )
                ] ++ fetchSchedules stop
            )

        GetItem result ->
            case result of
                Ok Nothing -> ( model, Cmd.none )
                Ok (Just stop) ->
                    ( { model | selectedStop = Just stop }
                    , Cmd.batch <| fetchSchedules stop
                    )
                Result.Err _ -> ( model, Cmd.none )
        SetItem result ->
            case result of
                Ok _ ->
                  ( model, Cmd.none )
                Result.Err a ->
                    ( model, Cmd.none )
        LoadStops result ->
            case result of
                Ok stops -> ( { model | stops = Ready stops }, Cmd.none)
                Result.Err _ -> ( model, Cmd.none )
        LoadSchedule direction result ->
            case result of
                Ok schedule ->
                    case direction of
                        Inbound -> ( { model | inboundSchedule = Ready schedule }, Cmd.none)
                        Outbound -> ( { model | outboundSchedule = Ready schedule }, Cmd.none)
                Result.Err _ -> ( model, Cmd.none )
        ToggleStopPicker ->
            ( { model | stopPickerOpen = not model.stopPickerOpen }, Cmd.none)

        Minute now ->
            ( { model | now = Date.fromTime now }
            , Task.attempt
                  GetItem
                  (AsyncStorage.getItem stopKey)
            )

stopKey : String
stopKey = "stop"


toggleDirection : Direction -> Direction
toggleDirection direction =
    case direction of
        Inbound -> Outbound
        Outbound -> Inbound


fetchSchedules : Stop -> List (Cmd Msg)
fetchSchedules stop =
    [ fetchSchedule Inbound stop
    , fetchSchedule Outbound stop
    ]
