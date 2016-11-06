module StopPicker.View exposing (view)

import NativeUi as Ui exposing (Node)
import NativeUi.Style as Style exposing (defaultTransform)
import NativeUi.Elements as Elements exposing (..)
import NativeUi.Properties exposing (..)
import NativeUi.Events exposing (..)

import StopPicker exposing (..)
import Model as App
import Types exposing (..)

view : App.Model -> Node Msg
view model =
    Elements.view
        [
        ]
        ( List.map (routePicker model.stopPicker.selectedRoute) model.routes)


routePicker : Maybe Route -> Route -> Node Msg
routePicker selectedRoute route =
  text
    [ onPress (PickRoute route)
    , Ui.style <| routeStyle selectedRoute route
    ]
    [ Ui.string route.name ]

routeStyle : Maybe Route -> Route -> List Style.Style
routeStyle selectedRoute route =
    if selectedRoute == Just route then
        [ Style.color "red"
        ]
    else
        []
