module StopPicker.View exposing (view)

import NativeUi as Ui exposing (Node)
import NativeUi.Style as Style exposing (defaultTransform)
import NativeUi.Elements as Elements exposing (..)
import NativeUi.Properties exposing (..)
import NativeUi.Events exposing (..)

import StopPicker.Model exposing (..)
import StopPicker.Update exposing (..)
import Types exposing (..)

view : Routes -> Model -> Node Msg
view routes model =
    case model.selectedRoute of
        Just route -> stopPicker route
        Nothing -> routePicker routes


stopPicker : Route -> Node Msg
stopPicker route =
    Elements.view
        []
        ( List.map (stopButton route) route.stops)

stopButton : Route -> Stop -> Node Msg
stopButton route stop =
  text
    [ onPress (External (PickStop (RouteStop route stop)))
    ]
    [ Ui.string stop ]


routePicker : Routes -> Node Msg
routePicker routes =
    Elements.view
        []
        ( List.map routeButton routes)


routeButton : Route -> Node Msg
routeButton route =
  text
    [ onPress (Internal (PickRoute route))
    ]
    [ Ui.string route.name ]
