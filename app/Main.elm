port module Main exposing (..)

import NativeUi
import Model exposing (Model, initialModel)
import Update exposing (update)
import Message exposing (Msg(..))
import View exposing (view)
import NativeUi.AsyncStorage as AsyncStorage
import Message exposing (..)
import Task
import Time exposing (Time, every, second)
import FetchStops exposing (..)
import App.Settings as Settings


port deviceTokenChanged : (String -> msg) -> Sub msg


subscriptions : Model -> Sub Msg
subscriptions _ =
    Sub.batch
        [ every (seconds 10) Tick
        , deviceTokenChanged DeviceTokenChanged
        ]


loadSettings : Cmd Msg
loadSettings =
    AsyncStorage.multiGet Settings.allKeys
        |> Task.map Settings.fromDict
        |> Task.attempt ReceiveSettings


init : ( Model, Cmd Msg )
init =
    ( initialModel
    , Cmd.batch
        [ loadSettings
        , Task.perform Tick Time.now
        , fetchStops
        ]
    )


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
