module StopPicker exposing (..)

import NativeUi as Ui exposing (Node)
import NativeUi.Style as Style exposing (defaultTransform)
import NativeUi.Elements as Elements exposing (..)
import NativeUi.Properties exposing (..)
import NativeUi.Events exposing (..)

import Model exposing (..)
import Update exposing (..)

view : Routes -> Node Msg
view routes =
    Elements.view
        [
        ]
        ( List.map (\r -> text [] [ Ui.string r.name ]) routes)
