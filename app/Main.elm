module Main exposing (..)

import NativeUi

import Model exposing (Model, initialModel)
import Update exposing (update)
import Message exposing (Msg)
import View exposing (view)
import NativeUi.AsyncStorage as AsyncStorage
import Message exposing (..)
import Task
import Time exposing (every, minute)
import FetchRoutes exposing (..)

subscriptions : Model -> Sub Msg
subscriptions _ = every minute Minute


init : (Model, Cmd Msg)
init =
  ( initialModel
  , Cmd.batch
        [ Task.perform Minute Time.now
        , fetchRoutes
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
