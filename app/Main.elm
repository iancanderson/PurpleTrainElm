module Main exposing (..)

import NativeUi
import Model exposing (Model, initialModel)
import Update exposing (update)
import Message exposing (Msg)
import View exposing (view)
import NativeUi.AsyncStorage as AsyncStorage
import Message exposing (..)
import Task
import Time exposing (Time, every, second)
import FetchStops exposing (..)


subscriptions : Model -> Sub Msg
subscriptions _ =
    every (seconds 10) Tick


dismissedAlertsKey : String
dismissedAlertsKey =
    "dismissed_alert_ids"


stopKey : String
stopKey =
    "stop"


loadSettings : Cmd Msg
loadSettings =
    Task.attempt ReceiveSettings (AsyncStorage.multiGet [ stopKey, dismissedAlertsKey ])


init : ( Model, Cmd Msg )
init =
    ( initialModel
    , Cmd.batch
        [ loadSettings
        , Task.perform Tick Time.now
        , fetchStops
        ]
    )


id a =
    a


main : Program Never Model Msg
main =
    NativeUi.program
        { init = init
        , view = view
        , update = update
        , subscriptions = subscriptions
        }


seconds : Float -> Time
seconds magnitude =
    magnitude * second
