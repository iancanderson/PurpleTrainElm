module Main exposing (..)

import NativeUi

import Model exposing (Model, initialModel)
import Update exposing (update)
import Message exposing (Msg)
import View exposing (view)
import NativeUi.AsyncStorage as AsyncStorage
import Message exposing (..)
import Task


main : Program Never Model Msg
main =
    NativeUi.program
        { init = ( initialModel, Task.attempt
                  GetItem
                  (AsyncStorage.getItem "routeStop") )
        , view = view
        , update = update
        , subscriptions = \_ -> Sub.none
        }
