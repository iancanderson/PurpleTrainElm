module Main exposing (..)

import NativeUi

import Model exposing (Model, initialModel)
import Update exposing (Msg, update)
import View exposing (view)


main : Program Never Model Msg
main =
    NativeUi.program
        { init = ( initialModel, Cmd.none )
        , view = view
        , update = update
        , subscriptions = \_ -> Sub.none
        }
