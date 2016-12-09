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


init : ( Model, Cmd Msg )
init =
    ( initialModel
    , Cmd.batch
        [ Task.perform Tick Time.now
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
