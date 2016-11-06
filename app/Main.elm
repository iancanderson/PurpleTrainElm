module Main exposing (..)

import NativeUi

import Model exposing (Model, initialModel)
import Update exposing (update)
import Message exposing (Msg)
import View exposing (view)
import FetchRoutes exposing (fetchRoutes)


main : Program Never Model Msg
main =
    NativeUi.program
        { init = ( initialModel, fetchRoutes )
        , view = view
        , update = update
        , subscriptions = \_ -> Sub.none
        }
